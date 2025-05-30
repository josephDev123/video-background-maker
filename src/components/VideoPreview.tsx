import React, { useRef, useEffect, useState } from "react";
import { Play, Pause, Download } from "lucide-react";
import { Background } from "./BackgroundSelector";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface VideoPreviewProps {
  videoFile: File | null;
  background: Background | null;
  opacity: number;
  setComputeFrameStatus: React.Dispatch<
    React.SetStateAction<IProcessFrameStatus>
  >;
}

export type IProcessFrameStatus = "idle" | "processing" | "completed";
const VideoPreview: React.FC<VideoPreviewProps> = ({
  videoFile,
  background,
  opacity,
  setComputeFrameStatus,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvas1Ref = useRef<HTMLCanvasElement | null>(null);
  const canvas2Ref = useRef<HTMLCanvasElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoURL, setVideoURL] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [ProcessFrameStatus, SetProcessFrameStatus] =
    useState<IProcessFrameStatus>("idle");
  // console.log(ProcessFrameStatus);

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
    setComputeFrameStatus(ProcessFrameStatus);
  }, [ProcessFrameStatus]);

  useEffect(() => {
    if (!background?.src) return;

    const img = new Image();
    img.crossOrigin = "anonymous"; // Important for remote images!
    img.src = background.src;

    img.onload = () => {
      bgImageRef.current = img;
    };

    img.onerror = (err) => {
      console.error("Failed to load background image:", err);
    };
  }, [background]);

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
      requestAnimationFrame(playLoop);
    }

    setIsPlaying((prev) => !prev);
  };

  const playLoop = () => {
    if (
      videoRef.current &&
      !videoRef.current.paused &&
      !videoRef.current.ended
    ) {
      SetProcessFrameStatus("processing");
      computeFrame();
      SetProcessFrameStatus("completed");
      requestAnimationFrame(playLoop);
    }
  };

  const handleRecordToggle = () => {
    if (!canvas2Ref.current) return;

    if (!isRecording) {
      // Start recording
      const canvasStream = canvas2Ref.current.captureStream(30); // 30 fps
      const mediaRecorder = new MediaRecorder(canvasStream, {
        mimeType: "video/webm; codecs=vp9",
      });

      recordedChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "video/webm",
        });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "chroma_output.webm";
        a.click();
        URL.revokeObjectURL(url);
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
    } else {
      // Stop recording
      mediaRecorderRef.current?.stop();
    }

    setIsRecording((prev) => !prev);
  };

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

    // Step 1: draw background image on canvas2
    ctx2.clearRect(0, 0, width, height);
    ctx2.drawImage(bgImageRef.current, 0, 0, width, height); // draw the background first

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

    // Optional debug: confirm it's rendering
    const check = ctx2.getImageData(0, 0, width, height).data.slice(0, 20);
    console.log("Canvas2 pixel check:", check);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gradient">Preview</h2>

      <div className="glass-morphism p-1 rounded-lg relative w-full aspect-video h-[500px] overflow-hidden">
        {/* {!videoFile && !background && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Upload a video and select a background to see the preview
            </p>
          </div>
        )} */}

        <video
          onPlay={(e) => e.defaultPrevented}
          // controls
          ref={videoRef}
          src={videoURL || undefined}
          className="absolute inset-0  w-full h-full"
          // loop
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
          {ProcessFrameStatus === "completed"
            ? "Process frame ended "
            : ProcessFrameStatus === "processing"
            ? "Process Frame"
            : " Process Frame"}
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
          style={{
            backgroundImage:
              ProcessFrameStatus === "completed" && `url(${background?.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            aspectRatio: "16/9",
          }}
          // height={250}
          // width={250}
          className="rounded-md border"
        />
      </div>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          disabled={!videoFile || !background}
          onClick={handleRecordToggle}
          className="glass-morphism px-3"
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
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
