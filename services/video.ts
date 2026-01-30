
import { GoogleGenAI } from "@google/genai";

export async function generateDemoVideo(onProgress: (msg: string) => void): Promise<string> {
  // Check for mandatory API key selection
  if (typeof (window as any).aistudio !== 'undefined' && await (window as any).aistudio.hasSelectedApiKey()) {
     // Key is selected
  } else if (typeof (window as any).aistudio !== 'undefined') {
    await (window as any).aistudio.openSelectKey();
  }

  // Access API key directly from environment variable (injected by Vite)
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) throw new Error("API Key not found. Please add API_KEY to your .env file.");

  const ai = new GoogleGenAI({ apiKey });
  onProgress("Initializing Veo 3.1 engine...");

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: 'A professional screencast demo of the Truth Weaver app. The video shows a minimalist interface where a user pastes a news claim in Telugu script. A digital scanner light sweeps over the text. A green badge appears saying 94% Authentic. Supporting news links from Eenadu and Sakshi appear at the bottom. Bold white captions at the bottom center cycle through: "PASTE REGIONAL NEWS", "REAL-TIME CROSS-REFERENCING", "INSTANT TRUTH VERIFICATION". High-quality, modern tech aesthetic.',
    config: {
      numberOfVideos: 1,
      resolution: '1080p',
      aspectRatio: '16:9'
    }
  });

  const messages = [
    "Analyzing Truth Weaver UI components...",
    "Simulating Telugu text input...",
    "Rendering real-time search grounding...",
    "Applying dynamic captions...",
    "Finalizing video export..."
  ];
  let msgIdx = 0;

  while (!operation.done) {
    onProgress(messages[msgIdx % messages.length]);
    msgIdx++;
    await new Promise(resolve => setTimeout(resolve, 10000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed");

  const response = await fetch(`${downloadLink}&key=${apiKey}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
}
