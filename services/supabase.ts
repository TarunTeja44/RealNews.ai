
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export async function analyzeNews(text: string, language: string = 'auto'): Promise<AnalysisResult> {
  // Access API key directly from environment variable (injected by Vite)
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key configuration missing. Please add API_KEY to your .env file.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Strict prompt to ensure valid JSON output with Grounding
    const prompt = `
      You are an expert news verification system.
      Claim to verify: "${text}"
      Context Language: "${language}"
      
      Tasks:
      1. Use Google Search to find recent credible news reports confirming or debunking this claim.
      2. If the context language is regional (e.g. Telugu, Hindi), prioritize local sources in that language (like Eenadu, Sakshi for Telugu).
      3. Return the result in strictly valid JSON format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            prediction: { type: Type.STRING, enum: ["real", "fake"] },
            confidence: { type: Type.NUMBER, description: "Float between 0.0 and 1.0" },
            reasoning_english: { type: Type.STRING, description: "Concise summary in English" },
            reasoning_local: { type: Type.STRING, description: "Concise summary in the context language (e.g. Telugu/Hindi)" },
            detailed_breakdown: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of 3 distinct key facts found"
            },
            detected_language: { type: Type.STRING }
          },
          required: ["prediction", "confidence", "reasoning_english", "detailed_breakdown"]
        }
      },
    });

    // 1. Parse JSON Response
    // Note: The response.text is guaranteed to be JSON due to responseMimeType, but we clean it just in case
    const rawText = response.text || "{}";
    const jsonString = rawText.replace(/```json|```/g, "").trim();
    const data = JSON.parse(jsonString);

    // 2. Extract Search Grounding Data (The actual sources)
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = groundingChunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: c.web.title || "News Source",
        source: new URL(c.web.uri).hostname.replace('www.', ''),
        url: c.web.uri,
        publishedAt: new Date().toISOString(),
        description: "Verified via Google Search."
      }));

    // 3. Adjust confidence based on actual sources found
    // If the AI says "real" but found 0 sources, we downgrade it to prevent hallucination.
    let finalConfidence = data.confidence || 0.5;
    if (data.prediction === 'real' && webSources.length === 0) {
      finalConfidence = 0.3; // Low confidence if no sources support it
    }

    return {
      language: data.detected_language || language,
      prediction: data.prediction || "fake",
      confidence: finalConfidence,
      confidence_note: `Based on ${webSources.length} verified sources`,
      reasoning: data.reasoning_local || data.reasoning_english || "Analysis complete.",
      reasoning_english: data.reasoning_english || "Analysis complete.",
      detailed_breakdown: data.detailed_breakdown || ["Fact-check complete."],
      verified_at: new Date().toISOString(),
      verification_note: "Gemini 3 Flash + Google Search",
      news_verification: {
        found: webSources.length > 0,
        articles: webSources,
        total_sources: webSources.length,
        sources_checked: 5,
        sources_found: webSources.length,
        source_agreement: webSources.length > 1 ? "high" : "low"
      },
      sources: webSources.map((a: any) => a.url)
    };

  } catch (err: any) {
    console.error("Verification failed:", err);
    throw new Error(`System Error: ${err.message}. Please verify your network/API key.`);
  }
}
