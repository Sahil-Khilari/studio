"use client";

import { useFiles } from '@/context/file-context';
import { CloudItem } from '@/lib/types';
import { FileItem } from './file-item';
import { LoadingSpinner } from '../loading-spinner';

export function FileGrid() {
  const { items, isLoading, searchQuery } = useFiles();

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const folders = filteredItems.filter(item => item.type === 'folder');
  const files = filteredItems.filter(item => item.type === 'file');

  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (filteredItems.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card p-12 text-center h-[400px]">
        <h3 className="text-xl font-bold tracking-tight">This folder is empty</h3>
        <p className="text-sm text-muted-foreground">Upload a file or create a new folder to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {folders.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground">Folders</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {folders.map(item => <FileItem key={item.id} item={item} />)}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground">Files</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {files.map(item => <FileItem key={item.id} item={item} />)}
          </div>
        </div>
      )}
    </div>
  );
}
