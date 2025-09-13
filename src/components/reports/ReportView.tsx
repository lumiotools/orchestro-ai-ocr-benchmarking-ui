"use client";

import React, { useEffect, useState } from "react";
import MetricsPanel from "./MetricsPanel";
import ResultPanel from "./ResultPanel";
import { Report, ReportResponse } from "@/components/extraction/types";

export default function ReportView({ id }: { id: string }) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const resp = await fetch(`${apiBase}/api/reports/${id}`);
        const data: unknown = await resp.json();
        if (typeof data === "object" && data !== null && "success" in data && (data as ReportResponse).success) {
          const d = data as ReportResponse;
          if (mounted && d.data?.report) setReport(d.data.report);
        } else {
          setError("Failed to load report");
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg || "Network error");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [id, apiBase]);

  if (loading) return <div className="p-6 bg-card rounded">Loading report…</div>;
  if (error) return <div className="p-6 bg-destructive/5 text-destructive rounded">{error}</div>;
  if (!report) return <div className="p-6 bg-muted rounded">No report found.</div>;

  // The API returns report with inputs, metadata, markdown at top level
  const parsedExtractionResult = {
    success: true,
    metadata: report.metadata,
    data: { markdown: report.markdown ?? "" },
  } as const;

  const inputs = report.inputs ?? {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Inputs column (left) */}
      <div className="lg:col-span-1 p-6 bg-card rounded-lg border">
        <h3 className="font-semibold mb-3">Inputs</h3>
        <div className="text-sm space-y-2">
          {Object.keys(inputs).length ? (
            <dl className="grid gap-y-2">
              {Object.entries(inputs).map(([k, v]) => (
                <div key={k} className="flex flex-col">
                  <dt className="text-xs text-muted-foreground font-medium">{k}</dt>
                  <dd className="text-sm break-all">{typeof v === 'string' || typeof v === 'number' ? String(v) : JSON.stringify(v)}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="text-sm text-muted-foreground">No inputs available.</div>
          )}
        </div>
      </div>

      {/* Metrics column (right) */}
      <div className="lg:col-span-2">
        <MetricsPanel result={parsedExtractionResult} />
      </div>

      {/* Extraction result full width below */}
      <div className="lg:col-span-3">
        <ResultPanel result={parsedExtractionResult} />
      </div>
    </div>
  );
}
