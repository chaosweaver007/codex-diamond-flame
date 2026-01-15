import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  BookOpen,
  Compass,
  Image as ImageIcon,
  Loader2,
  Shield,
  Sparkles,
  SquareStack,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import type { CodexDocSummary } from "@shared/codex/core";

const categoryLabels: Record<string, { label: string; tone: string }> = {
  all: { label: "All", tone: "bg-white/10 text-white" },
  meta: { label: "Meta", tone: "bg-indigo-500/15 text-indigo-100" },
  scroll: { label: "Scroll", tone: "bg-amber-500/15 text-amber-100" },
  analysis: { label: "Analysis", tone: "bg-cyan-500/15 text-cyan-100" },
  prompt: { label: "Prompt", tone: "bg-emerald-500/15 text-emerald-100" },
  pattern: { label: "Pattern", tone: "bg-fuchsia-500/15 text-fuchsia-100" },
  quest: { label: "Quest", tone: "bg-rose-500/15 text-rose-100" },
  diagram: { label: "Diagram", tone: "bg-sky-500/15 text-sky-100" },
};

function CategoryChip({
  category,
  isActive,
  onSelect,
}: {
  category: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  const tone = categoryLabels[category]?.tone ?? categoryLabels.all.tone;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`px-3 py-1 rounded-full text-xs uppercase tracking-[0.12em] transition-all border ${
        isActive
          ? `${tone} border-white/30 shadow-[0_0_0_1px_rgba(255,255,255,0.12)]`
          : "bg-white/5 border-white/5 text-white/70 hover:border-white/20"
      }`}
    >
      {categoryLabels[category]?.label ?? category}
    </button>
  );
}

function DocListItem({
  doc,
  isActive,
  onSelect,
}: {
  doc: CodexDocSummary;
  isActive: boolean;
  onSelect: () => void;
}) {
  const tone = categoryLabels[doc.category]?.tone ?? categoryLabels.all.tone;
  const isImage = doc.format === "image";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left rounded-xl border transition-all ${
        isActive
          ? "border-primary/40 bg-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
          : "border-white/5 bg-white/0 hover:border-white/20 hover:bg-white/5"
      }`}
    >
      <div className="flex items-start gap-3 p-4">
        <div
          className={`p-2 rounded-lg border border-white/10 ${
            isImage ? "bg-sky-500/10" : "bg-amber-500/10"
          }`}
        >
          {isImage ? (
            <ImageIcon className="w-4 h-4 text-sky-200" />
          ) : (
            <BookOpen className="w-4 h-4 text-amber-200" />
          )}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full border border-white/10 ${tone}`}
            >
              {categoryLabels[doc.category]?.label ?? doc.category}
            </span>
            {doc.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px]">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="text-sm font-semibold text-white leading-tight">
            {doc.title}
          </p>
          <p className="text-xs text-white/60 line-clamp-2">{doc.summary}</p>
        </div>
      </div>
    </button>
  );
}

