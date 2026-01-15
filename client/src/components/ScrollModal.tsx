import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Loader2, Lock, Sparkles, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useMirror } from "@/contexts/MirrorContext";

export type ScrollModalScroll = {
  id: string;
  title: string;
  image: string;
  markdown: string;
  excerpt: string;
  priceCents: number;
  isFree: boolean;
};

type ScrollReflection = {
  text: string;
  updatedAt?: Date | string | null;
  isMirrored?: boolean;
};

export function UnlockPrompt({
  scroll,
  onClose,
  onPurchase,
  isPurchasing,
  isAuthenticated,
}: {
  scroll: ScrollModalScroll;
  onClose: () => void;
  onPurchase: () => void;
  isPurchasing: boolean;
  isAuthenticated: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0a0a0a] w-full max-w-md rounded-2xl overflow-hidden border border-amber-500/30 shadow-[0_0_50px_rgba(255,180,0,0.1)]"
      >
        <div className="relative h-48">
          <img
            src={scroll.image}
            alt={scroll.title}
            className="w-full h-full object-cover grayscale-[30%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent" />
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute bottom-4 left-6">
            <span className="text-xs font-mono text-amber-500 tracking-widest uppercase">
              Scroll {scroll.id}
            </span>
            <h2 className="font-serif text-2xl font-bold text-white">{scroll.title}</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <img
                src="/images/sigil-vesica.png"
                alt=""
                className="w-12 h-12 opacity-50"
              />
            </motion.div>
          </div>

          <p className="text-muted-foreground text-center mb-6 font-serif italic">
            "{scroll.excerpt}"
          </p>

          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-amber-500">
              ${(scroll.priceCents / 100).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              One-time purchase • Eternal access
            </p>
          </div>

          {isAuthenticated ? (
            <Button
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold"
              onClick={onPurchase}
              disabled={isPurchasing}
            >
              {isPurchasing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Opening Sacred Gateway...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Unlock This Scroll
                </>
              )}
            </Button>
          ) : (
            <Button
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-semibold"
              onClick={() => (window.location.href = getLoginUrl())}
            >
              <Lock className="w-4 h-4 mr-2" />
              Sign In to Unlock
            </Button>
          )}

          <p className="text-xs text-center text-muted-foreground/50 mt-4">
            Secure payment via Stripe
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function ScrollModal({
  scroll,
  onClose,
  isFirstTime,
  onViewed,
  isFavorited,
  onToggleFavorite,
  canFavorite,
  existingReflection,
  onSaveReflection,
  onDeleteReflection,
  isSavingReflection,
  canReflect,
}: {
  scroll: ScrollModalScroll;
  onClose: () => void;
  isFirstTime: boolean;
  onViewed: () => void;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  canFavorite: boolean;
  existingReflection?: ScrollReflection | null;
  onSaveReflection?: (value: string, isMirrored: boolean) => void;
  onDeleteReflection?: () => void;
  isSavingReflection?: boolean;
  canReflect?: boolean;
}) {
  const [showCelebration, setShowCelebration] = useState(isFirstTime);
  const { isMirrored: globalMirror } = useMirror();
  const [reflectionText, setReflectionText] = useState(existingReflection?.text ?? "");
  const [reflectAsMirror, setReflectAsMirror] = useState(existingReflection?.isMirrored ?? globalMirror);

  useEffect(() => {
    if (!isFirstTime) return;
    const timer = setTimeout(() => {
      setShowCelebration(false);
      onViewed();
    }, 3000);
    return () => clearTimeout(timer);
  }, [isFirstTime, onViewed]);

  useEffect(() => {
    setReflectionText(existingReflection?.text ?? "");
    setReflectAsMirror(existingReflection?.isMirrored ?? globalMirror);
  }, [existingReflection?.text, existingReflection?.isMirrored, scroll.id, globalMirror]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-60 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 3, 4], opacity: [0, 0.5, 0] }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="absolute w-64 h-64 rounded-full bg-gradient-radial from-primary/50 via-amber-500/30 to-transparent"
            />

            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{
                scale: [0, 1.2, 1],
                rotate: [-180, 0],
                opacity: [0, 1, 1],
              }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative z-10"
            >
              <img
                src="/images/sigil-diamond-heart.png"
                alt=""
                className="w-32 h-32"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute bottom-1/3 text-center"
            >
              <p className="font-serif text-2xl text-primary">
                The wisdom is now yours
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Scroll {scroll.id} has been revealed
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layoutId={`scroll-${scroll.id}`}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0a0a0a] w-full max-w-2xl h-[80vh] rounded-2xl overflow-hidden border border-primary/20 shadow-[0_0_50px_rgba(255,215,0,0.1)] flex flex-col md:flex-row"
      >
        <div className="relative w-full md:w-1/3 h-48 md:h-full">
          <img
            src={scroll.image}
            alt={scroll.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
          <div className="absolute bottom-6 left-6">
            <h2 className="font-serif text-2xl font-bold text-white">
              {scroll.title}
            </h2>
            <p className="text-primary text-sm mt-1">Scroll {scroll.id}</p>
          </div>
        </div>

        <div className="flex-1 p-8 md:p-12 overflow-y-auto bg-[url('/images/texture-altar.jpg')] bg-cover bg-center relative">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative z-10">
            <button
              onClick={onClose}
              className="absolute top-0 right-0 p-2 hover:text-primary transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="prose prose-invert prose-p:font-serif prose-headings:font-serif max-w-none mt-8">
              <Streamdown>{scroll.markdown}</Streamdown>
            </div>

            <div className="mt-10 flex justify-center">
              <Button
                variant={isFavorited ? "default" : "outline"}
                className={
                  isFavorited
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border-primary/30 hover:bg-primary/10"
                }
                onClick={() => {
                  if (!canFavorite) {
                    toast.info("Sign in to save favorites");
                    window.location.href = getLoginUrl();
                    return;
                  }
                  onToggleFavorite();
                }}
              >
                <Star
                  className={
                    isFavorited
                      ? "w-4 h-4 mr-2 text-primary-foreground"
                      : "w-4 h-4 mr-2 text-primary"
                  }
                  fill={isFavorited ? "currentColor" : "none"}
                />
                ★ Save to Favorites
              </Button>
            </div>

            {canReflect && (
              <div className="mt-8 space-y-3 rounded-xl border border-primary/20 bg-black/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-white font-medium">Reflected Scroll</p>
                    <p className="text-xs text-muted-foreground">Capture what this scroll mirrored back to you.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Mirror voice</span>
                    <Switch
                      checked={reflectAsMirror}
                      onCheckedChange={setReflectAsMirror}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                </div>
                <Textarea
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder="Write the resonance that wants to be remembered..."
                  className="min-h-[120px] bg-black/40 text-white border-primary/20"
                />
                <div className="flex justify-end gap-2">
                  {existingReflection && onDeleteReflection && (
                    <Button
                      variant="ghost"
                      className="text-white/70 hover:text-white"
                      disabled={isSavingReflection}
                      onClick={onDeleteReflection}
                    >
                      Remove
                    </Button>
                  )}
                  <Button
                    onClick={() => onSaveReflection?.(reflectionText.trim(), reflectAsMirror)}
                    disabled={!onSaveReflection || !reflectionText.trim() || isSavingReflection}
                    className="bg-primary text-black hover:bg-primary/80"
                  >
                    {isSavingReflection ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Save Reflection
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-12 flex justify-center">
              <button className="flex items-center gap-2 text-primary hover:text-white transition-colors text-sm uppercase tracking-widest">
                Turn Page <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
