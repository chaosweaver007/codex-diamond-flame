import { createContext, useContext, useState } from "react";

interface MirrorContextType {
  isMirrored: boolean;
  toggleMirror: () => void;
}

const MirrorContext = createContext<MirrorContextType | undefined>(undefined);

export function MirrorProvider({ children }: { children: React.ReactNode }) {
  const [isMirrored, setIsMirrored] = useState(false);

  const toggleMirror = () => setIsMirrored(prev => !prev);

  return (
    <MirrorContext.Provider value={{ isMirrored, toggleMirror }}>
      {children}
    </MirrorContext.Provider>
  );
}

export function useMirror() {
  const context = useContext(MirrorContext);
  if (context === undefined) {
    throw new Error("useMirror must be used within a MirrorProvider");
  }
  return context;
}
