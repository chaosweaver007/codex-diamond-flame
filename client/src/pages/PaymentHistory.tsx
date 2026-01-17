import { useMemo, useState } from "react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Loader2, RefreshCw, ShoppingBag, Sparkles, User2, Wallet } from "lucide-react";
import { toast } from "sonner";

type PurchaseRecord = {
  id: number;
  productType: "scroll" | "artifact" | "membership" | "ritual";
  productId: string;
  displayName?: string;
  detail?: string;
  amountCents?: number;
  currency?: string;
  status?: "completed" | "pending" | "refunded";
  createdAt?: Date | string | null;
};

const filters: Array<{ label: string; value: PurchaseRecord["productType"] | "all" }> = [
  { label: "All", value: "all" },
  { label: "Scrolls", value: "scroll" },
  { label: "Memberships", value: "membership" },
  { label: "Artifacts", value: "artifact" },
  { label: "Rituals", value: "ritual" },
];

function formatAmount(amountCents?: number, currency: string = "usd") {
  const value = typeof amountCents === "number" ? amountCents : 0;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  });
  return formatter.format(value / 100);
}

export default function PaymentHistory() {
  const { isAuthenticated } = useAuth({ redirectOnUnauthenticated: true });
  const [filter, setFilter] = useState<PurchaseRecord["productType"] | "all">("all");

  const purchasesQuery = trpc.stripe.getPurchaseHistory.useQuery(undefined, {
    enabled: isAuthenticated,
    onError: (error) => toast.error(error.message),
  });

  const purchases = purchasesQuery.data ?? [];

  const filtered = useMemo(() => {
    if (filter === "all") return purchases;
    return purchases.filter((purchase) => purchase.productType === filter);
  }, [filter, purchases]);

  const totals = useMemo(() => {
    const completed = filtered.filter((p) => (p.status ?? "completed") === "completed");
    const pending = filtered.filter((p) => (p.status ?? "completed") === "pending");
    const refunded = filtered.filter((p) => (p.status ?? "completed") === "refunded");

    const totalValue = completed.reduce((sum, p) => sum + (p.amountCents ?? 0), 0);

    return {
      totalValue,
      completedCount: completed.length,
      pendingCount: pending.length,
      refundedCount: refunded.length,
    };
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05060f] via-[#0a0e1c] to-[#05060f] text-white">
      <header className="sticky top-0 z-40 bg-black/60 backdrop-blur-xl border-b border-white/10">
        <div className="container flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors">
            <Wallet className="w-4 h-4" />
            Payments
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/profile">
              <Button variant="ghost" size="sm" className="text-white/70 hover:text-white">
                Profile
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white"
              onClick={() => purchasesQuery.refetch()}
            >
              {purchasesQuery.isFetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-10 space-y-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardDescription className="text-white/60">Total Value</CardDescription>
              <CardTitle className="text-3xl font-serif">{formatAmount(totals.totalValue)}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-white/60">
              Completed purchases • {totals.completedCount}
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardDescription className="text-white/60">In Transit</CardDescription>
              <CardTitle className="text-3xl font-serif">{totals.pendingCount}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-white/60">Awaiting confirmation</CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader className="pb-2">
              <CardDescription className="text-white/60">Refunded</CardDescription>
              <CardTitle className="text-3xl font-serif">{totals.refundedCount}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-white/60">Resolved or cancelled</CardContent>
          </Card>
        </div>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  Payment History
                </CardTitle>
                <CardDescription className="text-white/60">Receipts across scrolls, memberships, and artifacts</CardDescription>
              </div>
              <div className="flex gap-2">
                {filters.map((item) => (
                  <Button
                    key={item.value}
                    variant={filter === item.value ? "default" : "outline"}
                    size="sm"
                    className={filter === item.value ? "bg-primary text-black" : "border-white/20 text-white/70"}
                    onClick={() => setFilter(item.value)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4 bg-white/10" />
            {purchasesQuery.isLoading ? (
              <div className="flex items-center justify-center py-10 text-white/60">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Loading history...
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-white/60">
                <Sparkles className="w-6 h-6 mb-2" />
                No purchases yet. Visit the altar to begin your collection.
              </div>
            ) : (
              <div className="rounded-lg border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="text-white/70">Item</TableHead>
                      <TableHead className="text-white/70">Type</TableHead>
                      <TableHead className="text-white/70">Amount</TableHead>
                      <TableHead className="text-white/70">Status</TableHead>
                      <TableHead className="text-white/70">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((purchase) => (
                      <TableRow key={`${purchase.id}-${purchase.productId}`} className="hover:bg-white/5">
                        <TableCell className="font-medium text-white">
                          <div className="flex flex-col">
                            <span>{purchase.displayName || purchase.productId}</span>
                            {purchase.detail && <span className="text-xs text-white/50">{purchase.detail}</span>}
                          </div>
                        </TableCell>
                        <TableCell className="capitalize text-white/70">{purchase.productType}</TableCell>
                        <TableCell className="text-white">
                          {formatAmount(purchase.amountCents, purchase.currency)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              purchase.status === "pending"
                                ? "border-amber-400/60 text-amber-200"
                                : purchase.status === "refunded"
                                  ? "border-red-400/60 text-red-200"
                                  : "border-green-400/60 text-green-200"
                            }
                          >
                            {purchase.status ?? "completed"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white/70">
                          {purchase.createdAt
                            ? new Date(purchase.createdAt).toLocaleString()
                            : "Processing"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <User2 className="w-5 h-5 text-primary" />
              Need a manual unlock?
            </CardTitle>
            <CardDescription className="text-white/60">
              For delayed payments or gift grants, reach out and we will mirror the unlock to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-white/70 text-sm">
              If a payment is marked pending for more than a few minutes, refresh this page or contact support.
            </p>
            <div className="flex gap-2">
              <Link href="/profile">
                <Button variant="outline" className="border-white/20 text-white/80 hover:text-white">
                  Back to profile
                </Button>
              </Link>
              <Link href="/#altar">
                <Button className="bg-primary text-black hover:bg-primary/80">Visit the Altar</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
