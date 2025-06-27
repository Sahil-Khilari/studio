"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FolderPlus, Loader2 } from "lucide-react";
import { useFiles } from "@/context/file-context";

export function NewFolderDialog() {
  const [open, setOpen] = useState(false);
  const [folderName, setFolderName] = useState("Untitled folder");
  const [isLoading, setIsLoading] = useState(false);
  const { createFolder } = useFiles();

  const handleCreate = async () => {
    if (!folderName.trim()) return;
    setIsLoading(true);
    await createFolder(folderName);
    setIsLoading(false);
    setOpen(false);
    setFolderName("Untitled folder");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FolderPlus className="mr-2" />
          New Folder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Folder</DialogTitle>
          <DialogDescription>
            Enter a name for your new folder.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="name" className="sr-only">Name</Label>
          <Input
            id="name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
