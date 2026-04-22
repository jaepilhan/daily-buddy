"use client";
import { useCallback, useEffect, useRef } from "react";
import { getSoundEnabled } from "../lib/storage";

function createCtx() {
  if (typeof window === "undefined") return null;
  return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
}

// Pentatonic melody: C5 E5 G5 E5 C5 A4 G4 A4  (0 = rest)
const BG_NOTES = [523, 0, 659, 784, 659, 0, 523, 0, 440, 0, 523, 659, 784, 0, 659, 0];
const NOTE_DUR = 0.16; // seconds per slot
const LOOP_DUR = BG_NOTES.length * NOTE_DUR; // ~2.56s

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const lastClickRef = useRef<number>(0);
  const bgStopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    ctxRef.current = createCtx();
    return () => {
      bgStopRef.current?.();
      ctxRef.current?.close();
    };
  }, []);

  const resume = useCallback(() => {
    if (ctxRef.current?.state === "suspended") ctxRef.current.resume();
  }, []);

  const playClick = useCallback(() => {
    if (!getSoundEnabled()) return;
    const now = Date.now();
    if (now - lastClickRef.current < 30) return;
    lastClickRef.current = now;
    const ctx = ctxRef.current;
    if (!ctx) return;
    resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 900;
    osc.type = "square";
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  }, [resume]);

  const playWrong = useCallback(() => {
    if (!getSoundEnabled()) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 180;
    osc.type = "sawtooth";
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.13);
  }, [resume]);

  const playComplete = useCallback(() => {
    if (!getSoundEnabled()) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    resume();
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.2, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t);
      osc.stop(t + 0.26);
    });
  }, [resume]);

  const playRecord = useCallback(() => {
    if (!getSoundEnabled()) return;
    const ctx = ctxRef.current;
    if (!ctx) return;
    resume();
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      const t = ctx.currentTime + i * 0.15;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.start(t);
      osc.stop(t + 0.36);
    });
  }, [resume]);

  const startBgMusic = useCallback(() => {
    bgStopRef.current?.();
    const ctx = ctxRef.current;
    if (!ctx) return;
    resume();

    let loopStart = ctx.currentTime + 0.05;
    let stopped = false;
    let tid: ReturnType<typeof setTimeout>;

    function scheduleLoop() {
      if (stopped || !ctx) return;
      if (!getSoundEnabled()) {
        tid = setTimeout(scheduleLoop, 500);
        return;
      }
      BG_NOTES.forEach((freq, i) => {
        if (freq === 0) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "triangle";
        osc.frequency.value = freq;
        const t = loopStart + i * NOTE_DUR;
        gain.gain.setValueAtTime(0.035, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + NOTE_DUR * 0.85);
        osc.start(t);
        osc.stop(t + NOTE_DUR);
      });
      loopStart += LOOP_DUR;
      // schedule next batch ~0.25s before current loop ends so there's no gap
      tid = setTimeout(scheduleLoop, (LOOP_DUR - 0.25) * 1000);
    }

    scheduleLoop();
    bgStopRef.current = () => { stopped = true; clearTimeout(tid); };
  }, [resume]);

  const stopBgMusic = useCallback(() => {
    bgStopRef.current?.();
    bgStopRef.current = null;
  }, []);

  return { playClick, playWrong, playComplete, playRecord, resume, startBgMusic, stopBgMusic };
}
