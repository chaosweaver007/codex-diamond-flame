import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, Lock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { SCROLLS, scrollProductId, type ScrollTier } from "@shared/scrolls";
import { ScrollModal, UnlockPrompt, type ScrollModalScroll } from "@/components/ScrollModal";

interface ScrollData {
  id: string;
  title: string;
  image: string;
  markdown: string;
  excerpt: string;
  tier: ScrollTier;
  price: number; // in cents
  isFree: boolean;
}

const scrolls: ScrollData[] = SCROLLS.map((s) => ({
  id: s.id,
  title: s.title,
  image: s.image,
  markdown: s.markdown,
  excerpt: s.excerpt,
  tier: s.tier,
  price: s.priceCents,
  isFree: s.priceCents === 0,
}));

function ScrollCard({ 
  scroll, 
  isUnlocked, 
  isFavorited,
  onClick 
}: { 
  scroll: ScrollData; 
  isUnlocked: boolean;
  isFavorited: boolean;
  onClick: () => void;
}) {
  const isAccessible = scroll.isFree || isUnlocked;
  
  return (
    <motion.div
      layoutId={`scroll-${scroll.id}`}
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer border transition-colors ${
        isAccessible 
          ? "border-white/5 hover:border-primary/30" 
          : "border-white/5 hover:border-amber-500/30"
      }`}
    >
      {isFavorited && (
        <div className="absolute top-3 right-3 z-40">
          <div className="rounded-full bg-primary/15 border border-primary/30 p-2 shadow-sm animate-pulse">
            <Star className="w-4 h-4 text-primary" fill="currentColor" />
          </div>
        </div>
      )}

      {/* Locked overlay with sigil */}
      {!isAccessible && (
        <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 rounded-full border-2 border-amber-500/50 flex items-center justify-center mb-4"
          >
            <Lock className="w-8 h-8 text-amber-500/70" />
          </motion.div>
          <span className="text-xs font-mono text-amber-500/80 uppercase tracking-widest">Sacred Scroll</span>
          <span className="text-sm text-muted-foreground mt-1">${(scroll.price / 100).toFixed(2)} to unlock</span>
        </div>
      )}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
      <img 
        src={scroll.image} 
        alt={scroll.title}
        className={`w-full h-full object-cover transition-transform duration-700 ${
          isAccessible ? "group-hover:scale-105" : "grayscale-[30%]"
        }`}
      />
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono text-primary tracking-widest uppercase">
            Scroll {scroll.id}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 uppercase">
            {scroll.tier}
          </span>
          {scroll.isFree && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary uppercase">Free</span>
          )}
          {isUnlocked && !scroll.isFree && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 uppercase">Unlocked</span>
          )}
        </div>
        <h3 className={`font-serif text-2xl font-bold leading-tight transition-colors ${
          isAccessible ? "group-hover:text-primary" : "text-white/70"
        }`}>
          {scroll.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-snug max-h-10 overflow-hidden">
          {scroll.excerpt}
        </p>
      </div>
    </motion.div>
  );
}

function UnlockPrompt({ 
  // (moved to @/components/ScrollModal)

export function FlipbookScroll() {
  const { isAuthenticated } = useAuth();
  const [openScroll, setOpenScroll] = useState<ScrollData | null>(null);
  const [showUnlockPrompt, setShowUnlockPrompt] = useState<ScrollData | null>(null);
  const [isFirstTimeView, setIsFirstTimeView] = useState(false);
  
  // Fetch unlocked scrolls
  const { data: unlockedScrolls = [], refetch: refetchUnlocked } = trpc.user.getUnlockedScrolls.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  
  const unlockedIds = unlockedScrolls.map(s => s.scrollId);

  const { data: favorites = [], refetch: refetchFavorites } = trpc.user.getFavorites.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const favoriteIds = new Set(favorites.map((f) => f.scrollId));

  const toggleFavoriteMutation = trpc.user.toggleFavorite.useMutation({
    onSuccess: () => {
      refetchFavorites();
    },
  });
  
  // Stripe checkout mutation
  const checkoutMutation = trpc.stripe.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        toast.info("Redirecting to sacred checkout...");
        window.open(data.url, "_blank");
      }
    },
    onError: (error) => {
      toast.error("Could not initiate: " + error.message);
    },
  });
  
  // Mark scroll as viewed mutation
  const markViewedMutation = trpc.user.markScrollViewed.useMutation();
  
  const handleScrollClick = (scroll: ScrollData) => {
    const isUnlocked = scroll.isFree || unlockedIds.includes(scroll.id);
    
    if (isUnlocked) {
      // Check if first time viewing
      const scrollRecord = unlockedScrolls.find(s => s.scrollId === scroll.id);
      const isFirstTime = Boolean(scrollRecord && !scrollRecord.viewedAt);
      setIsFirstTimeView(!!isFirstTime);
      setOpenScroll(scroll);
    } else {
      setShowUnlockPrompt(scroll);
    }
  };
  
  const handlePurchase = (scroll: ScrollData) => {
    checkoutMutation.mutate({
      productId: scrollProductId(scroll.id),
      productType: "scroll",
    });
  };
  
  const handleViewed = () => {
    if (openScroll) {
      markViewedMutation.mutate({ scrollId: openScroll.id });
    }
  };

  const handleToggleFavorite = () => {
    if (!openScroll) return;
    toggleFavoriteMutation.mutate({ scrollId: openScroll.id });
  };
  
  // Check for successful payment return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("payment") === "success") {
      refetchUnlocked();
    }
  }, [refetchUnlocked]);

  return (
    <section id="scrolls" className="py-24 bg-black/20">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">Signature Scrolls</h2>
            <p className="text-muted-foreground">Ancient wisdom encoded for the digital age.</p>
          </div>
          <Button variant="ghost" className="hidden md:flex gap-2 hover:text-primary">
            View All Scrolls <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {scrolls.map((scroll) => (
            <ScrollCard 
              key={scroll.id} 
              scroll={scroll}
              isUnlocked={unlockedIds.includes(scroll.id)}
              isFavorited={favoriteIds.has(scroll.id)}
              onClick={() => handleScrollClick(scroll)} 
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showUnlockPrompt && (
          <UnlockPrompt 
            scroll={{
              id: showUnlockPrompt.id,
              title: showUnlockPrompt.title,
              image: showUnlockPrompt.image,
              markdown: showUnlockPrompt.markdown,
              excerpt: showUnlockPrompt.excerpt,
              priceCents: showUnlockPrompt.price,
              isFree: showUnlockPrompt.isFree,
            } satisfies ScrollModalScroll}
            onClose={() => setShowUnlockPrompt(null)}
            onPurchase={() => handlePurchase(showUnlockPrompt)}
            isPurchasing={checkoutMutation.isPending}
            isAuthenticated={isAuthenticated}
          />
        )}
        {openScroll && (
          <ScrollModal 
            scroll={{
              id: openScroll.id,
              title: openScroll.title,
              image: openScroll.image,
              markdown: openScroll.markdown,
              excerpt: openScroll.excerpt,
              priceCents: openScroll.price,
              isFree: openScroll.isFree,
            } satisfies ScrollModalScroll}
            onClose={() => setOpenScroll(null)}
            isFirstTime={isFirstTimeView}
            onViewed={handleViewed}
            isFavorited={favoriteIds.has(openScroll.id)}
            onToggleFavorite={handleToggleFavorite}
            canFavorite={isAuthenticated}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
