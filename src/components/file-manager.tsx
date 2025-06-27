import { FileItem } from "@/lib/types";
import { Folder, FileText, MoreVertical, Image as ImageIcon, Video, FileAudio, List, Grid } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadDialog } from "./upload-dialog";
import { NewFolderDialog } from "./new-folder-dialog";

const mockFiles: FileItem[] = [
  { id: '1', name: "Project Alpha", type: 'folder', modified: "2 days ago", isFavorite: false },
  { id: '2', name: "Marketing Plan.docx", type: 'document', modified: "3 days ago", size: "2.3MB", isFavorite: true },
  { id: '3', name: "Website Mockups", type: 'folder', modified: "5 days ago", isFavorite: false },
  { id: '4', name: "header-logo.png", type: 'image', modified: "6 days ago", size: "128KB", isFavorite: false },
  { id: '5', name: "Company Retreat.mp4", type: 'video', modified: "1 week ago", size: "540MB", isFavorite: false },
  { id: '6', name: "Q3_Report.pdf", type: 'document', modified: "2 weeks ago", size: "1.1MB", isFavorite: false },
  { id: '7', name: "Podcast_Intro.mp3", type: 'audio', modified: "1 month ago", size: "5.2MB", isFavorite: true },
  { id: '8', name: "Old Projects", type: 'folder', modified: "2 months ago", isFavorite: false },
];

const FileIcon = ({ type }: { type: FileItem['type'] }) => {
  const iconClass = "h-8 w-8 text-muted-foreground";
  switch (type) {
    case 'folder': return <Folder className="h-8 w-8 text-primary" />;
    case 'document': return <FileText className={iconClass} />;
    case 'image': return <ImageIcon className={iconClass} />;
    case 'video': return <Video className={iconClass} />;
    case 'audio': return <FileAudio className={iconClass} />;
    default: return <FileText className={iconClass} />;
  }
};

export default function FileManager() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight font-headline">My Drive</h1>
        <div className="flex items-center gap-2">
          <Input placeholder="Search files..." className="max-w-xs" />
          <NewFolderDialog />
          <UploadDialog />
          <Button variant="outline" size="icon"><List className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" className="bg-secondary"><Grid className="h-4 w-4" /></Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {mockFiles.map((file) => (
          <Card key={file.id} className="group relative cursor-pointer transition-shadow duration-200 hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between p-4">
              <FileIcon type={file.type} />
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <CardTitle className="truncate text-base font-semibold leading-none tracking-tight">{file.name}</CardTitle>
            </CardContent>
            <CardFooter className="flex justify-between p-4 pt-0 text-xs text-muted-foreground">
              <span>{file.size || '...'}</span>
              <span>{file.modified}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
