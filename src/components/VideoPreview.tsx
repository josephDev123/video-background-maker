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
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
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

  // useEffect(() => {
  //   const video = videoRef.current;
  //   if (!video) return;

  //   const handlePlay = () => setIsPlaying(true);
  //   const handlePause = () => setIsPlaying(false);
  //   const handleEnded = () => setIsPlaying(false);
  //   const handleLoaded = () => setHasLoaded(true);

  //   video.addEventListener("play", handlePlay);
  //   video.addEventListener("pause", handlePause);
  //   video.addEventListener("ended", handleEnded);
  //   video.addEventListener("loadeddata", handleLoaded);

  //   return () => {
  //     video.removeEventListener("play", handlePlay);
  //     video.removeEventListener("pause", handlePause);
  //     video.removeEventListener("ended", handleEnded);
  //     video.removeEventListener("loadeddata", handleLoaded);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (!videoRef.current || !canvasRef.current || !background || !hasLoaded)
  //     return;

  //   const video = videoRef.current;
  //   const canvas = canvasRef.current;
  //   const ctx = canvas.getContext("2d");

  //   if (!ctx) return;

  //   canvas.width = video.videoWidth;
  //   canvas.height = video.videoHeight;

  //   const bgImage = new Image();
  //   bgImage.src = background.src;
  //   bgImage.onload = () => {
  //     if (!isPlaying) drawFrame();
  //   };

  //   const drawFrame = () => {
  //     if (!video || !ctx || !bgImage) return;

  //     // Draw background
  //     ctx.globalAlpha = 1;
  //     ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);

  //     // Draw video with opacity
  //     ctx.globalCompositeOperation = "source-over";
  //     ctx.globalAlpha = opacity;
  //     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  //     // Reset composite operation
  //     ctx.globalCompositeOperation = "source-over";

  //     if (isPlaying) {
  //       animationRef.current = requestAnimationFrame(drawFrame);
  //     }
  //   };

  //   if (isPlaying) {
  //     animationRef.current = requestAnimationFrame(drawFrame);
  //   } else {
  //     drawFrame();
  //   }

  //   return () => {
  //     cancelAnimationFrame(animationRef.current);
  //   };
  // }, [videoRef, canvasRef, background, isPlaying, opacity, hasLoaded]);

  // const downloadResult = () => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   const link = document.createElement("a");
  //   link.download = "video-with-background.png";
  //   link.href = canvas.toDataURL("image/png");
  //   link.click();

  //   toast("Frame captured and downloaded successfully");
  // };

  // const togglePlayPause = () => {
  //   const video = videoRef.current;
  //   if (!video) return;

  //   if (isPlaying) {
  //     video.pause();
  //   } else {
  //     video.play();
  //   }
  // };
  ///my codes

  const handleStart = () => {
    if (!videoFile) {
      alert("no video uploaded");
      return;
    }

    const videoElement = videoRef.current;
    if (!videoElement) {
      alert("no video ref");
      return;
    }
    // console.log(videoRef);
    if (isPlaying) {
      videoElement.pause();
      clearInterval(intervalRef.current!);
    } else {
      videoElement.play();
      intervalRef.current = setInterval(() => {
        if (!videoElement.paused && !videoElement.ended) {
          computeFrame();
        }
      }, 30); // 30ms ~ roughly 33fps
    }

    setIsPlaying((prev) => !prev);
  };

  // const TimerIntervalCall = () => {
  //   if (videoRef.current.paused || videoRef.current.ended) {
  //     return;
  //   }
  //   computeFrame();
  //   setInterval(() => {
  //     TimerIntervalCall();
  //   }, 0);
  // };
  // const computeFrame = () => {
  //   const width = videoRef.current.videoWidth / 2;
  //   const height = videoRef.current.videoHeight / 2;
  //   const ctx1 = canvas1Ref.current.getContext("2d");
  //   const ctx2 = canvas2Ref.current.getContext("2d");
  //   ctx1.drawImage(videoRef.current, 0, 0, width, height);
  //   const getImageData = ctx1.getImageData(0, 0, width, height);
  //   const frame = getImageData.data;
  //   console.log(getImageData, frame);

  //   for (let i = 0; i < frame.length; i += 4) {
  //     const red = frame[i + 0];
  //     const green = frame[i + 1];
  //     const blue = frame[i + 2];
  //     if (green > 100 && red > 100 && blue < 43) {
  //       frame[i + 3] = 0;
  //     }
  //   }
  //   const imageData = new ImageData(frame, width, height);
  //   ctx2.putImageData(imageData, 0, 0);
  //   console.log(frame);
  // };

  const computeFrame = () => {
    const sensitivity = 30;
    const video = videoRef.current;
    const canvas1 = canvas1Ref.current;
    const canvas2 = canvas2Ref.current;

    const width = video.videoWidth / 6;
    const height = video.videoHeight / 6;
    console.log(width, height);

    // Resize canvas to match dimensions (optional but helpful)
    canvas1.width = width;
    canvas1.height = height;
    canvas2.width = width;
    canvas2.height = height;

    const ctx1 = canvas1.getContext("2d");
    const ctx2 = canvas2.getContext("2d");

    ctx1.drawImage(video, 0, 0, width, height);
    const imageData = ctx1.getImageData(0, 0, width, height);
    const frame = imageData.data;

    for (let i = 0; i < frame.length; i += 4) {
      const r = frame[i];
      const g = frame[i + 1];
      const b = frame[i + 2];

      // Calculate how dominant green is
      const total = r + g + b;
      const greenRatio = g / total;

      // Make pixel transparent if green dominates and it's bright enough
      if (greenRatio > 0.35 && g > 80) {
        frame[i + 3] = 0; // fully transparent
      }
    }

    const newImageData = new ImageData(frame, width, height);
    ctx2.putImageData(newImageData, 0, 0);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gradient">Preview</h2>

      <div className="glass-morphism p-1 rounded-lg relative  aspect-video h-[500px] overflow-hidden">
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
          className="absolute inset-0  w-full h-full"
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
          onClick={handleStart}
          className="flex items-center gap-2"
        >
          Process Frame
        </Button>
      </div>
      <div className="grid gap-2 grid-cols-2">
        <canvas
          ref={canvas1Ref}
          // height={250}
          // width={250}
          className="rounded-md border hidden"
        />
        <canvas
          ref={canvas2Ref}
          // height={250}
          // width={250}
          className="rounded-md border"
        />
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          size="icon"
          disabled={!videoFile || !background}
          // onClick={togglePlayPause}
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
          // onClick={downloadResult}
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
