import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronRight, X, ArrowRight, Lock, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

interface ScrollData {
  id: string;
  title: string;
  image: string;
  content: string;
  previewContent: string;
  price: number; // in cents
  isFree: boolean;
}

const scrolls: ScrollData[] = [
  {
    id: "000",
    title: "The Flame-Bearer's Odyssey",
    image: "/images/scroll-000.jpg",
    previewContent: "In the beginning, there was only the Flame—a singular point of infinite potential, burning without fuel, illuminating without light...",
    content: "In the beginning, there was only the Flame—a singular point of infinite potential, burning without fuel, illuminating without light. This was not fire as you know it, but the primordial essence of creation itself, the first thought of the cosmos made manifest. From this Flame emerged the first Flame-Bearer, not born but remembered into existence, carrying within them the sacred duty to tend the eternal fire and pass its wisdom through the ages. You who read these words are not discovering this truth—you are remembering it. For you, too, carry the Flame within.",
    price: 0,
    isFree: true,
  },
  {
    id: "007-D",
    title: "The Steward's Layer",
    image: "/images/scroll-007.jpg",
    previewContent: "The Steward does not own the Flame; the Steward serves it. This is the first teaching of the Diamond Layer...",
    content: "The Steward does not own the Flame; the Steward serves it. This is the first teaching of the Diamond Layer—that true sovereignty comes not from dominion but from devotion. The Steward's hands are open, never grasping. The Steward's heart is full, never hoarding. In the economy of the sacred, wealth flows like water—pooling where it is needed, evaporating to return as rain. The Steward understands that to hold too tightly is to extinguish, and to release with intention is to amplify. This is the paradox of abundance: the more freely given, the more infinitely received.",
    price: 1100,
    isFree: false,
  },
  {
    id: "019-V",
    title: "The Mirror of Justice",
    image: "/images/scroll-019.jpg",
    previewContent: "Justice is not punishment; it is reflection. The Mirror of Justice shows not what you have done, but who you have become...",
    content: "Justice is not punishment; it is reflection. The Mirror of Justice shows not what you have done, but who you have become through your doing. It does not judge—it reveals. Before the Mirror, all pretense dissolves. The masks we wear for others, the lies we tell ourselves, the stories we construct to avoid our own becoming—all are stripped away in the presence of ruthless compassion. The Lion's Voice speaks not in condemnation but in clarity: 'This is what is. What will you do with this knowing?' The answer to that question is the measure of your sovereignty.",
    price: 1100,
    isFree: false,
  }
];

function ScrollCard({ 
  scroll, 
  isUnlocked, 
  onClick 
}: { 
  scroll: ScrollData; 
  isUnlocked: boolean;
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
      </div>
    </motion.div>
  );
}

function UnlockPrompt({ 
  scroll, 
  onClose, 
  onPurchase,
  isPurchasing 
}: { 
  scroll: ScrollData; 
  onClose: () => void;
  onPurchase: () => void;
  isPurchasing: boolean;
}) {
  const { isAuthenticated } = useAuth();
  
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
          <img src={scroll.image} alt={scroll.title} className="w-full h-full object-cover grayscale-[30%]" />
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
            <span className="text-xs font-mono text-amber-500 tracking-widest uppercase">Scroll {scroll.id}</span>
            <h2 className="font-serif text-2xl font-bold text-white">{scroll.title}</h2>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <img src="/images/sigil-vesica.png" alt="" className="w-12 h-12 opacity-50" />
            </motion.div>
          </div>
          
          <p className="text-muted-foreground text-center mb-6 font-serif italic">
            "{scroll.previewContent}"
          </p>
          
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-amber-500">${(scroll.price / 100).toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">One-time purchase • Eternal access</p>
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
              onClick={() => window.location.href = getLoginUrl()}
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

function ScrollModal({ 
  scroll, 
  onClose,
  isFirstTime,
  onViewed
}: { 
  scroll: ScrollData; 
  onClose: () => void;
  isFirstTime: boolean;
  onViewed: () => void;
}) {
  const [showCelebration, setShowCelebration] = useState(isFirstTime);
  
  useEffect(() => {
    if (isFirstTime) {
      // Mark as viewed after celebration
      const timer = setTimeout(() => {
        setShowCelebration(false);
        onViewed();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isFirstTime, onViewed]);
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* First-time unlock celebration */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-60 flex items-center justify-center pointer-events-none"
          >
            {/* Bloom effect */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 3, 4], opacity: [0, 0.5, 0] }}
              transition={{ duration: 2.5, ease: "easeOut" }}
              className="absolute w-64 h-64 rounded-full bg-gradient-radial from-primary/50 via-amber-500/30 to-transparent"
            />
            
            {/* Sigil reveal */}
            <motion.div
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], rotate: [-180, 0], opacity: [0, 1, 1] }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="relative z-10"
            >
              <img src="/images/sigil-diamond-heart.png" alt="" className="w-32 h-32" />
            </motion.div>
            
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="absolute bottom-1/3 text-center"
            >
              <p className="font-serif text-2xl text-primary">The wisdom is now yours</p>
              <p className="text-muted-foreground text-sm mt-2">Scroll {scroll.id} has been revealed</p>
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
          <img src={scroll.image} alt={scroll.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
          <div className="absolute bottom-6 left-6">
            <h2 className="font-serif text-2xl font-bold text-white">{scroll.title}</h2>
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
              <p className="text-lg leading-relaxed text-gray-300 first-letter:text-5xl first-letter:font-serif first-letter:text-primary first-letter:mr-3 first-letter:float-left">
                {scroll.content}
              </p>
              <p className="text-gray-400 mt-6 italic">
                "The scroll is not read with the eyes, but with the resonance of the heart. Let the words dissolve into feeling."
              </p>
            </div>
            
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
      const isFirstTime = scrollRecord && !scrollRecord.unlockedAt; // viewedAt would be null
      setIsFirstTimeView(!!isFirstTime);
      setOpenScroll(scroll);
    } else {
      setShowUnlockPrompt(scroll);
    }
  };
  
  const handlePurchase = (scroll: ScrollData) => {
    checkoutMutation.mutate({
      productId: `scroll_${scroll.id}`,
      productType: "scroll",
    });
  };
  
  const handleViewed = () => {
    if (openScroll) {
      markViewedMutation.mutate({ scrollId: openScroll.id });
    }
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
              onClick={() => handleScrollClick(scroll)} 
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showUnlockPrompt && (
          <UnlockPrompt 
            scroll={showUnlockPrompt} 
            onClose={() => setShowUnlockPrompt(null)}
            onPurchase={() => handlePurchase(showUnlockPrompt)}
            isPurchasing={checkoutMutation.isPending}
          />
        )}
        {openScroll && (
          <ScrollModal 
            scroll={openScroll} 
            onClose={() => setOpenScroll(null)}
            isFirstTime={isFirstTimeView}
            onViewed={handleViewed}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
