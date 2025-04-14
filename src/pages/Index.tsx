import React, { useState } from 'react';
import VideoUploader from '@/components/VideoUploader';
import BackgroundSelector, { Background } from '@/components/BackgroundSelector';
import VideoPreview from '@/components/VideoPreview';
import BackgroundControls from '@/components/BlendControls';
import { Toaster } from "@/components/ui/sonner";

const Index = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<Background | null>(null);
  const [opacity, setOpacity] = useState<number>(0.8);

  const backgrounds: Background[] = [
    {
      id: '1',
      name: 'Ocean Waves',
      thumbnail: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=300&h=169&q=80',
      src: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1920&h=1080&q=80',
    },
    {
      id: '2',
      name: 'Forest',
      thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&h=169&q=80',
      src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&h=1080&q=80',
    },
    {
      id: '3',
      name: 'Mountain Fog',
      thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300&h=169&q=80',
      src: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&h=1080&q=80',
    },
    {
      id: '4',
      name: 'Digital Matrix',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300&h=169&q=80',
      src: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&h=1080&q=80',
    },
    {
      id: '5',
      name: 'Cozy Room',
      thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=300&h=169&q=80',
      src: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=1920&h=1080&q=80',
    },
    {
      id: '6',
      name: 'Tech Workspace',
      thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300&h=169&q=80',
      src: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1920&h=1080&q=80',
    },
    {
      id: '7',
      name: 'Cute Cat',
      thumbnail: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=300&h=169&q=80',
      src: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=1920&h=1080&q=80',
    },
    {
      id: '8',
      name: 'Living Room',
      thumbnail: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=300&h=169&q=80',
      src: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=1920&h=1080&q=80',
    },
  ];

  const handleVideoUpload = (file: File) => {
    setVideoFile(file);
  };

  const handleBackgroundSelect = (background: Background) => {
    setSelectedBackground(background);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="container mx-auto py-6 text-center">
        <h1 className="text-4xl font-bold text-gradient">Video Background Maker</h1>
        <p className="text-muted-foreground mt-2">
          Add beautiful backgrounds to your videos in seconds
        </p>
      </header>

      <main className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <VideoPreview 
              videoFile={videoFile} 
              background={selectedBackground} 
              opacity={opacity}
            />
            
            <BackgroundControls 
              opacity={opacity}
              setOpacity={setOpacity}
            />
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
