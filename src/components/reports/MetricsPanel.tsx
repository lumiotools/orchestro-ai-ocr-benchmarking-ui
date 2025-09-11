"use client";

import React from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from "recharts";
import { ExtractionResult } from "@/components/extraction/types";

function fmtTime(value: unknown) {
  if (value == null) return "-";
  try {
    let d: Date;
    if (typeof value === "number") {
      d = new Date(value > 1e12 ? value : value * 1000);
    } else if (typeof value === "string" || value instanceof Date) {
      d = new Date(value as string | Date);
    } else {
      return String(value);
    }
    if (Number.isNaN(d.getTime())) return "-";
    return `${format(d, "PPpp")} (${formatDistanceToNow(d, {
      addSuffix: true,
    })})`;
  } catch (e) {
    return String(value);
  }
}

function fmtDuration(value: unknown) {
  if (value == null || Number.isNaN(Number(value))) return "-";
  const s = Number(value);
  if (s < 60) return `${s.toFixed(2)}s`;
  if (s < 3600) {
    const mins = Math.floor(s / 60);
    const secs = Math.round(s % 60);
    return `${mins} min ${secs} sec`;
  }
  const hrs = Math.floor(s / 3600);
  const mins = Math.round((s % 3600) / 60);
  return `${hrs} hr ${mins} min`;
}

export default function MetricsPanel({ result }: { result: ExtractionResult }) {
  if (!result) return null;
  const extractionTimeStr = fmtDuration(result.metadata?.extraction_time);
  const score = result.metadata?.score;
  const scoreData = score
    ? [
        {
          name: "Overall",
          value: (score.overall_score ?? 0) * 100,
          fill: "var(--primary)",
        },
        {
          name: "Structural",
          value: (score.structural_score ?? 0) * 100,
          fill: "var(--chart-2)",
        },
        {
          name: "Content",
          value: (score.content_score ?? 0) * 100,
          fill: "var(--chart-3)",
        },
        {
          name: "Semantic",
          value: (score.semantic_score ?? 0) * 100,
          fill: "var(--chart-4)",
        },
      ]
    : [];
  const detailed = score?.detailed_metrics;

  return (
    <div className="p-6 bg-background rounded-lg border">
      <h4 className="font-semibold mb-2">Metrics</h4>
      <div className="text-sm text-muted-foreground mb-4 flex flex-wrap gap-4">
        <div>
          <span className="font-medium text-foreground">Started:</span>{" "}
          {fmtTime(result.metadata?.started_at)}
        </div>
        <div>
          <span className="font-medium text-foreground">Completed:</span>{" "}
          {fmtTime(result.metadata?.completed_at)}
        </div>
        <div>
          <span className="font-medium text-foreground">Duration:</span>{" "}
          {extractionTimeStr}
        </div>
      </div>
      {scoreData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={scoreData}
                margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <RechartsTooltip
                  formatter={(v: number) => `${v.toFixed(1)}%`}
                  cursor={{ fill: "var(--muted)" }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {scoreData.map((s) => (
                <div key={s.name} className="p-3 rounded-md bg-muted">
                  <div className="text-xs font-medium mb-1 tracking-wide text-muted-foreground">
                    {s.name}
                  </div>
                  <div className="text-lg font-semibold">
                    {s.value.toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
            {detailed && (
              <div className="p-3 rounded-md bg-muted text-xs space-y-2">
                <div className="font-medium text-foreground text-sm">
                  Detailed Metrics
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  <div>
                    Words: {detailed.word_count_extracted ?? 0}/
                    {detailed.word_count_expected ?? 0}
                  </div>
                  <div>
                    Chars: {detailed.character_count_extracted ?? 0}/
                    {detailed.character_count_expected ?? 0}
                  </div>
                  <div>
                    Word Ratio:{" "}
                    {((detailed.word_count_ratio ?? 0) * 100).toFixed(1)}%
                  </div>
                  <div>
                    Char Ratio:{" "}
                    {((detailed.character_count_ratio ?? 0) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground italic">
          No score metrics available.
        </div>
      )}
    </div>
  );
}
