"use client";

import { useEffect } from 'react';
import { useFiles } from '@/context/file-context';
import { Breadcrumbs } from '@/components/cloud-drive/breadcrumbs';
import { FileGrid } from '@/components/cloud-drive/file-grid';
import { PageLayout } from '@/components/cloud-drive/page-layout';

export default function MyFilesPage({ params }: { params: { path?: string[] } }) {
  const { navigateTo } = useFiles();
  const folderId = params.path?.[0] || null;

  useEffect(() => {
    // This effect synchronizes the URL with the context's state.
    // This is useful for initial load and browser back/forward navigation.
    navigateTo(folderId);
  }, [folderId, navigateTo]);
  
  return (
    <PageLayout>
        <div className="space-y-4">
            <Breadcrumbs />
            <FileGrid />
        </div>
    </PageLayout>
  );
}
