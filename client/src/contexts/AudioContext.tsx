import { createContext, useContext, useEffect, useRef, useState } from "react";
import * as Tone from "tone";

interface AudioContextType {
  isMuted: boolean;
  toggleMute: () => void;
  setLayer: (layer: "altar" | "scrolls" | "guardian" | "none") => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(true);
  const [currentLayer, setCurrentLayer] = useState<"altar" | "scrolls" | "guardian" | "none">("none");
  const [isInitialized, setIsInitialized] = useState(false);

  // Synths refs
  const altarSynth = useRef<Tone.PolySynth | null>(null);
  const scrollSynth = useRef<Tone.PolySynth | null>(null);
  const guardianSynth = useRef<Tone.PolySynth | null>(null);
  const masterVol = useRef<Tone.Volume | null>(null);

  // Initialize Audio
  const initAudio = async () => {
    if (isInitialized) return;
    
    await Tone.start();
    
    masterVol.current = new Tone.Volume(-10).toDestination();

    // Altar: Deep, slow heartbeat pulse
    altarSynth.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 2, decay: 1, sustain: 0.5, release: 3 }
    }).connect(masterVol.current);

    // Scrolls: Etheric harmonic rise
    scrollSynth.current = new Tone.PolySynth(Tone.AMSynth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 1, decay: 0.5, sustain: 0.8, release: 2 }
    }).connect(masterVol.current);

    // Guardian: Shimmering mirror-tone
    guardianSynth.current = new Tone.PolySynth(Tone.FMSynth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.5, decay: 0.2, sustain: 0.6, release: 1.5 },
      modulation: { type: "square" },
      modulationIndex: 3
    }).connect(masterVol.current);

    setIsInitialized(true);
  };

  const toggleMute = async () => {
    if (!isInitialized) await initAudio();
    
    if (isMuted) {
      Tone.Destination.mute = false;
      setIsMuted(false);
    } else {
      Tone.Destination.mute = true;
      setIsMuted(true);
    }
  };

  // Handle Layer Changes
  useEffect(() => {
    if (!isInitialized || isMuted) return;

    // Stop all first
    altarSynth.current?.releaseAll();
    scrollSynth.current?.releaseAll();
    guardianSynth.current?.releaseAll();

    const now = Tone.now();

    switch (currentLayer) {
      case "altar":
        // C2 + G2 drone
        altarSynth.current?.triggerAttack(["C2", "G2"], now);
        break;
      case "scrolls":
        // E3 + B3 + E4 ethereal chord
        scrollSynth.current?.triggerAttack(["E3", "B3", "E4"], now);
        break;
      case "guardian":
        // High shimmering F#4 + C#5
        guardianSynth.current?.triggerAttack(["F#4", "C#5"], now);
        break;
    }
  }, [currentLayer, isInitialized, isMuted]);

  return (
    <AudioContext.Provider value={{ isMuted, toggleMute, setLayer: setCurrentLayer }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
