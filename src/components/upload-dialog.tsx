"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";
import { suggestTags } from "@/ai/flows/suggest-tags";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export function UploadDialog() {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setIsLoading(true);
      setTags([]);
      
      const mockFileContent = `Project Sky-High: A Comprehensive Plan for Cloud Infrastructure. This document outlines the strategy for migrating our services to a new cloud platform, focusing on scalability, security, and cost-efficiency. It includes market analysis, technical specifications, and a detailed project timeline for Q3-Q4.`;

      try {
        const result = await suggestTags({ fileContent: mockFileContent });
        setTags(result.tags);
      } catch (error) {
        console.error("Error suggesting tags:", error);
        toast({
          variant: "destructive",
          title: "AI Error",
          description: "Could not suggest tags for this file.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const resetState = () => {
    setFileName("");
    setTags([]);
    setIsLoading(false);
    const fileInput = document.getElementById('file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    if(!isOpen) {
      resetState();
    }
    setOpen(isOpen);
  }

  const handleUpload = () => {
    toast({
      title: "Upload Successful",
      description: `${fileName} has been uploaded with tags: ${tags.join(", ")}.`,
    });
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Upload className="mr-2 h-4 w-4" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Choose a file to upload. AI will suggest tags to help you organize it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              File
            </Label>
            <Input id="file" type="file" className="col-span-3" onChange={handleFileChange} />
          </div>
          {fileName && (
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Tags</Label>
              <div className="col-span-3 min-h-[4rem]">
                {isLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing file and generating tags...</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1 pl-2.5 pr-1 py-1 text-sm">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className="rounded-full hover:bg-muted-foreground/20 p-0.5">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {tags.length === 0 && <p className="text-sm text-muted-foreground">No tags suggested.</p>}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleUpload} disabled={!fileName || isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" /> }
            Upload File
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
