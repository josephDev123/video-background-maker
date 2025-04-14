
import React from 'react';
import { Slider } from '@/components/ui/slider';

interface BackgroundControlsProps {
  opacity: number;
  setOpacity: (value: number) => void;
}

const BackgroundControls: React.FC<BackgroundControlsProps> = ({
  opacity,
  setOpacity,
}) => {
  return (
    <div className="glass-morphism p-6 rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Video Transparency</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <label htmlFor="opacity" className="text-sm font-medium">
            Transparency
          </label>
          <span className="text-xs text-muted-foreground">
            {Math.round(opacity * 100)}%
          </span>
        </div>
        <Slider
          id="opacity"
          min={0}
          max={1}
          step={0.01}
          value={[opacity]}
          onValueChange={(value) => setOpacity(value[0])}
        />
      </div>
    </div>
  );
};

export default BackgroundControls;
