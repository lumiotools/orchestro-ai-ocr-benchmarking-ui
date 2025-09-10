"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { format, formatDistanceToNow } from "date-fns";

function fmtTime(value: any) {
  if (!value) return "-";
  try {
    let d: Date;
    if (typeof value === "number") {
      // if epoch seems like seconds (e.g. 1e9) convert to ms
      d = new Date(value > 1e12 ? value : value * 1000);
    } else {
      d = new Date(value);
    }
    if (Number.isNaN(d.getTime())) return "-";
    return `${format(d, "PPpp")} (${formatDistanceToNow(d, { addSuffix: true })})`;
  } catch (e) {
    return String(value);
  }
}

export default function ResultPanel({ result }: { result: any }) {
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

  const extractionTime = result.metadata?.extraction_time;
  const extractionTimeStr = extractionTime == null ? "-" : `${Number(extractionTime).toFixed(2)}s`;

  return (
    <div className="mt-6 p-6 bg-background rounded-lg border">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold mb-2">Extraction result</h4>
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

      <div className="text-sm text-muted-foreground mb-3">
        Started at: {fmtTime(result.metadata?.started_at)} - Completed at: {fmtTime(result.metadata?.completed_at)} — Extraction time: {extractionTimeStr}
      </div>

      <div className="max-w-none bg-muted p-4 rounded-md">
        {raw ? (
          <pre className="whitespace-pre-wrap">{markdown}</pre>
        ) : (
          <ReactMarkdown className="prose max-w-none" remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw, rehypeSanitize]}>
            {markdown}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
