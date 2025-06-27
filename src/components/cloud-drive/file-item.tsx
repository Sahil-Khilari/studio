"use client";

import { useState } from 'react';
import { CloudItem, CloudFile, CloudFolder } from '@/lib/types';
import { useFiles } from '@/context/file-context';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Folder, FileText, MoreVertical, Image, Video, Music, Archive, File as FileIcon, Star, Edit3, Trash2, Download, Undo } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { RenameDialog } from '../dialogs/rename-dialog';

const FileTypeIcon = ({ fileType }: { fileType: CloudFile['fileType'] }) => {
    const iconClass = "h-10 w-10 text-muted-foreground";
    switch (fileType) {
        case 'image': return <Image className={iconClass} />;
        case 'video': return <Video className={iconClass} />;
        case 'audio': return <Music className={iconClass} />;
        case 'pdf': return <FileText className={iconClass} />;
        case 'archive': return <Archive className={iconClass} />;
        case 'document': return <FileText className={iconClass} />;
        default: return <FileIcon className={iconClass} />;
    }
};

const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function FileItem({ item }: { item: CloudItem }) {
  const { navigateTo, starItem, trashItem, restoreItem, deletePermanently } = useFiles();
  const [isRenameOpen, setRenameOpen] = useState(false);
  
  const handleDoubleClick = () => {
    if (item.type === 'folder') {
      navigateTo(item.id, item.name);
    }
  };

  const formattedDate = item.modifiedAt ? formatDistanceToNow(item.modifiedAt.toDate(), { addSuffix: true }) : '...';

  return (
    <>
    <Card 
        className="group relative cursor-pointer transition-shadow duration-200 hover:shadow-lg"
        onDoubleClick={handleDoubleClick}
    >
      <CardHeader className="flex flex-row items-start justify-between p-4">
        {item.type === 'folder' ? 
            <Folder className="h-10 w-10 text-primary fill-primary/20" /> :
            <FileTypeIcon fileType={(item as CloudFile).fileType} />
        }
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {item.isTrashed ? (
                    <>
                        <DropdownMenuItem onClick={() => restoreItem(item.id)}>
                            <Undo className="mr-2 h-4 w-4" /> Restore
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => deletePermanently(item)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Permanently
                        </DropdownMenuItem>
                    </>
                ) : (
                    <>
                        <DropdownMenuItem onClick={() => starItem(item.id, !item.isStarred)}>
                            <Star className={`mr-2 h-4 w-4 ${item.isStarred ? 'text-yellow-400 fill-yellow-400' : ''}`} /> {item.isStarred ? 'Unstar' : 'Star'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setRenameOpen(true)}>
                            <Edit3 className="mr-2 h-4 w-4" /> Rename
                        </DropdownMenuItem>
                         {item.type === 'file' && (
                            <DropdownMenuItem asChild>
                                <a href={(item as CloudFile).url} download={item.name} target="_blank" rel="noopener noreferrer">
                                    <Download className="mr-2 h-4 w-4" /> Download
                                </a>
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => trashItem(item.id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Move to Trash
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="truncate text-sm font-semibold">{item.name}</p>
        <CardDescription className="flex justify-between text-xs">
          <span>{formattedDate}</span>
          {item.type === 'file' && <span>{formatBytes((item as CloudFile).size)}</span>}
        </CardDescription>
      </CardContent>
    </Card>
    <RenameDialog 
        isOpen={isRenameOpen} 
        setIsOpen={setRenameOpen} 
        item={item} 
    />
    </>
  );
}
