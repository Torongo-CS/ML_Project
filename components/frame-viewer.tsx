"use client";

import React, { useState, useEffect, useRef } from "react";

interface FrameViewerProps {
  totalFrames?: number;
  autoPlay?: boolean;
  onFrameChange?: (frame: number) => void;
  onComplete?: () => void;
  isCompleted?: boolean;
  className?: string;
  loop?: boolean;
}

export function FrameViewer({
  totalFrames = 150,
  autoPlay = true,
  onFrameChange,
  onComplete,
  isCompleted = false,
  className,
  loop = false,
}: FrameViewerProps) {
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isPreloading, setIsPreloading] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hasTriggeredCompleteRef = useRef(false);

  // If already completed on mount or state update, freeze on last frame
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isCompleted && !loop) {
      if (video.duration && !isNaN(video.duration)) {
        video.currentTime = video.duration;
      }
      video.pause();
      setIsPreloading(false);
      setCurrentFrame(totalFrames);
      if (!hasTriggeredCompleteRef.current) {
        hasTriggeredCompleteRef.current = true;
        if (onComplete) onComplete();
      }
    }
  }, [isCompleted, loop, totalFrames, onComplete]);

  const handleLoadedData = () => {
    setIsPreloading(false);
    const video = videoRef.current;
    if (video) {
      if (isCompleted && !loop) {
        if (video.duration && !isNaN(video.duration)) {
          video.currentTime = video.duration;
        }
        video.pause();
      } else if (autoPlay) {
        video.play().catch(() => {
          // Autoplay policy fallback
        });
      }
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const progress = video.currentTime / video.duration;
    const frame = Math.min(
      totalFrames,
      Math.max(1, Math.ceil(progress * totalFrames))
    );
    setCurrentFrame(frame);
    if (onFrameChange) onFrameChange(frame);
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (!loop && video) {
      video.pause();
      if (video.duration) {
        video.currentTime = video.duration;
      }
      setCurrentFrame(totalFrames);
      if (onFrameChange) onFrameChange(totalFrames);
      if (!hasTriggeredCompleteRef.current) {
        hasTriggeredCompleteRef.current = true;
        if (onComplete) onComplete();
      }
    }
  };

  const containerClasses =
    className ||
    "fixed inset-0 z-0 overflow-hidden bg-stone-950 select-none";

  return (
    <div className={containerClasses}>
      {/* Full-Bleed High-Definition Daytime Agricultural Video Background */}
      <video
        ref={videoRef}
        src="/pd_ui_landing.mp4"
        autoPlay={autoPlay && !isCompleted}
        muted
        playsInline
        loop={loop}
        preload="auto"
        className="h-full w-full object-cover filter brightness-[105%] contrast-[104%] saturate-[106%] will-change-transform transform-gpu transition-all duration-500"
        onLoadedData={handleLoadedData}
        onLoadedMetadata={handleLoadedData}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
    </div>
  );
}
