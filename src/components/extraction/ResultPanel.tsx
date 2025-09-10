"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ExtractionResult } from "./types";

export default function ResultPanel({ result }: { result: ExtractionResult }) {
  const [raw, setRaw] = useState(false);
  const [copied, setCopied] = useState(false);
  if (!result) return null;

  const markdown = result.data?.markdown ?? "";

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      // fallback: select + alert
      console.error("copy failed", e);
    }
  };

  return (
    <div className="p-6 bg-background rounded-lg border">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold">Extraction Result</h4>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Raw</span>
            <Switch checked={raw} onCheckedChange={(v: boolean) => setRaw(v)} />
          </div>
          <Button size="sm" variant="ghost" onClick={copyOutput} aria-label="Copy output">
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      </div>
      <div className="max-w-none bg-muted p-4 rounded-md">
        {raw ? (
          <pre className="whitespace-pre-wrap text-sm leading-relaxed">{markdown}</pre>
        ) : (
          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
              {markdown}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
