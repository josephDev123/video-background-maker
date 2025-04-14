
import React, { useState, useRef } from 'react';
import { Upload, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoUploaderProps {
  onVideoUpload: (file: File) => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({ onVideoUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a video file',
        variant: 'destructive',
      });
      return;
    }

    setVideoFile(file);
    onVideoUpload(file);
    toast({
      title: 'Video uploaded successfully',
      description: file.name,
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold text-gradient">Upload Your Video</h2>
      
      <div
        className={`glass-morphism w-full h-48 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
          isDragging ? 'border-primary border-2' : 'border-border'
        } hover:border-primary/50`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="video/*"
          onChange={handleFileChange}
        />
        
        {videoFile ? (
          <div className="text-center">
            <Video className="w-12 h-12 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">{videoFile.name}</p>
            <span className="text-xs text-muted-foreground mt-1 block">
              Click to change video
            </span>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="w-12 h-12 mx-auto mb-2 text-primary" />
            <p className="text-white">
              Drag & drop your video here or click to browse
            </p>
            <span className="text-xs text-muted-foreground mt-1 block">
              Supports MP4, WebM, and MOV formats
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoUploader;
