import React, { useRef, useEffect, useState } from "react";
import { Play, Pause, Download } from "lucide-react";
import { Background } from "./BackgroundSelector";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VideoPreviewProps {
  videoFile: File | null;
  background: Background | null;
  opacity: number;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  videoFile,
  background,
  opacity,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas1Ref = useRef<HTMLCanvasElement | null>(null);
  const canvas2Ref = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  console.log(videoURL);
  const animationRef = useRef<number>(0);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoURL(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [videoFile]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);
    const handleLoaded = () => setHasLoaded(true);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("loadeddata", handleLoaded);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("loadeddata", handleLoaded);
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !background || !hasLoaded)
      return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const bgImage = new Image();
    bgImage.src = background.src;
    bgImage.onload = () => {
      if (!isPlaying) drawFrame();
    };

    const drawFrame = () => {
      if (!video || !ctx || !bgImage) return;

      // Draw background
      ctx.globalAlpha = 1;
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

      // Draw video with opacity
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = opacity;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Reset composite operation
      ctx.globalCompositeOperation = "source-over";

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(drawFrame);
      }
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(drawFrame);
    } else {
      drawFrame();
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [videoRef, canvasRef, background, isPlaying, opacity, hasLoaded]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const downloadResult = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "video-with-background.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    toast("Frame captured and downloaded successfully");
  };

  ///my codes

  const handleLoad = () => {
    if (!videoFile) {
      alert("no video uploaded");
      return;
    }

    const videoElement = videoRef.current;
    if (!videoElement) {
      alert("no video ref");
      return;
    }

    togglePlayPause();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gradient">Preview</h2>

      <div className="glass-morphism p-1 rounded-lg relative aspect-video h-[500px]">
        {/* {!videoFile && !background && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Upload a video and select a background to see the preview
            </p>
          </div>
        )} */}

        <video
          ref={videoRef}
          src={videoURL || undefined}
          className="absolute inset-0 object-contain h-full w-full"
          loop
        />

        {/* <canvas
          ref={canvasRef}
          className="w-full h-full rounded  object-contain"
        /> */}
      </div>
      <div className="flex flex-col justify-start  items-start ">
        <Button
          // disabled={!videoFile || !background}
          onClick={handleLoad}
          className="flex items-center gap-2"
        >
          Process Frame
        </Button>
      </div>
      <div className="inline-grid gap-4 grid-cols-2">
        <canvas
          ref={canvas1Ref}
          height={250}
          width={250}
          className="rounded-md border"
        />
        <canvas
          ref={canvas2Ref}
          height={250}
          width={250}
          className="rounded-md border"
        />
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="icon"
          disabled={!videoFile || !background}
          onClick={togglePlayPause}
          className="glass-morphism"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>

        <Button
          disabled={!videoFile || !background}
          onClick={downloadResult}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Frame
        </Button>
      </div>
    </div>
  );
};

export default VideoPreview;
