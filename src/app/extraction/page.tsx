"use client";

import React, { useEffect, useState } from "react";
import ProviderSelect from "@/components/extraction/ProviderSelect";
import OptionsForm from "@/components/extraction/OptionsForm";
import ResultPanel from "@/components/extraction/ResultPanel";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Provider = { name: string; label: string };

export default function ExtractionPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const [options, setOptions] = useState<any>(null);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [extracting, setExtracting] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [extractError, setExtractError] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    setLoadingProviders(true);
    fetch(`${apiBase}/api/providers`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && data?.data?.providers) {
          setProviders(data.data.providers);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingProviders(false));
  }, [apiBase]);

  useEffect(() => {
    if (!selected) return;
    setLoadingOptions(true);
    setOptions(null);
    fetch(`${apiBase}/api/providers/${selected}/options`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.success && data?.options) {
          setOptions(data.options);
          // initialize form state from defaults
          const init: Record<string, any> = {};
          Object.entries(data.options).forEach(([key, val]: any) => {
            if (val.type === "boolean") init[key] = !!val.default;
            else if (val.type === "select") init[key] = val.choices?.[0] ?? "";
            else init[key] = val.default ?? "";
          });
          setFormState(init);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingOptions(false));
  }, [selected, apiBase]);

  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Extraction</h2>
            <p className="text-sm text-muted-foreground">Choose a provider and configure inputs to start an extraction.</p>
          </div>
          <div>
            <Link href="/">Back home</Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 p-6 bg-card rounded-lg">
            <h3 className="font-semibold mb-3">Provider</h3>
            <ProviderSelect providers={providers} loading={loadingProviders} value={selected} onChange={(v) => setSelected(v)} />
          </div>

          <div className="lg:col-span-2 p-6 bg-card rounded-lg">
            <h3 className="font-semibold mb-3">Inputs</h3>

            {loadingOptions ? (
              <div className="text-sm text-muted-foreground">Loading options…</div>
            ) : options ? (
              <OptionsForm
                options={options}
                formState={formState}
                setFormState={(s) => setFormState(s)}
                extracting={extracting}
                onStart={async () => {
                  if (!selected) return;
                  setExtractError(null);
                  setResult(null);
                  setExtracting(true);
                  try {
                    const resp = await fetch(`${apiBase}/api/providers/${selected}/extract`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(formState),
                    });
                    const data = await resp.json();
                    if (data?.success) {
                      setResult(data);
                    } else {
                      setExtractError("Extraction failed: unexpected response");
                    }
                  } catch (err: any) {
                    setExtractError(err?.message ?? "Network error");
                  } finally {
                    setExtracting(false);
                  }
                }}
              />
            ) : (
              <div className="text-sm text-muted-foreground">Select a provider to load inputs.</div>
            )}

            {/* result and errors moved below to occupy full width */}
          </div>
        </div>

        {/* full width area for errors and result */}
        <div className="mt-8">
          {extractError && <div className="mb-4 p-4 bg-destructive/5 text-destructive rounded">{extractError}</div>}

          {result && (
            <div className="p-6 bg-card rounded-lg">
              <ResultPanel result={result} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
