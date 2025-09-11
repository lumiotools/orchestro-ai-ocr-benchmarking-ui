import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ReportsHeader from "@/components/nav/ReportsHeader";

const HeroIllustration = () => (
  <svg
    className="size-full"
    viewBox="0 0 420 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="1" stopColor="#f8fafc" />
      </linearGradient>

      <linearGradient id="docGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff7ed" />
        <stop offset="1" stopColor="#fff1f0" />
      </linearGradient>

      <linearGradient id="docAccent" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffedd5" />
        <stop offset="1" stopColor="#fef3c7" />
      </linearGradient>

      <linearGradient id="lensGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#dbf4ff" />
        <stop offset="1" stopColor="#dbeafe" />
      </linearGradient>

      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow
          dx="0"
          dy="8"
          stdDeviation="18"
          floodColor="#000"
          floodOpacity="0.06"
        />
      </filter>
    </defs>

    {/* background card */}
    <rect x="0" y="0" className="size-full" rx="16" fill="url(#bg)" />

    {/* stacked documents with colorful accents */}
    <g transform="translate(44,36)">
      <rect
        x="28"
        y="28"
        width="240"
        height="160"
        rx="10"
        fill="url(#docGrad)"
        filter="url(#shadow)"
      />
      <rect
        x="12"
        y="16"
        width="240"
        height="160"
        rx="10"
        fill="url(#docAccent)"
        opacity="0.95"
      />
      <rect x="0" y="4" width="240" height="160" rx="10" fill="#ffffff" />

      {/* colorful text lines */}
      <g opacity="0.95">
        <rect x="18" y="24" width="140" height="10" rx="4" fill="#3b82f6" />
        <rect x="18" y="44" width="120" height="10" rx="4" fill="#06b6d4" />
        <rect x="18" y="64" width="180" height="10" rx="4" fill="#fb923c" />
        <rect x="18" y="88" width="100" height="10" rx="4" fill="#a78bfa" />
        <rect x="18" y="108" width="160" height="10" rx="4" fill="#60a5fa" />
      </g>
    </g>

    {/* magnifying glass with lens gradient */}
    <g transform="translate(280,120)">
      <circle cx="36" cy="36" r="36" fill="#ffffff" stroke="#eef2ff" />
      <circle cx="36" cy="36" r="26" fill="url(#lensGrad)" />
      <rect
        x="62"
        y="62"
        width="56"
        height="10"
        rx="5"
        transform="rotate(45 62 62)"
        fill="#94a3b8"
      />

      {/* lens detail: small colored lines to indicate detection */}
      <g transform="translate(20,18)">
        <rect x="4" y="4" width="28" height="6" rx="3" fill="#60a5fa" />
        <rect x="4" y="14" width="20" height="6" rx="3" fill="#34d399" />
      </g>
    </g>

    {/* colorful accent dots */}
    <g>
      <circle cx="330" cy="36" r="6" fill="#fb923c" opacity="0.95" />
      <circle cx="352" cy="64" r="4" fill="#60a5fa" opacity="0.95" />
      <circle cx="380" cy="40" r="5" fill="#34d399" opacity="0.9" />
    </g>
  </svg>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-muted">
      <header className="border-b bg-transparent">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-bold">Lumio AI</div>
            <span className="text-sm text-muted-foreground">
              OCR Benchmarking
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <ReportsHeader />
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-20">
        <div className="relative">
          {/* background accent */}
          <div className="absolute -z-10 inset-0 flex justify-end pointer-events-none">
            <div className="w-[40%] bg-gradient-to-br from-transparent to-primary/10 rounded-l-full h-full" />
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <Badge className="mb-4">Beta</Badge>

              <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight mb-6">
                Lumio AI&apos;s OCR Benchmarking Tool
              </h1>

              <p className="text-lg text-muted-foreground mb-8">
                Perform PDF OCR to extract markdown with multiple providers,
                then compare outputs against ground truth. Track extraction
                time, confidence scores, and accuracy to choose the best
                provider for your documents.
              </p>

              <div className="flex items-center gap-4">
                <Button asChild>
                  <Link href="/extraction">Try it out</Link>
                </Button>

                <Button variant="outline" asChild>
                  <a href="#features">See features</a>
                </Button>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-md shadow-lg rounded-xl overflow-hidden">
                <HeroIllustration />
              </div>
            </div>
          </section>

          <section id="features" className="mt-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 bg-card rounded-lg">
                <h3 className="font-semibold mb-2">Multiple providers</h3>
                <p className="text-sm text-muted-foreground">
                  Compare outputs and confidence from different OCR providers.
                </p>
              </div>

              <div className="p-6 bg-card rounded-lg">
                <h3 className="font-semibold mb-2">Benchmarks</h3>
                <p className="text-sm text-muted-foreground">
                  Measure extraction time and performance across documents.
                </p>
              </div>

              <div className="p-6 bg-card rounded-lg">
                <h3 className="font-semibold mb-2">Ground truth comparison</h3>
                <p className="text-sm text-muted-foreground">
                  Evaluate accuracy by comparing to labeled ground truth
                  markdown.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
