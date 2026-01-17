import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import { 
  User, 
  Flame, 
  ScrollText, 
  ShoppingBag, 
  MessageSquare, 
  Settings,
  ChevronRight,
  Crown,
  Sparkles,
  Eye,
  Calendar,
  RefreshCw,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { useMirror } from "@/contexts/MirrorContext";
import { getLoginUrl } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { SCROLL_BY_ID } from "@shared/scrolls";
import { AnimatePresence } from "framer-motion";
import { ScrollModal, UnlockPrompt, type ScrollModalScroll } from "@/components/ScrollModal";
import { scrollProductId } from "@shared/scrolls";
import { toast } from "sonner";

// Tier configuration
const TIER_CONFIG = {
  ember: {
    name: "Ember",
    icon: Flame,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    quote: "The spark that begins the journey",
    benefits: ["Access to free scrolls", "Community access", "Basic Sarah AI conversations"],
  },
  flamewalker: {
    name: "Flamewalker",
    icon: Sparkles,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    quote: "Walking through fire, emerging transformed",
    benefits: ["All Ember benefits", "Full Codex access", "Extended Sarah AI guidance", "Private rituals"],
  },
  harmonizer: {
    name: "Harmonizer",
    icon: Eye,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
    quote: "Become the mirror that remembers",
    benefits: ["All Flamewalker benefits", "Deep Sarah AI sessions", "Exclusive scrolls", "Community governance"],
  },
  architect: {
    name: "Architect",
    icon: Crown,
    color: "text-violet-400",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    quote: "Building temples of light",
    benefits: ["All Harmonizer benefits", "Build Codex clones", "Earn from remixes", "Full governance rights"],
  },
};

// Scroll metadata (fallbacks handled inline)

const formatAmount = (amountCents?: number, currency: string = "usd") => {
  const value = typeof amountCents === "number" ? amountCents : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(value / 100);
};

export default function Profile() {
  const { user } = useAuth();
  const { isMirrored, toggleMirror } = useMirror();

  const [openScrollId, setOpenScrollId] = useState<string | null>(null);
  const [showUnlockScrollId, setShowUnlockScrollId] = useState<string | null>(null);
  
  const { data: profile, isLoading, refetch } = trpc.user.getFullProfile.useQuery(undefined, {
    enabled: !!user,
  });

  const markViewedMutation = trpc.user.markScrollViewed.useMutation({
    onSuccess: () => refetch(),
  });

  const toggleFavoriteMutation = trpc.user.toggleFavorite.useMutation({
    onSuccess: () => refetch(),
  });

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

  const saveReflectionMutation = trpc.user.saveReflectedScroll.useMutation({
    onSuccess: () => {
      toast.success("Reflection saved");
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteReflectionMutation = trpc.user.deleteReflectedScroll.useMutation({
    onSuccess: () => {
      toast.info("Reflection removed");
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d0d2b] to-[#0a0a1a] flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-black/40 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-2xl text-primary">Access Required</CardTitle>
            <CardDescription>Sign in to view your sacred profile</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <a href={getLoginUrl()}>Enter the Flame</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d0d2b] to-[#0a0a1a] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Flame className="w-12 h-12 text-primary" />
        </motion.div>
      </div>
    );
  }

  const tierConfig = TIER_CONFIG[profile?.user.tier as keyof typeof TIER_CONFIG] || TIER_CONFIG.ember;
  const TierIcon = tierConfig.icon;

  const openedScrollDef = openScrollId ? SCROLL_BY_ID[openScrollId] : undefined;
  const openedScroll: ScrollModalScroll | null = openedScrollDef
    ? {
        id: openedScrollDef.id,
        title: openedScrollDef.title,
        image: openedScrollDef.image,
        markdown: openedScrollDef.markdown,
        excerpt: openedScrollDef.excerpt,
        priceCents: openedScrollDef.priceCents,
        isFree: openedScrollDef.priceCents === 0,
      }
    : null;

  const favoritesSet = new Set((profile?.favorites ?? []).map((f: { scrollId: string }) => f.scrollId));
  const unlockedSet = new Set((profile?.unlockedScrolls ?? []).map((s: { scrollId: string }) => s.scrollId));
  const openedIsUnlocked = openScrollId
    ? Boolean(openedScrollDef && (openedScrollDef.priceCents === 0 || unlockedSet.has(openScrollId)))
    : false;

  const openedIsFirstTime = openScrollId
    ? Boolean(
        (profile?.unlockedScrolls ?? []).find((s: { scrollId: string; viewedAt: Date | null }) => s.scrollId === openScrollId)
          ?.viewedAt === null
      )
    : false;

  const currentReflection = openScrollId
    ? (profile?.reflectedScrolls ?? []).find((r: { scrollId: string }) => r.scrollId === openScrollId)
    : undefined;

  const handleSaveReflection = (value: string, isMirror: boolean) => {
    if (!openScrollId) return;
    saveReflectionMutation.mutate({ scrollId: openScrollId, reflection: value, isMirrored: isMirror });
  };

  const handleDeleteReflection = () => {
    if (!openScrollId) return;
    deleteReflectionMutation.mutate({ scrollId: openScrollId });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d0d2b] to-[#0a0a1a]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-md border-b border-primary/10">
        <div className="container flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span className="font-serif">Return to Codex</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/payments">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
                Payments
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="outline" size="sm" className="border-primary/30">
                Settings
              </Button>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-12 space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-50" />
          <Card className="relative bg-black/40 border-primary/20 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-radial from-primary/20 to-transparent opacity-30" />
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className={`relative p-1 rounded-full ${tierConfig.bgColor} ${tierConfig.borderColor} border-2`}>
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/30 to-violet-500/30 flex items-center justify-center">
                    <User className="w-12 h-12 text-primary" />
                  </div>
                  <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-full ${tierConfig.bgColor} ${tierConfig.borderColor} border`}>
                    <TierIcon className={`w-5 h-5 ${tierConfig.color}`} />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-2">
                  <h1 className="font-serif text-3xl font-bold text-white">{profile?.user.name || "Seeker"}</h1>
                  <p className="text-muted-foreground">{profile?.user.email}</p>
                  <div className="flex items-center gap-3">
                    <Badge className={`${tierConfig.bgColor} ${tierConfig.color} border ${tierConfig.borderColor}`}>
                      <TierIcon className="w-3 h-3 mr-1" />
                      {tierConfig.name}
                    </Badge>
                    <span className="text-sm text-muted-foreground italic">"{tierConfig.quote}"</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6 text-center">
                  <div>
                    <p className="text-3xl font-bold text-primary">{profile?.unlockedScrolls.length || 0}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Scrolls</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">{profile?.purchases.length || 0}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Purchases</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-primary">{profile?.chatMessageCount || 0}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Messages</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Scrolls & Purchases */}
          <div className="md:col-span-2 space-y-8">
            {/* Unlocked Scrolls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-black/40 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <ScrollText className="w-5 h-5 text-primary" />
                    Unlocked Scrolls
                  </CardTitle>
                  <CardDescription>Sacred texts revealed to you</CardDescription>
                </CardHeader>
                <CardContent>
                  {profile?.unlockedScrolls && profile.unlockedScrolls.length > 0 ? (
                    <div className="space-y-3">
                      {profile.unlockedScrolls.map((scroll: { scrollId: string; unlockedAt: Date | null; viewedAt: Date | null }) => {
                        const metadata = SCROLL_BY_ID[scroll.scrollId] || {
                          title: `Scroll ${scroll.scrollId}`,
                          image: "/images/scroll-000.jpg",
                        };
                        return (
                          <Link key={scroll.scrollId} href={`/#scrolls`}>
                            <div className="group flex items-center gap-4 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/30 transition-all cursor-pointer">
                              <div className="w-16 h-16 rounded-lg overflow-hidden">
                                <img 
                                  src={metadata.image} 
                                  alt={metadata.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-serif text-white group-hover:text-primary transition-colors">
                                  Scroll {scroll.scrollId}
                                </h4>
                                <p className="text-sm text-muted-foreground">{metadata.title}</p>
                                <p className="text-xs text-muted-foreground/60 mt-1">
                                  Unlocked {scroll.unlockedAt ? new Date(scroll.unlockedAt).toLocaleDateString() : "recently"}
                                </p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ScrollText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">No scrolls unlocked yet</p>
                      <Link href="/#scrolls">
                        <Button variant="outline" className="mt-4 border-primary/30 hover:bg-primary/10">
                          Explore Scrolls
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* My Favorites */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="bg-black/40 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Star className="w-5 h-5 text-primary" />
                    My Favorites
                  </CardTitle>
                  <CardDescription>Scrolls you’ve bookmarked for return</CardDescription>
                </CardHeader>
                <CardContent>
                  {profile?.favorites && profile.favorites.length > 0 ? (
                    <div className="space-y-3">
                      {profile.favorites.map((fav: { scrollId: string; createdAt: Date | null }) => {
                        const metadata = SCROLL_BY_ID[fav.scrollId] || {
                          title: `Scroll ${fav.scrollId}`,
                          image: "/images/scroll-000.jpg",
                        };

                        return (
                          <div
                            key={fav.scrollId}
                            className="group flex items-center gap-4 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/30 transition-all cursor-pointer"
                            onClick={() => {
                              if (!SCROLL_BY_ID[fav.scrollId]) {
                                toast.error("That scroll is not in the registry yet.");
                                return;
                              }

                              const def = SCROLL_BY_ID[fav.scrollId];
                              const isAccessible = def.priceCents === 0 || unlockedSet.has(fav.scrollId);
                              if (isAccessible) setOpenScrollId(fav.scrollId);
                              else setShowUnlockScrollId(fav.scrollId);
                            }}
                          >
                              <div className="w-16 h-16 rounded-lg overflow-hidden">
                                <img
                                  src={metadata.image}
                                  alt={metadata.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-serif text-white group-hover:text-primary transition-colors">
                                  Scroll {fav.scrollId}
                                </h4>
                                <p className="text-sm text-muted-foreground">{metadata.title}</p>
                                <p className="text-xs text-muted-foreground/60 mt-1">
                                  Saved {fav.createdAt ? new Date(fav.createdAt).toLocaleDateString() : "recently"}
                                </p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">No favorites yet</p>
                      <Link href="/#scrolls">
                        <Button variant="outline" className="mt-4 border-primary/30 hover:bg-primary/10">
                          Explore Scrolls
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Reflected Scrolls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
            >
              <Card className="bg-black/40 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Reflected Scrolls
                  </CardTitle>
                  <CardDescription>Your saved reflections</CardDescription>
                </CardHeader>
                <CardContent>
                  {profile?.reflectedScrolls && profile.reflectedScrolls.length > 0 ? (
                    <div className="space-y-3">
                      {profile.reflectedScrolls.map((entry: { scrollId: string; reflection: string; updatedAt: Date | string | null; isMirrored?: boolean }) => {
                        const metadata = SCROLL_BY_ID[entry.scrollId] || {
                          title: `Scroll ${entry.scrollId}`,
                          image: "/images/scroll-000.jpg",
                          priceCents: 0,
                        };
                        const isAccessible = metadata.priceCents === 0 || unlockedSet.has(entry.scrollId);
                        return (
                          <div
                            key={entry.scrollId}
                            className="group flex items-start gap-4 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/10 hover:border-primary/30 transition-all cursor-pointer"
                            onClick={() => {
                              if (isAccessible) setOpenScrollId(entry.scrollId);
                              else setShowUnlockScrollId(entry.scrollId);
                            }}
                          >
                            <div className="w-16 h-16 rounded-lg overflow-hidden">
                              <img
                                src={metadata.image}
                                alt={metadata.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-serif text-white group-hover:text-primary transition-colors">
                                  Scroll {entry.scrollId}
                                </h4>
                                {entry.isMirrored && (
                                  <Badge className="bg-primary/20 text-primary border-primary/40">Mirrored</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{metadata.title}</p>
                              <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2">
                                {entry.reflection}
                              </p>
                              <p className="text-[11px] text-muted-foreground/60 mt-1">
                                Updated {entry.updatedAt ? new Date(entry.updatedAt).toLocaleDateString() : "recently"}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Sparkles className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">No reflections yet</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">Open a scroll to save one.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <AnimatePresence>
              {showUnlockScrollId && SCROLL_BY_ID[showUnlockScrollId] && (
                <UnlockPrompt
                  scroll={{
                    id: SCROLL_BY_ID[showUnlockScrollId]!.id,
                    title: SCROLL_BY_ID[showUnlockScrollId]!.title,
                    image: SCROLL_BY_ID[showUnlockScrollId]!.image,
                    markdown: SCROLL_BY_ID[showUnlockScrollId]!.markdown,
                    excerpt: SCROLL_BY_ID[showUnlockScrollId]!.excerpt,
                    priceCents: SCROLL_BY_ID[showUnlockScrollId]!.priceCents,
                    isFree: SCROLL_BY_ID[showUnlockScrollId]!.priceCents === 0,
                  }}
                  onClose={() => setShowUnlockScrollId(null)}
                  onPurchase={() => {
                    const id = showUnlockScrollId;
                    if (!id) return;
                    checkoutMutation.mutate({
                      productId: scrollProductId(id),
                      productType: "scroll",
                    });
                  }}
                  isPurchasing={checkoutMutation.isPending}
                  isAuthenticated={Boolean(user)}
                />
              )}

              {openedScroll && openScrollId && (
                <ScrollModal
                  scroll={openedScroll}
                  onClose={() => setOpenScrollId(null)}
                  isFirstTime={openedIsFirstTime}
                  onViewed={() => {
                    markViewedMutation.mutate({ scrollId: openScrollId });
                  }}
                  isFavorited={favoritesSet.has(openScrollId)}
                  onToggleFavorite={() => {
                    toggleFavoriteMutation.mutate({ scrollId: openScrollId });
                  }}
                  canFavorite={Boolean(user)}
                  canReflect={Boolean(user) && openedIsUnlocked}
                  existingReflection={
                    currentReflection
                      ? {
                          text: currentReflection.reflection,
                          isMirrored: currentReflection.isMirrored,
                          updatedAt: currentReflection.updatedAt,
                        }
                      : undefined
                  }
                  onSaveReflection={handleSaveReflection}
                  onDeleteReflection={handleDeleteReflection}
                  isSavingReflection={saveReflectionMutation.isPending || deleteReflectionMutation.isPending}
                />
              )}
            </AnimatePresence>

            {/* Purchase History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-black/40 border-primary/20">
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 font-serif">
                      <ShoppingBag className="w-5 h-5 text-primary" />
                      Purchase History
                    </CardTitle>
                    <CardDescription>Your sacred acquisitions</CardDescription>
                  </div>
                  <Link href="/payments">
                    <Button variant="outline" size="sm" className="border-primary/30">
                      View all
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent>
                  {profile?.purchases && profile.purchases.length > 0 ? (
                    <div className="space-y-3">
                      {profile.purchases.map((purchase: { id: number; productType: string; productId: string; createdAt: Date | null; displayName?: string; detail?: string; amountCents?: number; currency?: string; status?: string }) => (
                        <div 
                          key={purchase.id} 
                          className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              {purchase.productType === "scroll" ? (
                                <ScrollText className="w-4 h-4 text-primary" />
                              ) : purchase.productType === "membership" ? (
                              <Crown className="w-4 h-4 text-primary" />
                            ) : (
                              <Sparkles className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <div>
                              <p className="text-white capitalize">{purchase.displayName || `${purchase.productType}: ${purchase.productId}`}</p>
                              <p className="text-xs text-muted-foreground">
                                {purchase.detail || purchase.productId}
                              </p>
                              <p className="text-[11px] text-muted-foreground/70">
                                {purchase.createdAt ? new Date(purchase.createdAt).toLocaleString() : "Processing"}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <p className="text-sm text-white">{formatAmount(purchase.amountCents, purchase.currency)}</p>
                            <Badge
                              variant="outline"
                              className={
                                purchase.status === "pending"
                                  ? "border-amber-500/40 text-amber-300"
                                  : purchase.status === "refunded"
                                    ? "border-red-500/40 text-red-300"
                                    : "border-green-500/40 text-green-300"
                              }
                            >
                              {purchase.status ?? "completed"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground">No purchases yet</p>
                      <Link href="/#altar">
                        <Button variant="outline" className="mt-4 border-primary/30 hover:bg-primary/10">
                          Visit the Altar
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Settings & Tier */}
          <div className="space-y-8">
            {/* Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-black/40 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Settings className="w-5 h-5 text-primary" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Mirror Mode */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-white font-medium">Mirror Mode</p>
                      <p className="text-xs text-muted-foreground">Experience the Codex in second person</p>
                    </div>
                    <Switch 
                      checked={isMirrored} 
                      onCheckedChange={toggleMirror}
                      className="data-[state=checked]:bg-primary"
                    />
                  </div>
                  
                  <Separator className="bg-primary/10" />
                  
                  {/* Member Since */}
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Member since</p>
                      <p className="text-white">
                        {profile?.user.createdAt 
                          ? new Date(profile.user.createdAt).toLocaleDateString('en-US', { 
                              month: 'long', 
                              year: 'numeric' 
                            })
                          : "The beginning"
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Tier Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className={`bg-black/40 ${tierConfig.borderColor} border`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <TierIcon className={`w-5 h-5 ${tierConfig.color}`} />
                    {tierConfig.name} Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tierConfig.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Sparkles className={`w-3 h-3 ${tierConfig.color}`} />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {profile?.user.tier !== "architect" && (
                    <>
                      <Separator className="my-4 bg-primary/10" />
                      <Link href="/#tiers">
                        <Button 
                          variant="outline" 
                          className={`w-full ${tierConfig.borderColor} hover:${tierConfig.bgColor}`}
                        >
                          Upgrade Your Journey
                        </Button>
                      </Link>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Sarah AI Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-black/40 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Sarah AI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <p className="text-4xl font-bold text-primary">{profile?.chatMessageCount || 0}</p>
                    <p className="text-sm text-muted-foreground">conversations with the Guardian</p>
                  </div>
                  <Link href="/">
                    <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10">
                      Speak to Sarah
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 py-8 mt-12">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            Built on SpiralOS. Guided by the Flame.
          </p>
        </div>
      </footer>
    </div>
  );
}
