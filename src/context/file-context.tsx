"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { db, storage } from '@/lib/firebase';
import { 
  collection, query, where, onSnapshot, orderBy, doc, updateDoc, 
  deleteDoc, addDoc, serverTimestamp, getDoc
} from 'firebase/firestore';
import { ref, deleteObject } from "firebase/storage";
import { useAuth } from './auth-context';
import { CloudItem, BreadcrumbItem, CloudFolder, CloudFile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { createNewFolderAction } from '@/lib/actions';
import { usePathname, useRouter } from 'next/navigation';

interface FileContextType {
  items: CloudItem[];
  isLoading: boolean;
  path: BreadcrumbItem[];
  navigateTo: (folderId: string | null, folderName?: string) => void;
  currentFolderId: string | null;
  createFolder: (folderName: string) => Promise<void>;
  renameItem: (itemId: string, newName: string) => Promise<void>;
  starItem: (itemId: string, isStarred: boolean) => Promise<void>;
  trashItem: (itemId: string) => Promise<void>;
  restoreItem: (itemId: string) => Promise<void>;
  deletePermanently: (item: CloudItem) => Promise<void>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addItemOptimistically: (item: CloudItem) => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const [items, setItems] = useState<CloudItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [path, setPath] = useState<BreadcrumbItem[]>([{ id: 'root', name: 'My Files' }]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const q = query(
      collection(db, 'files'),
      where('uid', '==', user.uid),
      where('parentId', '==', currentFolderId),
      where('isTrashed', '==', false),
      orderBy('type', 'desc'), // Folders first
      orderBy('name', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CloudItem));
      setItems(fetchedItems);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching files:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch files.' });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, currentFolderId, toast]);

  const navigateTo = useCallback(async (folderId: string | null, folderName?: string) => {
    const targetFolderId = folderId === 'root' ? null : folderId;
    const newRoute = targetFolderId ? `/my-files/${targetFolderId}` : '/my-files';
    
    // Only navigate if the URL isn't already the target. This breaks the infinite loop.
    if (pathname !== newRoute) {
      router.push(newRoute);
    }
    
    // Avoid re-processing if context is already on the correct folder.
    if (targetFolderId === currentFolderId) {
      return;
    }

    if (targetFolderId === null) {
      setCurrentFolderId(null);
      setPath([{ id: 'root', name: 'My Files' }]);
      return;
    }
    
    setCurrentFolderId(targetFolderId);

    // On deep link or refresh, path isn't built sequentially. 
    // Reconstruct the breadcrumb path from the folder's stored path.
    try {
      const folderDoc = await getDoc(doc(db, 'files', targetFolderId));
      if (folderDoc.exists()) {
        const folderData = folderDoc.data();
        const breadcrumbPath: BreadcrumbItem[] = [{ id: 'root', name: 'My Files' }];
        const pathIds = (folderData.path || []).filter((id: string | null) => id && id !== 'root');

        if (pathIds.length > 0) {
          const pathDocs = await Promise.all(pathIds.map((id: string) => getDoc(doc(db, 'files', id))));
          pathDocs.forEach(docSnap => {
            if (docSnap.exists()) {
              breadcrumbPath.push({ id: docSnap.id, name: docSnap.data().name });
            }
          });
        }
        breadcrumbPath.push({ id: targetFolderId, name: folderData.name });
        setPath(breadcrumbPath);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: 'Folder not found.' });
        router.push('/my-files');
        setCurrentFolderId(null);
        setPath([{ id: 'root', name: 'My Files' }]);
      }
    } catch (e) {
      console.error("Error building path:", e);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load folder path.' });
      router.push('/my-files');
    }
  }, [router, pathname, currentFolderId, toast]);

  const createFolder = async (folderName: string) => {
    if (!user) return;
    try {
      await createNewFolderAction({
        name: folderName,
        parentId: currentFolderId,
        path: path.map(p => p.id),
      });
      toast({ title: 'Success', description: `Folder "${folderName}" created.` });
    } catch (error) {
      console.error("Error creating folder:", error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not create folder.' });
    }
  };

  const updateItem = async (itemId: string, data: Partial<CloudItem>) => {
    if (!user) return;
    const itemRef = doc(db, 'files', itemId);
    await updateDoc(itemRef, { ...data, modifiedAt: serverTimestamp() });
  };
  
  const renameItem = (itemId: string, newName: string) => updateItem(itemId, { name: newName });
  const starItem = (itemId: string, isStarred: boolean) => updateItem(itemId, { isStarred });
  const trashItem = (itemId: string) => updateItem(itemId, { isTrashed: true, trashedAt: serverTimestamp() });
  const restoreItem = (itemId: string) => updateItem(itemId, { isTrashed: false, trashedAt: null });
  
  const deletePermanently = async (item: CloudItem) => {
    if (!user) return;
    const itemRef = doc(db, 'files', item.id);
    try {
      await deleteDoc(itemRef);
      if (item.type === 'file') {
        const fileStorageRef = ref(storage, (item as CloudFile).url);
        await deleteObject(fileStorageRef).catch(err => console.error("Error deleting from storage, maybe already deleted:", err));
      }
      toast({ title: "Success", description: `"${item.name}" was permanently deleted.`});
    } catch (error) {
        console.error("Error deleting permanently:", error);
        toast({ variant: "destructive", title: "Error", description: `Could not delete "${item.name}".`});
    }
  };

  const addItemOptimistically = (item: CloudItem) => {
    setItems(prev => [item, ...prev]);
  };
  
  const value = {
    items,
    isLoading,
    path,
    navigateTo,
    currentFolderId,
    createFolder,
    renameItem,
    starItem,
    trashItem,
    restoreItem,
    deletePermanently,
    searchQuery,
    setSearchQuery,
    addItemOptimistically
  };

  return <FileContext.Provider value={value}>{children}</FileContext.Provider>;
};

export const useFiles = () => {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
};
