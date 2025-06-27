"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useFiles } from "@/context/file-context";
import { CloudItem } from "@/lib/types";

interface RenameDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  item: CloudItem;
}

export function RenameDialog({ isOpen, setIsOpen, item }: RenameDialogProps) {
  const [newName, setNewName] = useState(item.name);
  const [isLoading, setIsLoading] = useState(false);
  const { renameItem } = useFiles();

  useEffect(() => {
    if (isOpen) {
      setNewName(item.name);
    }
  }, [isOpen, item.name]);

  const handleRename = async () => {
    if (!newName.trim() || newName === item.name) {
      setIsOpen(false);
      return;
    }
    setIsLoading(true);
    await renameItem(item.id, newName);
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename {item.type}</DialogTitle>
          <DialogDescription>
            Enter a new name for "{item.name}".
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Label htmlFor="name" className="sr-only">New Name</Label>
          <Input
            id="name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleRename} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
