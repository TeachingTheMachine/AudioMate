import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AudioPlayer } from "./audio-player";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, Edit, Settings, Play, X, Loader2 } from "lucide-react";
import type { TtsTest, InsertTtsTest } from "@shared/schema";

const API_PROVIDERS = [
  { value: "openai", label: "OpenAI TTS" },
  { value: "elevenlabs", label: "ElevenLabs" },
];

const VOICE_OPTIONS = {
  openai: [
    { value: "alloy", label: "Alloy" },
    { value: "echo", label: "Echo" },
    { value: "fable", label: "Fable" },
    { value: "onyx", label: "Onyx" },
    { value: "nova", label: "Nova" },
    { value: "shimmer", label: "Shimmer" },
  ],
  elevenlabs: [
    { value: "21m00Tcm4TlvDq8ikWAM", label: "Rachel" },
    { value: "AZnzlk1XvdvUeBnXmlld", label: "Domi" },
    { value: "EXAVITQu4vr4xnSDxMaL", label: "Bella" },
    { value: "ErXwobaYiN019PkySvjV", label: "Antoni" },
    { value: "MF3mGyEYCl7XYWbV9V6O", label: "Elli" },
    { value: "TxGEqnHWrfWFTfGW9XjX", label: "Josh" },
  ],
};

const SPEED_OPTIONS = [
  { value: "0.75", label: "Slow (0.75x)" },
  { value: "1.0", label: "Normal (1.0x)" },
  { value: "1.25", label: "Fast (1.25x)" },
];

