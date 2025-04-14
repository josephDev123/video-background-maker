
import React from 'react';
import { Check } from 'lucide-react';

export interface Background {
  id: string;
  name: string;
  thumbnail: string;
  src: string;
}

interface BackgroundSelectorProps {
  backgrounds: Background[];
  selectedBackground: Background | null;
  onSelect: (background: Background) => void;
}

const BackgroundSelector: React.FC<BackgroundSelectorProps> = ({
  backgrounds,
  selectedBackground,
  onSelect,
}) => {
  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-bold text-gradient">Choose a Background</h2>
      <p className="text-sm text-muted-foreground">Select a background to place behind your video</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {backgrounds.map((background) => (
          <div 
            key={background.id}
            className={`relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 aspect-video ${
              selectedBackground?.id === background.id 
                ? 'ring-2 ring-primary' 
                : 'hover:ring-1 hover:ring-primary/50'
            }`}
            onClick={() => onSelect(background)}
          >
            <img 
              src={background.thumbnail} 
              alt={background.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 transition-opacity duration-300">
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-white text-xs font-medium truncate">
                  {background.name}
                </p>
              </div>
            </div>
            {selectedBackground?.id === background.id && (
              <div className="absolute top-2 right-2 bg-primary rounded-full p-1 shadow-lg">
                <Check className="w-3 h-3 text-black" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundSelector;
