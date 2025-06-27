"use client";

import { useState, useCallback } from "react";
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, FileUp, CheckCircle, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { uploadFileAndSuggestTagsAction } from "@/lib/actions";
import { useFiles } from "@/context/file-context";
import { useAuth } from "@/context/auth-context";
import { Textarea } from "../ui/textarea";

export function UploadDialog() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { currentFolderId, path, addItemOptimistically } = useFiles();
  
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isTagging, setIsTagging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setFile(null);
    setDescription("");
    setTags([]);
    setIsUploading(false);
    setIsTagging(false);
    setUploadError(null);
  }, []);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetState();
    }
    setOpen(isOpen);
  };
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
    onDropRejected: (rejectedFiles) => {
        if (rejectedFiles[0].errors[0].code === 'file-too-large') {
            setUploadError("File is larger than 10MB");
        } else {
            setUploadError(rejectedFiles[0].errors[0].message);
        }
    }
  });

  const handleUpload = async () => {
    if (!file || !user) return;

    setIsUploading(true);
    setUploadError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    if(description) formData.append('description', description);
    if(currentFolderId) formData.append('parentId', currentFolderId);
    path.forEach(p => formData.append('path', p.id));
    
    const result = await uploadFileAndSuggestTagsAction(formData);

    setIsUploading(false);

    if (result.success && result.file) {
        toast({
            title: "Upload Successful",
            description: `${result.file.name} has been uploaded.`,
        });
        // We don't need to optimistically add because the file-context listener will pick it up
        handleOpenChange(false);
    } else {
        setUploadError(result.error || "An unknown error occurred.");
        toast({
            variant: "destructive",
            title: "Upload Failed",
            description: result.error,
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Upload className="mr-2" />
          Upload File
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Drag and drop a file or click to select. AI will suggest tags automatically.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div 
                {...getRootProps()} 
                className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
            >
                <input {...getInputProps()} />
                <FileUp className="w-10 h-10 text-muted-foreground mb-2"/>
                {file ? (
                    <p className="text-sm font-semibold text-foreground">{file.name}</p>
                ) : (
                    isDragActive ?
                    <p className="text-sm text-muted-foreground">Drop the file here...</p> :
                    <p className="text-sm text-muted-foreground">Drag 'n' drop a file here, or click to select</p>
                )}
            </div>

            {uploadError && <p className="text-sm text-destructive flex items-center gap-2"><AlertCircle className="w-4 h-4"/> {uploadError}</p>}
            
            {file && !isUploading && (
                <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea 
                        id="description"
                        placeholder="Add a description to improve AI tag suggestions..."
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
            )}
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>Cancel</Button>
          <Button type="submit" onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
