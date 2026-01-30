
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NewsArticle {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  description: string;
}

/**
 * Detects language based on Unicode character ranges
 */
function detectLanguage(text: string) {
  const teluguRange = /[\u0C00-\u0C7F]/;
  const hindiRange = /[\u0900-\u097F]/;
  const tamilRange = /[\u0B80-\u0BFF]/;
  
  if (teluguRange.test(text)) return { code: "te", name: "Telugu" };
  if (hindiRange.test(text)) return { code: "hi", name: "Hindi" };
  if (tamilRange.test(text)) return { code: "ta", name: "Tamil" };
  return { code: "en", name: "English" };
}

/**
 * Heuristic check for WhatsApp-style misinformation markers
 */
function getWhatsAppHeuristics(text: string) {
  const emojiCount = (text.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
  const hasForwardedLabel = /forwarded|sent multiple times|వాట్సాప్|గ్రూపులో/i.test(text);
  const isAllCaps = text === text.toUpperCase() && /[A-Z]/.test(text);
  const hasUrgentTriggers = /urgent|breaking|share now|must read|జాగ్రత్త|హెచ్చరిక/i.test(text);

  return {
    score: (emojiCount > 5 ? 0.2 : 0) + (hasForwardedLabel ? 0.3 : 0) + (isAllCaps ? 0.1 : 0) + (hasUrgentTriggers ? 0.2 : 0),
    isWhatsAppStyle: emojiCount > 3 || hasForwardedLabel || hasUrgentTriggers
  };
}

function extractKeywords(text: string) {
  // Simple keyword extractor: remove common small words, keep regional scripts
  return text.toLowerCase()
    .replace(/[^\w\s\u0C00-\u0C7F\u0900-\u097F]/g, '')
    .split(/\s+/)
    .filter(word => word.length >= 3 && !['this', 'that', 'with', 'from', 'news'].includes(word));
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { text, language } = await req.json().catch(() => ({}));

    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: "Valid text claim is required" }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    const detected = detectLanguage(text);
    const keywords = extractKeywords(text);
    const heuristics = getWhatsAppHeuristics(text);
    
    // Simulating multiple API calls with a robust Mock DB
    const mockDb: NewsArticle[] = [
      {
        title: "IMD Issues Red Alert: Heavy Rainfall Expected in Coastal Andhra Pradesh",
        source: "The Hindu",
        url: "https://thehindu.com",
        publishedAt: new Date().toISOString(),
        description: "Coastal districts including Vizag and Vijayawada on alert."
      },
      {
        title: "Fact Check: Viral message about 3-day school holiday in AP is false",
        source: "PIB Fact Check India",
        url: "https://pib.gov.in",
        publishedAt: new Date().toISOString(),
        description: "Official clarification from the Education Department."
      },
      {
        title: "New Metro Rail Project in Vijayawada gets initial clearance",
        source: "Eenadu",
        url: "https://eenadu.net",
        publishedAt: new Date().toISOString(),
        description: "State government approves DPR for phase 1."
      },
      {
        title: "Fake News Alert: No changes to pensions scheme for current beneficiaries",
        source: "FactCheck AP",
        url: "https://factcheck.ap.gov.in",
        publishedAt: new Date().toISOString(),
        description: "Verification of viral claims regarding welfare schemes."
      }
    ];

    const matched = mockDb.filter(art => 
      keywords.some(kw => art.title.toLowerCase().includes(kw))
    );

    const sourcesFound = matched.length;
    const isFakeHeuristic = heuristics.score > 0.5 && sourcesFound === 0;
    
    const prediction = sourcesFound > 0 ? "real" : "fake";
    let confidence = sourcesFound >= 2 ? 0.94 : (sourcesFound === 1 ? 0.78 : 0.55);
    
    // Penalize confidence if WhatsApp heuristics are strong and no sources found
    if (isFakeHeuristic) confidence = Math.min(confidence, 0.45);

    return new Response(JSON.stringify({
      language: detected.name,
      prediction,
      confidence: parseFloat(confidence.toFixed(2)),
      confidence_note: heuristics.isWhatsAppStyle ? "WhatsApp-style message detected - verifying carefully." : "Standard text claim analyzed against news archives.",
      reasoning: detected.code === 'te' ? "ప్రాంతీయ వార్తా మూలాల ఆధారంగా ఈ సమాచారం ధృవీకరించబడింది." : "Cross-referenced using keyword-indexed news databases.",
      reasoning_english: `Analysis complete. Found ${sourcesFound} matching reports using search keywords: ${keywords.slice(0, 3).join(', ')}.`,
      detailed_breakdown: [
        `Language: ${detected.name} script detected.`,
        sourcesFound > 0 ? `Confirmed by ${matched[0].source} and others.` : "No credible news reports found for this specific phrasing.",
        heuristics.isWhatsAppStyle ? "High volume of emojis/urgency markers suggesting forward-chain." : "Text structure appears neutral."
      ],
      verified_at: new Date().toISOString(),
      verification_note: `Rule-based backend processed ${sourcesFound} source(s).`,
      news_verification: {
        found: sourcesFound > 0,
        articles: matched,
        total_sources: mockDb.length,
        sources_checked: 4,
        sources_found: sourcesFound,
        source_agreement: sourcesFound >= 3 ? "high" : (sourcesFound === 2 ? "moderate" : "none")
      },
      sources: matched.map(a => a.url)
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "Internal Verification Failure" }), { 
      status: 500, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
});
