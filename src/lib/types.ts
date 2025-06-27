import { Timestamp } from 'firebase/firestore';

export type FileType = 'image' | 'pdf' | 'csv' | 'video' | 'audio' | 'document' | 'archive' | 'other';

export interface CloudFile {
  id: string;
  name: string;
  type: 'file';
  fileType: FileType;
  uid: string;
  url: string;
  size: number;
  isStarred: boolean;
  isTrashed: boolean;
  path: string[];
  parentId: string | null;
  tags: string[];
  createdAt: Timestamp;
  modifiedAt: Timestamp;
  trashedAt?: Timestamp | null;
}

export interface CloudFolder {
  id: string;
  name: string;
  type: 'folder';
  uid: string;
  isStarred: boolean;
  isTrashed: boolean;
  path: string[];
  parentId: string | null;
  createdAt: Timestamp;
  modifiedAt: Timestamp;
  trashedAt?: Timestamp | null;
}

export type CloudItem = CloudFile | CloudFolder;

export interface BreadcrumbItem {
  id: string;
  name: string;
}
