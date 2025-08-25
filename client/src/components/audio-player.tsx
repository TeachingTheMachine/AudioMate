import React, { useRef, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, Download, Share, Info, CheckCircle, XCircle } from "lucide-react";
import type { TtsTest } from "@shared/schema";

interface AudioPlayerProps {
  test: TtsTest;
}

export function AudioPlayer({ test }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnd = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnd);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnd);
    };
  }, [test.audioUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * duration;
    
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleDownload = () => {
    if (test.audioUrl && test.audioUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = test.audioUrl;
      link.download = `tts-${test.apiProvider}-${Date.now()}.mp3`;
      link.click();
    }
  };

  const handleShare = async () => {
    if (navigator.share && test.audioUrl) {
      try {
        await navigator.share({
          title: 'TTS Generated Audio',
          text: test.text,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share failed:', error);
      }
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const fileSizeKB = test.audioSize ? Math.round(test.audioSize / 1024) : 0;

  if (test.status === "failed") {
    return (
      <Card className="bg-white rounded-xl shadow-lg border border-red-200">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Generation Failed</h3>
              <p className="text-red-700 mb-4" data-testid="text-error-message">
                {test.errorMessage || "An unknown error occurred during audio generation."}
              </p>
              <div className="flex space-x-3">
                <Button 
                  size="sm" 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  data-testid="button-retry"
                >
                  Retry
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-red-300 text-red-700 hover:bg-red-50"
                  data-testid="button-check-settings"
                >
                  Check Settings
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!test.audioUrl || test.status !== "success") {
    return null;
  }

  return (
    <Card className="bg-white rounded-xl shadow-lg border border-gray-200">
      <CardHeader className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-900">Generated Audio</CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Generated using <span className="font-medium" data-testid="text-api-provider">{test.apiProvider.charAt(0).toUpperCase() + test.apiProvider.slice(1)}</span>
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <audio ref={audioRef} src={test.audioUrl} preload="metadata" />
        
        {/* Custom Audio Player */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              onClick={togglePlay}
              className="w-12 h-12 bg-primary hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow"
              data-testid="button-play-pause"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span data-testid="text-current-time">{formatTime(currentTime)}</span>
                <span data-testid="text-duration">{formatTime(duration)}</span>
              </div>
              <div 
                className="w-full bg-gray-300 rounded-full h-2 cursor-pointer"
                onClick={handleSeek}
                data-testid="progress-bar"
              >
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-100" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              data-testid="button-volume"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Audio Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors duration-200"
                data-testid="button-download"
              >
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors duration-200"
                data-testid="button-share"
              >
                <Share className="w-3 h-3 mr-1" />
                Share
              </Button>
            </div>
            <div className="text-xs text-gray-500" data-testid="text-audio-info">
              Quality: 48kHz • Size: {fileSizeKB} KB
            </div>
          </div>
        </div>

        {/* Generation Info */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-blue-800 font-medium">Generation Complete</p>
              <p className="text-blue-700 mt-1">
                Audio generated successfully in {test.generationTime}ms using{" "}
                <span className="font-medium">{test.apiProvider.charAt(0).toUpperCase() + test.apiProvider.slice(1)}</span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
