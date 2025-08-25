import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Download, RefreshCw, Clock, CheckCircle, XCircle, Cpu } from "lucide-react";
import type { TtsTest } from "@shared/schema";

export function RecentTests() {
  const { data: tests, isLoading } = useQuery<TtsTest[]>({
    queryKey: ["/api/tts-tests"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  const handlePlayTest = (test: TtsTest) => {
    if (test.audioUrl && test.status === "success") {
      const audio = new Audio(test.audioUrl);
      audio.play().catch(console.error);
    }
  };

  const handleDownloadTest = (test: TtsTest) => {
    if (test.audioUrl && test.status === "success") {
      const link = document.createElement('a');
      link.href = test.audioUrl;
      link.download = `tts-${test.apiProvider}-${Date.now()}.mp3`;
      link.click();
    }
  };

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <Card className="bg-white rounded-xl shadow-lg border border-gray-200 mt-6">
        <CardHeader className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Tests</CardTitle>
          <p className="text-sm text-gray-600 mt-1">Your recent TTS generations</p>
        </CardHeader>
        <CardContent className="p-6 text-center text-gray-500">
          Loading recent tests...
        </CardContent>
      </Card>
    );
  }

  const recentTests = tests || [];

  return (
    <Card className="bg-white rounded-xl shadow-lg border border-gray-200 mt-6">
      <CardHeader className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Tests</CardTitle>
        <p className="text-sm text-gray-600 mt-1">Your recent TTS generations</p>
      </CardHeader>
      
      <div className="divide-y divide-gray-200">
        {recentTests.length === 0 ? (
          <div className="p-8 text-center text-gray-500" data-testid="text-no-tests">
            <Cpu className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No tests yet. Generate your first TTS audio above!</p>
          </div>
        ) : (
          recentTests.map((test) => (
            <div 
              key={test.id} 
              className="p-4 hover:bg-gray-50 transition-colors duration-200"
              data-testid={`row-test-${test.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <p className="text-sm font-medium text-gray-900 truncate" data-testid={`text-test-content-${test.id}`}>
                    {truncateText(test.text)}
                  </p>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                    <span data-testid={`text-api-${test.id}`}>
                      <Cpu className="inline w-3 h-3 mr-1" />
                      {test.apiProvider.charAt(0).toUpperCase() + test.apiProvider.slice(1)}
                    </span>
                    <span data-testid={`text-time-${test.id}`}>
                      <Clock className="inline w-3 h-3 mr-1" />
                      {formatTimeAgo(test.createdAt)}
                    </span>
                    <span className={`flex items-center ${
                      test.status === "success" 
                        ? "text-green-600" 
                        : test.status === "failed" 
                        ? "text-red-600" 
                        : "text-yellow-600"
                    }`} data-testid={`status-${test.id}`}>
                      {test.status === "success" && <CheckCircle className="inline w-3 h-3 mr-1" />}
                      {test.status === "failed" && <XCircle className="inline w-3 h-3 mr-1" />}
                      {test.status === "pending" && <Clock className="inline w-3 h-3 mr-1" />}
                      {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {test.status === "success" && test.audioUrl ? (
                    <>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handlePlayTest(test)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        data-testid={`button-play-${test.id}`}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownloadTest(test)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        data-testid={`button-download-${test.id}`}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </>
                  ) : test.status === "failed" ? (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                      data-testid={`button-retry-${test.id}`}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
