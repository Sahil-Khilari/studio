export type FileItem = {
  id: string;
  name: string;
  type: 'folder' | 'document' | 'image' | 'video' | 'audio';
  modified: string;
  size?: string;
  isFavorite: boolean;
};
