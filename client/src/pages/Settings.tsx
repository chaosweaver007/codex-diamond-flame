import { useMemo } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useMirror } from "@/contexts/MirrorContext";
import { Mail, RefreshCw, Settings2, Sparkles, WifiOff } from "lucide-react";
import { toast } from "sonner";

const DEFAULT_SETTINGS = {
  newsletterOptIn: false,
  unlockEmailAlerts: true,
  productUpdatesOptIn: false,
};

export default function Settings() {
  const { user, isAuthenticated } = useAuth({ redirectOnUnauthenticated: true });
  const { isMirrored, toggleMirror } = useMirror();

  const settingsQuery = trpc.user.getSettings.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const updateSettings = trpc.user.updateSettings.useMutation({
    onSuccess: () => settingsQuery.refetch(),
    onError: (error) => toast.error(error.message),
  });

  const newsletterSubscribe = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => toast.success("Subscribed to the newsletter"),
    onError: (error) => toast.error(error.message),
  });

  const newsletterUnsubscribe = trpc.newsletter.unsubscribe.useMutation({
    onSuccess: () => toast.info("Unsubscribed from the newsletter"),
    onError: (error) => toast.error(error.message),
  });

  const settings = useMemo(
    () => ({ ...DEFAULT_SETTINGS, ...(settingsQuery.data ?? {}) }),
    [settingsQuery.data]
  );

  const handleToggle = (key: keyof typeof DEFAULT_SETTINGS, next: boolean) => {
    updateSettings.mutate({ [key]: next } as any);
  };

  const handleNewsletter = (next: boolean) => {
    if (next) {
      newsletterSubscribe.mutate(
        { email: user?.email ?? undefined, source: "settings" },
        { onSuccess: () => updateSettings.mutate({ newsletterOptIn: true }) }
      );
    } else {
      newsletterUnsubscribe.mutate(
        { email: user?.email ?? undefined },
        { onSuccess: () => updateSettings.mutate({ newsletterOptIn: false }) }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#06060d] via-[#0a0c18] to-[#06060d] text-white">
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/10">
        <div className="container flex items-center justify-between h-14">
          <Link href="/profile" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
            <Settings2 className="w-4 h-4" />
            Settings
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white"
              onClick={() => settingsQuery.refetch()}
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Link href="/">
              <Button variant="outline" className="border-white/20 text-white/80 hover:text-white">
                Back home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-10 space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Identity</CardTitle>
              <CardDescription className="text-white/60">
                {user?.email ?? "No email on file"}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-white/70 text-sm space-y-2">
              <p>Name: {user?.name ?? "Seeker"}</p>
              <p>Tier: <Badge className="bg-primary text-black">{user?.tier ?? "ember"}</Badge></p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Mirror Mode</CardTitle>
              <CardDescription className="text-white/60">Stay in mirrored narration across Codex</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-white font-medium">Toggle mirror</p>
                <p className="text-white/60 text-sm">Second-person prompts and reflected copy</p>
              </div>
              <Switch
                checked={isMirrored}
                onCheckedChange={() => {
                  toggleMirror();
                  updateSettings.mutate({ isMirrored: !isMirrored });
                }}
                className="data-[state=checked]:bg-primary"
              />
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="font-serif text-xl">Alerts</CardTitle>
              <CardDescription className="text-white/60">
                Keep tabs on unlocks and receipts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Unlock email alerts</p>
                  <p className="text-white/60 text-sm">Get a receipt when a scroll unlocks</p>
                </div>
                <Switch
                  checked={settings.unlockEmailAlerts}
                  onCheckedChange={(next) => handleToggle("unlockEmailAlerts", next)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              <Separator className="bg-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Product updates</p>
                  <p className="text-white/60 text-sm">Occasional releases and rituals</p>
                </div>
                <Switch
                  checked={settings.productUpdatesOptIn}
                  onCheckedChange={(next) => handleToggle("productUpdatesOptIn", next)}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Newsletter
            </CardTitle>
            <CardDescription className="text-white/60">
              Weekly mirror prompts, new scroll drops, and event invitations.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between gap-4 flex-col md:flex-row">
            <div className="space-y-1 text-center md:text-left">
              <p className="text-white font-medium">
                Status:{" "}
                <Badge className={settings.newsletterOptIn ? "bg-primary text-black" : "bg-white/10 text-white"}>
                  {settings.newsletterOptIn ? "Subscribed" : "Not subscribed"}
                </Badge>
              </p>
              <p className="text-white/60 text-sm">
                Delivered to {user?.email ?? "your inbox"}.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-white/20 text-white/80 hover:text-white"
                disabled={newsletterSubscribe.isPending || newsletterUnsubscribe.isPending}
                onClick={() => handleNewsletter(!settings.newsletterOptIn)}
              >
                {settings.newsletterOptIn ? "Unsubscribe" : "Subscribe"}
              </Button>
              <Link href="/payments">
                <Button className="bg-primary text-black hover:bg-primary/80">
                  View payments
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="font-serif text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Fail-safe
            </CardTitle>
            <CardDescription className="text-white/60">
              If you stop receiving emails, we will keep a log here.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <WifiOff className="w-5 h-5 text-white/60" />
              <p className="text-white/70 text-sm">
                Ensure your address ({user?.email ?? "unknown"}) is accurate in your auth provider.
              </p>
            </div>
            <Link href="/profile">
              <Button variant="ghost" className="text-white/80 hover:text-white">
                Back to profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