export function TtsForm() {
  const [text, setText] = useState("");
  const [apiProvider, setApiProvider] = useState("openai");
  const [voice, setVoice] = useState("alloy");
  const [speed, setSpeed] = useState("1.0");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [currentTest, setCurrentTest] = useState<TtsTest | null>(null);
  
  // Get voice options based on selected API provider
  const currentVoiceOptions = apiProvider && VOICE_OPTIONS[apiProvider as keyof typeof VOICE_OPTIONS] 
    ? VOICE_OPTIONS[apiProvider as keyof typeof VOICE_OPTIONS]
    : VOICE_OPTIONS.openai;
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createTestMutation = useMutation({
    mutationFn: async (data: InsertTtsTest) => {
      const response = await apiRequest("POST", "/api/tts-tests", data);
      return response.json();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create TTS test",
        variant: "destructive",
      });
    },
  });

  const generateAudioMutation = useMutation({
    mutationFn: async (testId: string) => {
      console.log(`[Frontend] Starting audio generation for test: ${testId}`);
      const response = await apiRequest("POST", `/api/tts-tests/${testId}/generate`);
      const data = await response.json();
      console.log(`[Frontend] Generation response:`, data);
      return data;
    },
    onSuccess: (data: TtsTest) => {
      console.log(`[Frontend] Generation success:`, data);
      setCurrentTest(data);
      queryClient.invalidateQueries({ queryKey: ["/api/tts-tests"] });
      
      if (data.status === "success") {
        toast({
          title: "Success",
          description: `Audio generated successfully in ${data.generationTime}ms`,
        });
      } else {
        console.log(`[Frontend] Generation failed with error:`, data.errorMessage);
        toast({
          title: "Generation Failed",
          description: data.errorMessage || "Unknown error occurred",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      console.error("[Frontend] Generation error:", error);
      toast({
        title: "Error",
        description: `Failed to generate audio: ${error?.message || 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  const handleGenerate = async () => {
    if (!text.trim() || !apiProvider) {
      toast({
        title: "Validation Error",
        description: "Please enter text and select an API provider",
        variant: "destructive",
      });
      return;
    }

    try {
      const testData: InsertTtsTest = {
        text: text.trim(),
        apiProvider,
        voiceSettings: apiProvider === "elevenlabs" ? {
          voiceId: voice,
          stability: 0.5,
          similarity_boost: 0.5,
        } : {
          voice,
          speed: parseFloat(speed),
        },
      };

      console.log(`[Frontend] Creating test with data:`, testData);
      const test = await createTestMutation.mutateAsync(testData);
      console.log(`[Frontend] Test created:`, test);
      setCurrentTest(test);
      
      // Start audio generation
      await generateAudioMutation.mutateAsync(test.id);
    } catch (error) {
      console.error("[Frontend] Generation failed:", error);
      toast({
        title: "Generation Error", 
        description: `Complete error: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setText("");
    setApiProvider("openai");
    setVoice("alloy");
    setSpeed("1.0");
    setCurrentTest(null);
  };

  const isLoading = createTestMutation.isPending || generateAudioMutation.isPending;
  const selectedApiLabel = API_PROVIDERS.find(p => p.value === apiProvider)?.label;

  return (
    <div className="space-y-6">
      {/* Main Form */}
      <Card className="bg-card/95 backdrop-blur-sm rounded-xl shadow-lg border border-border">
        <CardHeader className="px-6 py-4 bg-secondary/30 border-b border-border">
          <CardTitle className="text-lg font-semibold text-foreground">Configure TTS Test</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Enter your text and select an API provider to generate speech</p>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Text Input */}
          <div>
            <label htmlFor="textInput" className="block text-sm font-medium text-gray-700 mb-2">
              <Edit className="inline w-4 h-4 text-gray-400 mr-2" />
              Text to Convert
            </label>
            <Textarea
              id="textInput"
              data-testid="input-text"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Enter the text you want to convert to speech..."
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">Maximum 500 characters</span>
              <span className="text-xs text-gray-500">{text.length} / 500</span>
            </div>
          </div>

          {/* API Selection */}
          <div>
            <label htmlFor="apiSelect" className="block text-sm font-medium text-gray-700 mb-2">
              <Settings className="inline w-4 h-4 text-gray-400 mr-2" />
              TTS API Provider
            </label>
            <Select value={apiProvider} onValueChange={(value) => {
              setApiProvider(value);
              // Reset voice to first option when changing API provider
              const newVoiceOptions = VOICE_OPTIONS[value as keyof typeof VOICE_OPTIONS] || VOICE_OPTIONS.openai;
              setVoice(newVoiceOptions[0].value);
            }}>
              <SelectTrigger data-testid="select-api" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200">
                <SelectValue placeholder="OpenAI TTS" />
              </SelectTrigger>
              <SelectContent>
                {API_PROVIDERS.map((provider) => (
                  <SelectItem key={provider.value} value={provider.value}>
                    {provider.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-2">
              <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
              Make sure you have valid API credentials configured
            </p>
          </div>

          {/* Voice Settings */}
          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <Card className="border border-gray-200 rounded-lg">
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  data-testid="button-toggle-advanced"
                  className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors duration-200 rounded-lg justify-between"
                >
                  <span className="text-sm font-medium text-gray-700">
                    <Settings className="inline w-4 h-4 text-gray-400 mr-2" />
                    Voice Settings (Optional)
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${advancedOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Voice</label>
                    <Select value={voice} onValueChange={setVoice}>
                      <SelectTrigger data-testid="select-voice" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currentVoiceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Speed</label>
                    <Select value={speed} onValueChange={setSpeed}>
                      <SelectTrigger data-testid="select-speed" className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary focus:border-transparent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SPEED_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Button 
              onClick={handleGenerate}
              disabled={isLoading || !text.trim() || !apiProvider}
              data-testid="button-generate"
              className="flex-1 bg-primary hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              <span>{isLoading ? "Generating..." : "Generate Speech"}</span>
            </Button>
            <Button 
              variant="outline"
              onClick={handleClear}
              data-testid="button-clear"
              className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-all duration-200"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="bg-white rounded-xl shadow-lg border border-gray-200">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Audio...</h3>
            <p className="text-gray-600">Please wait while we process your text with {selectedApiLabel}</p>
            <div className="mt-4 max-w-md mx-auto bg-gray-200 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: "45%" }}></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audio Player */}
      {currentTest && !isLoading && (
        <AudioPlayer test={currentTest} />
      )}
    </div>
  );
}
