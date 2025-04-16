import React, { useState } from "react";
import VideoUploader from "@/components/VideoUploader";
import BackgroundSelector, {
  Background,
} from "@/components/BackgroundSelector";
import VideoPreview from "@/components/VideoPreview";
import BackgroundControls from "@/components/BlendControls";
import { Toaster } from "@/components/ui/sonner";
import { backgrounds } from "@/data";

const Index = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  console.log(videoFile);
  const [selectedBackground, setSelectedBackground] =
    useState<Background | null>(null);
  const [opacity, setOpacity] = useState<number>(0.8);

  const handleVideoUpload = (file: File) => {
    setVideoFile(file);
  };

  const handleBackgroundSelect = (background: Background) => {
    setSelectedBackground(background);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="container mx-auto py-6 text-center rel">
        <img
          src="/logo.png"
          alt="logo"
          className="sm:size-16 size-8 rounded-md self-start absolute left-2 top-6"
        />
        <h1 className="sm:text-4xl text-xl font-bold text-gradient">
          Video Background Maker
        </h1>
        <p className="text-muted-foreground mt-2">
          Add beautiful backgrounds to your videos in seconds
        </p>
      </header>

      <main className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 col-span-1 space-y-8">
            <VideoPreview
              videoFile={videoFile}
              background={selectedBackground}
              opacity={opacity}
            />

            <BackgroundControls opacity={opacity} setOpacity={setOpacity} />
          </div>

          <div className="space-y-8">
            <VideoUploader onVideoUpload={handleVideoUpload} />

            <BackgroundSelector
              backgrounds={backgrounds}
              selectedBackground={selectedBackground}
              onSelect={handleBackgroundSelect}
            />
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
};

export default Index;