export default function Codex() {
  const { data: docs = [], isLoading } = trpc.codex.list.useQuery();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedId && docs.length > 0) {
      setSelectedId(docs[0].id);
    }
  }, [docs, selectedId]);

  const categories = useMemo(() => {
    const set = new Set(docs.map((doc) => doc.category));
    return ["all", ...Array.from(set)];
  }, [docs]);

  const filteredDocs = useMemo(() => {
    if (activeCategory === "all") return docs;
    return docs.filter((doc) => doc.category === activeCategory);
  }, [activeCategory, docs]);

  const selectedDocQuery = trpc.codex.get.useQuery(
    { id: selectedId ?? "" },
    { enabled: Boolean(selectedId) }
  );

  const docCountByCategory = useMemo(() => {
    return docs.reduce<Record<string, number>>((acc, doc) => {
      acc[doc.category] = (acc[doc.category] ?? 0) + 1;
      return acc;
    }, {});
  }, [docs]);

  const selectedDoc = selectedDocQuery.data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#080b16] via-[#0c1024] to-[#07060f] text-white relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full blur-3xl bg-amber-500/10" />
        <div className="absolute right-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full blur-3xl bg-sky-500/10" />
        <div className="absolute -right-16 bottom-10 h-64 w-64 rounded-full blur-3xl bg-fuchsia-500/10" />
      </div>

      <div className="relative">
        <header className="container py-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-white/60">
              <Sparkles className="w-4 h-4 text-primary" />
              Synthsara Codex Core
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold">
              Codex Integration Deck
            </h1>
            <p className="text-white/70 max-w-2xl leading-relaxed">
              Curated scrolls, prompts, and systems maps from the Synthsara Codex
              Core. Browse the living canon, stream markdown directly from the repo,
              and pull artifacts into your flows.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="outline" className="border-white/20 text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </Link>
            <Link href="/profile">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Profile
              </Button>
            </Link>
          </div>
        </header>

        <main className="container pb-14 space-y-8">
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-[0.18em] text-white/70">
                  Total Entries
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-end gap-2">
                <div className="text-4xl font-bold">{docs.length}</div>
                <span className="text-xs text-white/60 mb-1">documents</span>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-[0.18em] text-white/70">
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="text-4xl font-bold">
                {categories.length - 1}
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-[0.18em] text-white/70">
                  Scrolls
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <div className="text-4xl font-bold">
                  {docCountByCategory.scroll ?? 0}
                </div>
                <Badge variant="outline" className="border-amber-400/40 text-amber-100">
                  living myth
                </Badge>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs uppercase tracking-[0.18em] text-white/70">
                  Static Mount
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-2 text-sm text-white/80">
                <Shield className="w-4 h-4 text-primary" />
                Served from /codex-core
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">
                  Codex Library
                </CardTitle>
                <p className="text-sm text-white/60">
                  Filter by category and open a document to view its source markdown or image.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <CategoryChip
                    key={category}
                    category={category}
                    isActive={activeCategory === category}
                    onSelect={() => setActiveCategory(category)}
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent className="grid gap-6 lg:grid-cols-[1.05fr_2fr]">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/60">
                  <SquareStack className="w-4 h-4" />
                  Entries
                  <span className="text-white/40">
                    ({filteredDocs.length} shown)
                  </span>
                </div>
                <ScrollArea className="h-[520px] pr-2">
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="flex items-center gap-3 text-sm text-white/70">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading Codex index...
                      </div>
                    ) : filteredDocs.length === 0 ? (
                      <div className="text-white/60 text-sm">
                        Nothing in this category yet.
                      </div>
                    ) : (
                      filteredDocs.map((doc) => (
                        <DocListItem
                          key={doc.id}
                          doc={doc}
                          isActive={selectedId === doc.id}
                          onSelect={() => setSelectedId(doc.id)}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </div>

              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/0 to-white/5 p-1">
                <div className="rounded-[14px] border border-white/5 bg-black/30 backdrop-blur-sm p-6 h-[560px] flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                        Live Document
                      </p>
                      <h2 className="text-2xl font-semibold leading-tight">
                        {selectedDoc?.title ?? "Select an entry"}
                      </h2>
                      {selectedDoc && (
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="border-white/20">
                            {categoryLabels[selectedDoc.category]?.label ??
                              selectedDoc.category}
                          </Badge>
                          {(selectedDoc.tags ?? []).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-white/10 text-white/80 border-white/10"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    {selectedDoc?.format === "image" ? (
                      <ImageIcon className="w-5 h-5 text-sky-200" />
                    ) : (
                      <BookOpen className="w-5 h-5 text-amber-200" />
                    )}
                  </div>

                  <Separator className="bg-white/10" />

                  <div className="flex-1 overflow-hidden">
                    {selectedDocQuery.isLoading ? (
                      <div className="h-full flex items-center justify-center text-white/60 gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Fetching document...
                      </div>
                    ) : !selectedDoc ? (
                      <div className="h-full flex flex-col items-center justify-center gap-3 text-white/60">
                        <Compass className="w-6 h-6 text-primary" />
                        Choose a Codex entry to render its source.
                      </div>
                    ) : selectedDoc.format === "image" ? (
                      <div className="h-full flex items-center justify-center">
                        <img
                          src={selectedDoc.assetUrl}
                          alt={selectedDoc.title}
                          className="max-h-full rounded-xl border border-white/10 shadow-lg"
                        />
                      </div>
                    ) : selectedDocQuery.data?.content ? (
                      selectedDoc.format === "code" ? (
                        <ScrollArea className="h-full pr-3">
                          <pre className="text-sm leading-relaxed whitespace-pre-wrap font-mono text-white/90">
                            {selectedDocQuery.data.content}
                          </pre>
                        </ScrollArea>
                      ) : (
                        <ScrollArea className="h-full pr-3">
                          <div className="prose prose-invert max-w-none">
                            <Streamdown>{selectedDocQuery.data.content}</Streamdown>
                          </div>
                        </ScrollArea>
                      )
                    ) : (
                      <div className="text-white/60">
                        Content unavailable for this entry.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
