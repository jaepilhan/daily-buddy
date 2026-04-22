import { TextToSpeechClient } from "@google-cloud/text-to-speech";

export function getTTSClient() {
  if (process.env.GOOGLE_CLOUD_TTS_CREDENTIALS) {
    // Production (Vercel): parse JSON from env var
    const credentials = JSON.parse(process.env.GOOGLE_CLOUD_TTS_CREDENTIALS);
    return new TextToSpeechClient({ credentials });
  }
  // Local: uses GOOGLE_APPLICATION_CREDENTIALS file path automatically
  return new TextToSpeechClient();
}
