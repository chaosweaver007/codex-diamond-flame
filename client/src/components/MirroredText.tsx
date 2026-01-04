import { motion, AnimatePresence } from "framer-motion";
import { useMirror } from "@/contexts/MirrorContext";

interface MirroredTextProps {
  original: string;
  mirrored: string;
  className?: string;
}

export function MirroredText({ original, mirrored, className = "" }: MirroredTextProps) {
  const { isMirrored } = useMirror();

  return (
    <span className={`relative inline ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={isMirrored ? "mirrored" : "original"}
          initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -5, filter: "blur(4px)" }}
          transition={{ duration: 0.5 }}
        >
          {isMirrored ? mirrored : original}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
