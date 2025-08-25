import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTtsTestSchema, type TtsApiProvider } from "@shared/schema";
import { z } from "zod";

// TTS API clients
const ttsClients = {
  async openai(text: string, voiceSettings: any) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OpenAI API key not configured");

    const response = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "tts-1",
        input: text,
        voice: voiceSettings.voice || "alloy",
        speed: voiceSettings.speed || 1.0,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI TTS failed: ${response.statusText}`);
    }

    return response.arrayBuffer();
  },

  async grok(text: string, voiceSettings: any) {
    const apiKey = process.env.GROK_API_KEY;
    if (!apiKey) throw new Error("Grok API key not configured");
    
    // Placeholder for Grok TTS implementation
    throw new Error("Grok TTS integration not yet implemented");
  },

  async groc(text: string, voiceSettings: any) {
    const apiKey = process.env.GROC_API_KEY;
    if (!apiKey) throw new Error("Groc API key not configured");
    
    // Placeholder for Groc TTS implementation
    throw new Error("Groc TTS integration not yet implemented");
  },

  async azure(text: string, voiceSettings: any) {
    const apiKey = process.env.AZURE_SPEECH_KEY;
    const region = process.env.AZURE_SPEECH_REGION;
    
    if (!apiKey || !region) {
      throw new Error("Azure Speech credentials not configured");
    }
    
    // Placeholder for Azure TTS implementation
    throw new Error("Azure TTS integration not yet implemented");
  },

  async google(text: string, voiceSettings: any) {
    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) throw new Error("Google Cloud API key not configured");
    
    // Placeholder for Google TTS implementation
    throw new Error("Google Cloud TTS integration not yet implemented");
  },

  async aws(text: string, voiceSettings: any) {
    const accessKey = process.env.AWS_ACCESS_KEY_ID;
    const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
    
    if (!accessKey || !secretKey) {
      throw new Error("AWS credentials not configured");
    }
    
    // Placeholder for AWS Polly implementation
    throw new Error("AWS Polly integration not yet implemented");
  },

  async elevenlabs(text: string, voiceSettings: any) {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) throw new Error("ElevenLabs API key not configured");
    
    // Placeholder for ElevenLabs implementation
    throw new Error("ElevenLabs TTS integration not yet implemented");
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Get recent TTS tests
  app.get("/api/tts-tests", async (req, res) => {
    try {
      const tests = await storage.getRecentTtsTests(10);
      res.json(tests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch TTS tests" });
    }
  });

  // Create new TTS test
  app.post("/api/tts-tests", async (req, res) => {
    try {
      const validatedData = insertTtsTestSchema.parse(req.body);
      const test = await storage.createTtsTest(validatedData);
      res.json(test);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create TTS test" });
      }
    }
  });

  // Generate TTS audio
  app.post("/api/tts-tests/:id/generate", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`[TTS] Starting generation for test ID: ${id}`);
      
      const test = await storage.getTtsTest(id);
      
      if (!test) {
        console.log(`[TTS] Test not found: ${id}`);
        return res.status(404).json({ message: "TTS test not found" });
      }

      console.log(`[TTS] Test details:`, {
        id: test.id,
        text: test.text.substring(0, 50) + '...',
        apiProvider: test.apiProvider,
        voiceSettings: test.voiceSettings
      });

      const startTime = Date.now();
      
      try {
        const apiProvider = test.apiProvider as TtsApiProvider;
        const ttsClient = ttsClients[apiProvider];
        
        console.log(`[TTS] Using API provider: ${apiProvider}`);
        
        if (!ttsClient) {
          console.log(`[TTS] ERROR: Unsupported TTS provider: ${apiProvider}`);
          throw new Error(`Unsupported TTS provider: ${apiProvider}`);
        }

        console.log(`[TTS] Calling TTS client for ${apiProvider}...`);
        const audioBuffer = await ttsClient(test.text, test.voiceSettings || {});
        const generationTime = Date.now() - startTime;
        
        console.log(`[TTS] Audio generated successfully in ${generationTime}ms, size: ${audioBuffer.byteLength} bytes`);
        
        // In a real app, you'd save this to a file storage service
        // For now, we'll create a data URL
        const audioBase64 = Buffer.from(audioBuffer).toString('base64');
        const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;
        
        await storage.updateTtsTest(id, {
          status: "success",
          audioUrl,
          generationTime,
          audioSize: audioBuffer.byteLength,
          errorMessage: null,
        });

        console.log(`[TTS] Test updated with success status`);
        const updatedTest = await storage.getTtsTest(id);
        res.json(updatedTest);
        
      } catch (error) {
        const generationTime = Date.now() - startTime;
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        
        console.log(`[TTS] ERROR during generation:`, {
          error: errorMessage,
          stack: error instanceof Error ? error.stack : 'No stack trace',
          generationTime,
          apiProvider: test.apiProvider
        });
        
        await storage.updateTtsTest(id, {
          status: "failed",
          errorMessage,
          generationTime,
        });

        const updatedTest = await storage.getTtsTest(id);
        console.log(`[TTS] Updated test with failed status:`, {
          id: updatedTest?.id,
          status: updatedTest?.status,
          errorMessage: updatedTest?.errorMessage
        });
        res.status(500).json(updatedTest);
      }
    } catch (error) {
      console.log(`[TTS] OUTER ERROR:`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      res.status(500).json({ message: "Failed to generate TTS audio" });
    }
  });

  // Get specific TTS test
  app.get("/api/tts-tests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const test = await storage.getTtsTest(id);
      
      if (!test) {
        return res.status(404).json({ message: "TTS test not found" });
      }
      
      res.json(test);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch TTS test" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
