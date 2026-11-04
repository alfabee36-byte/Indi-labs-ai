interface Env {
  GEMINI_API_KEY?: string;
  ASSETS: Fetcher;
}

type Json = Record<string, unknown>;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

async function generateWithGemini(apiKey: string | undefined, prompt: string) {
  if (!apiKey) return null;
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.6 },
        }),
      },
    );
    if (!response.ok) throw new Error(`Gemini API returned ${response.status}`);
    const result = await response.json() as any;
    const text = result.candidates?.[0]?.content?.parts?.map((p: any) => p.text || "").join("") || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini generation failed:", error);
    return null;
  }
}

function scriptFallback(topic: string, market: string, format: string, language: string) {
  const isId = language === "id";
  return {
    title: isId ? `Rahasianya Terbongkar: Mengapa ${topic} Menjadi Tambang Uang` : `Unmasking the Reality: Why ${topic} Dominates Global Wealth`,
    hook: isId ? `Jangan berkedip. 99% orang tidak menyadari apa yang sedang terjadi di ${market}.` : `Stop scrolling. 99% of people have no idea what just happened in ${market}.`,
    targetRPM: "$24.80 - $38.50",
    estimatedDuration: format === "Long-form 16:9" ? "08:14" : "00:54",
    wordCount: format === "Long-form 16:9" ? 1240 : 138,
    retentionStrategy: isId ? "Pacing cepat dengan audio ducking dan pattern interrupt setiap 2.5 detik." : "High-tempo documentary rhythm with micro-suspense gaps every 3 seconds.",
    scenes: [
      { id: "1", timestamp: "00:00 - 00:04", visualDescription: "Extreme macro close-up of obsidian bank vault mechanical dials rotating under cinematic rim light.", voiceover: isId ? "Dalam 24 jam ke depan, aturan kekayaan di pasar ini akan berubah." : "In the next 24 hours, the rules of this market could change.", soundEffect: "Heavy cinematic sub-bass thud", bRollAction: "Snap zoom on rotating brass cylinder", voiceTone: "Deep, measured, authoritative" },
      { id: "2", timestamp: "00:04 - 00:15", visualDescription: "Aerial shot of financial district skyscrapers enveloped in dark mist and digital ticker reflections.", voiceover: isId ? "Mari kita bedah angka dan melihat apa yang sebenarnya terjadi." : "Let us trace the numbers and see what is really happening.", soundEffect: "Subtle data pulse and riser", bRollAction: "Kinetic number ticker overlay", voiceTone: "Investigative, urgent" },
      { id: "3", timestamp: "00:15 - 00:35", visualDescription: "Split screen isometric 3D render of asset flow and algorithmic trading.", voiceover: isId ? "Inilah tiga hal penting yang perlu Anda pahami." : "Here are three important mechanisms you need to understand.", soundEffect: "Rhythmic cinematic pulse", bRollAction: "Highlighted vector diagram", voiceTone: "Exploratory, clear" },
      { id: "4", timestamp: "00:35 - 00:54", visualDescription: "Cinematic silhouette in a high-rise boardroom overlooking a twilight metropolis.", voiceover: isId ? "Simpan video ini dan tulis pendapat Anda di komentar." : "Save this breakdown and share your view in the comments.", soundEffect: "Atmospheric swell and definitive boom", bRollAction: "Clean call-to-action card", voiceTone: "Decisive, compelling" },
    ],
    highRpmKeywords: ["AdSense Tier 1", "Capital Allocation", "B2B Software", "High-Yield Assets"],
    pinnedComment: isId ? "Apa pendapat Anda tentang tren ini? Tulis di komentar." : "What is your take on this trend? Share it below.",
  };
}

