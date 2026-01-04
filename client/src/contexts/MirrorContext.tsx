import { createContext, useContext, useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

interface MirrorContextType {
  isMirrored: boolean;
  toggleMirror: () => void;
  isLoading: boolean;
}

const MirrorContext = createContext<MirrorContextType | undefined>(undefined);

export function MirrorProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [isMirrored, setIsMirrored] = useState(() => {
    // Initialize from localStorage for immediate UX
    if (typeof window !== "undefined") {
      return localStorage.getItem("codex-mirrored") === "true";
    }
    return false;
  });

  // Fetch user preferences from server if authenticated
  const { data: prefs, isLoading } = trpc.user.getPreferences.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });

  // Mutation to save preference to server
  const setMirroredMutation = trpc.user.setMirrored.useMutation();

  // Sync server state to local state when loaded
  useEffect(() => {
    if (prefs && isAuthenticated) {
      setIsMirrored(prefs.isMirrored);
      localStorage.setItem("codex-mirrored", String(prefs.isMirrored));
    }
  }, [prefs, isAuthenticated]);

  const toggleMirror = () => {
    const newValue = !isMirrored;
    setIsMirrored(newValue);
    localStorage.setItem("codex-mirrored", String(newValue));
    
    // Persist to server if authenticated
    if (isAuthenticated) {
      setMirroredMutation.mutate({ isMirrored: newValue });
    }
  };

  return (
    <MirrorContext.Provider value={{ isMirrored, toggleMirror, isLoading }}>
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
