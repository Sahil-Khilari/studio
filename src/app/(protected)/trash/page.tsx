"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CloudItem } from '@/lib/types';
import { FileItem } from '@/components/cloud-drive/file-item';
import { PageLayout } from '@/components/cloud-drive/page-layout';
import { LoadingSpinner } from '@/components/loading-spinner';
import { useFiles } from '@/context/file-context';

export default function TrashPage() {
  const { user } = useAuth();
  const { searchQuery } = useFiles();
  const [trashedItems, setTrashedItems] = useState<CloudItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    const q = query(
      collection(db, "files"),
      where("uid", "==", user.uid),
      where("isTrashed", "==", true),
      orderBy("trashedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTrashedItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CloudItem)));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const filteredItems = trashedItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Trash</h1>
        <p className="text-muted-foreground text-sm">Items in trash will be permanently deleted after 30 days.</p>
        {isLoading ? (
          <LoadingSpinner />
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredItems.map(item => (
              <FileItem key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center h-[400px]">
            <h3 className="text-xl font-bold tracking-tight">Trash is empty</h3>
            <p className="text-sm text-muted-foreground">Move files and folders to the trash to see them here.</p>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
