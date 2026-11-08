"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrowseView } from "@/components/atlas/BrowseView";
import { GraphView } from "@/components/atlas/GraphView";
import { AboutView } from "@/components/atlas/AboutView";
import { stats } from "@/lib/atlas";
import { Github, ShieldCheck, Sigma } from "lucide-react";

export default function Home() {
  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState("browse");

  const openInBrowse = (full: string) => {
    setSelected(full);
    setTab("browse");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* header */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur sticky top-0 z-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3.5 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center shrink-0">
              <Sigma className="h-5 w-5 text-emerald-300" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[17px] font-semibold text-slate-100 leading-tight">
                Logic Induction{" "}
                <span className="text-slate-500 font-normal">— Proof Atlas</span>
              </h1>
              <p className="text-[12px] text-slate-500 leading-tight">
                Well-founded induction, formalized twice: on paper and in Lean 4
              </p>
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="border-slate-700 text-slate-400 font-normal">
              {stats.theorems} theorems
            </Badge>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-300 font-normal">
              <ShieldCheck className="h-3 w-3 mr-1" /> sorry-free
            </Badge>
            <a
              href="https://github.com/MinaBasilious/logic_induction"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 px-2.5 py-1.5 text-[13px] text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300 transition-colors min-h-[34px]"
            >
              <Github className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">MinaBasilious/logic_induction</span>
            </a>
          </div>
        </div>
      </header>

      {/* content */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-5">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="bg-slate-900/60 border border-slate-800 mb-4">
            <TabsTrigger value="browse" className="data-[state=active]:text-emerald-300 data-[state=active]:bg-emerald-500/10 text-slate-400 text-[13px]">
              Browse proofs
            </TabsTrigger>
            <TabsTrigger value="graph" className="data-[state=active]:text-emerald-300 data-[state=active]:bg-emerald-500/10 text-slate-400 text-[13px]">
              Proof tree
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:text-emerald-300 data-[state=active]:bg-emerald-500/10 text-slate-400 text-[13px]">
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-0">
            <BrowseView selected={selected} onSelect={setSelected} />
          </TabsContent>

          <TabsContent value="graph" className="mt-0">
            <GraphView onOpenBrowse={openInBrowse} />
          </TabsContent>

          <TabsContent value="about" className="mt-0">
            <AboutView />
          </TabsContent>
        </Tabs>
      </main>

      {/* footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] text-slate-600">
          <span>
            Formalization of lecture notes by Prof. Mohamed Amer (Cairo University) · Lean proofs by
            Mina Basilious · MIT License
          </span>
          <span className="ml-auto inline-flex items-center gap-1.5">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            audited: {stats.axioms.join(" · ")}
          </span>
        </div>
      </footer>
    </div>
  );
}
