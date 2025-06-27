'use server';

import { auth, db, storage } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { suggestTags } from '@/ai/flows/suggest-tags';
import { z } from 'zod';
import { FileType } from './types';
import { headers } from 'next/headers';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = ['image', 'application', 'text', 'video', 'audio'];

function getFileType(mimeType: string): FileType {
  const mainType = mimeType.split('/')[0];
  if (mainType === 'image') return 'image';
  if (mimeType === 'application/pdf') return 'pdf';
  if (mimeType === 'text/csv') return 'csv';
  if (mainType === 'video') return 'video';
  if (mainType === 'audio') return 'audio';
  if (mimeType.includes('document') || mimeType.includes('word') || mimeType.includes('excel') || mimeType.includes('powerpoint')) return 'document';
  if (mimeType.includes('zip') || mimeType.includes('rar')) return 'archive';
  return 'other';
}

// Action to create a new folder
const CreateFolderSchema = z.object({
  name: z.string().min(1, 'Folder name is required.'),
  parentId: z.string().nullable(),
  path: z.array(z.string()),
});

export async function createNewFolderAction(values: z.infer<typeof CreateFolderSchema>) {
    const headersList = headers();
    const customToken = headersList.get('X-Firebase-AppCheck');
    if (!customToken) {
        throw new Error('Unauthorized');
    }
    // This is a placeholder. In a real app, you'd verify the token.
    // For now, we are trusting the client is authenticated via the context.
    const uid = customToken;
  
    await addDoc(collection(db, 'files'), {
      uid,
      type: 'folder',
      name: values.name,
      parentId: values.parentId,
      path: values.path,
      isStarred: false,
      isTrashed: false,
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    });
}

// Action to upload a file and get AI tags
const UploadFileSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, `File size should be less than 10MB.`)
    .refine((file) => ALLOWED_FILE_TYPES.some(type => file.type.startsWith(type)), 'Unsupported file type.'),
  description: z.string().optional(),
  parentId: z.string().nullable(),
  path: z.array(z.string()),
});

export async function uploadFileAndSuggestTagsAction(formData: FormData) {
  const headersList = headers();
  const customToken = headersList.get('X-Firebase-AppCheck');
  if (!customToken) {
    return { success: false, error: 'Unauthorized', code: 401 };
  }
  const uid = customToken;

  const rawFormData = {
    file: formData.get('file'),
    description: formData.get('description'),
    parentId: formData.get('parentId') || null,
    path: formData.getAll('path'),
  };

  const validation = UploadFileSchema.partial().safeParse(rawFormData);
  if (!validation.success || !validation.data.file) {
      console.error('Validation Error:', validation.error.flatten().fieldErrors);
      return { success: false, error: 'Invalid input.', code: 400 };
  }

  const { file, description, parentId, path } = validation.data;
  
  try {
    const storageRef = ref(storage, `uploads/${uid}/${parentId || 'root'}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    const tagSuggestions = await suggestTags({ fileName: file.name, description });

    const fileDoc = {
      uid,
      name: file.name,
      type: 'file',
      fileType: getFileType(file.type),
      url: downloadURL,
      size: file.size,
      parentId: parentId,
      path: path,
      isStarred: false,
      isTrashed: false,
      tags: tagSuggestions.tags || [],
      createdAt: serverTimestamp(),
      modifiedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'files'), fileDoc);

    return { success: true, file: { id: docRef.id, ...fileDoc } };
  } catch (error: any) {
    console.error("Upload failed:", error);
    if (error.code === 'storage/unauthorized') {
      return { success: false, error: 'Permission denied. Please check storage rules.', code: 403 };
    }
    return { success: false, error: 'An unknown error occurred during upload.', code: 500 };
  }
}