async function handleScript(request: Request, env: Env) {
  let body: Json;
  try { body = await request.json() as Json; } catch { return json({ error: "Invalid JSON body" }, 400); }
  const topic = String(body.topic || "").trim();
  if (!topic) return json({ error: "Topic is required" }, 400);
  const market = String(body.market || "USA (Tier-1)");
  const niche = String(body.niche || "High-RPM Finance & Wealth");
  const tone = String(body.tone || "Authoritative Swiss Documentary");
  const format = String(body.format || "Shorts 9:16");
  const language = String(body.language || "en");
  const prompt = `You are the lead executive director at Indi Labs, an elite faceless content studio.
Generate a high-quality faceless video script and scene-by-scene storyboard.
Topic: ${topic}
Target Market: ${market}
Niche: ${niche}
Tone: ${tone}
Format: ${format}
Output Language: ${language === "id" ? "Bahasa Indonesia" : "English"}
Return ONLY a valid JSON object with this structure:
{"title":"Compelling Title","hook":"0-3s hook","targetRPM":"estimate","estimatedDuration":"duration","wordCount":145,"retentionStrategy":"retention cues","scenes":[{"id":"1","timestamp":"00:00 - 00:04","visualDescription":"visual prompt","voiceover":"narration","soundEffect":"sound cue","bRollAction":"camera or B-roll action","voiceTone":"voice tone"}],"highRpmKeywords":["keyword1","keyword2"],"pinnedComment":"engaging comment"}`;
  const data = await generateWithGemini(env.GEMINI_API_KEY, prompt);
  return json({ success: true, data: data || scriptFallback(topic, market, format, language) });
}

async function handleNiche(request: Request, env: Env) {
  let body: Json;
  try { body = await request.json() as Json; } catch { return json({ error: "Invalid JSON body" }, 400); }
  const country = String(body.country || "USA");
  const niche = String(body.niche || "Finance");
  const isId = body.language === "id";
  const prompt = `Provide monetization and advertiser-market insights for faceless channel operators.
Country: ${country}
Niche: ${niche}
Language: ${isId ? "Bahasa Indonesia" : "English"}
Return raw JSON: {"summary":"1-2 sentence market summary","averageRPM":"$XX.XX","rpmBreakdown":{"desktop":"$XX.XX","mobile":"$XX.XX","tablet":"$XX.XX"},"topAdvertisers":["Brand 1","Brand 2","Brand 3"],"contentGaps":["Subtopic 1","Subtopic 2"],"retentionRecommendation":"Key advice"}`;
  const data = await generateWithGemini(env.GEMINI_API_KEY, prompt);
  const fallback = {
    summary: isId ? `Pasar ${country} dalam kategori ${niche} memiliki peluang pengiklan bernilai tinggi. Validasi angka dengan data aktual sebelum mengambil keputusan.` : `The ${country} audience in ${niche} may offer valuable advertiser opportunities. Validate estimates against current market data.`,
    averageRPM: country === "USA" ? "$34.20" : country === "Arab Gulf" ? "$29.40" : country === "UK" ? "$27.80" : country === "AU" ? "$26.50" : "$22.10",
    rpmBreakdown: { desktop: "$41.50", mobile: "$28.30", tablet: "$33.10" },
    topAdvertisers: ["Interactive Brokers", "BlackRock iShares", "Coinbase Institutional", "Shopify Plus"],
    contentGaps: isId ? ["Studi kasus biaya hidup dan investasi", "Otomatisasi workflow AI untuk bisnis"] : ["Forensic breakdown of capital structures", "Deep dives into institutional funds"],
    retentionRecommendation: isId ? "Gunakan visual sinematik dan fakta yang kuat pada 3 detik pertama." : "Open with high-contrast visuals and a clear fact within 2 seconds.",
  };
  return json({ success: true, data: data || fallback });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
      if (url.pathname === "/api/ai/script") return handleScript(request, env);
      if (url.pathname === "/api/ai/niche-insights") return handleNiche(request, env);
      return json({ error: "Not found" }, 404);
    }
    return env.ASSETS.fetch(request);
  },
};
