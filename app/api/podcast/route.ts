import { NextRequest, NextResponse } from "next/server";
import { getTTSClient } from "@/app/lib/tts-client";
import fs from "fs";
import path from "path";

type Speaker = "Rachel" | "James";

interface ScriptLine {
  speaker: Speaker;
  text: string;
}

interface PodcastRequest {
  script: ScriptLine[];
  cacheKey: string;
}

const VOICE_CONFIG: Record<Speaker, { name: string; pitch: number; speakingRate: number }> = {
  Rachel: { name: "en-US-Wavenet-F", pitch: 2.0,  speakingRate: 1.05 },
  James:  { name: "en-US-Wavenet-D", pitch: -1.0, speakingRate: 1.05 },
};

export async function POST(req: NextRequest) {
  let body: PodcastRequest;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { script, cacheKey } = body;
  if (!script?.length || !cacheKey) {
    return NextResponse.json({ error: "Missing script or cacheKey" }, { status: 400 });
  }

  // Check cache
  const cacheDir = path.join(process.cwd(), "public", "podcasts");
  const cachePath = path.join(cacheDir, `${cacheKey}.mp3`);

  try {
    if (fs.existsSync(cachePath)) {
      const cached = fs.readFileSync(cachePath);
      return new NextResponse(cached, {
        headers: { "Content-Type": "audio/mpeg", "X-Cache": "HIT" },
      });
    }
  } catch {
    // Cache check failed — proceed to generate
  }

  // Synthesize each line
  try {
    const client = getTTSClient();
    const buffers: Buffer[] = [];

    for (const line of script) {
      const config = VOICE_CONFIG[line.speaker];
      const [response] = await client.synthesizeSpeech({
        input: { text: line.text },
        voice: { languageCode: "en-US", name: config.name },
        audioConfig: {
          audioEncoding: "MP3",
          pitch: config.pitch,
          speakingRate: config.speakingRate,
        },
      });

      if (!response.audioContent) {
        throw new Error(`No audio content for line: "${line.text}"`);
      }
      buffers.push(
        response.audioContent instanceof Buffer
          ? response.audioContent
          : Buffer.from(response.audioContent as Uint8Array)
      );
    }

    const combined = Buffer.concat(buffers);

    // Save to cache (best-effort — silently skip if filesystem is read-only)
    try {
      fs.mkdirSync(cacheDir, { recursive: true });
      fs.writeFileSync(cachePath, combined);
    } catch {
      // Non-fatal: Vercel's filesystem is read-only
    }

    return new NextResponse(combined, {
      headers: { "Content-Type": "audio/mpeg", "X-Cache": "MISS" },
    });
  } catch (err) {
    console.error("[podcast] TTS error:", err);
    const message = err instanceof Error ? err.message : "TTS generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
