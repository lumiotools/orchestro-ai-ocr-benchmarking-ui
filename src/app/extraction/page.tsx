"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProviderSelect from "@/components/extraction/ProviderSelect";
import OptionsForm from "@/components/extraction/OptionsForm";
import { ExtractionResult } from "@/components/extraction/types";
import PageHeader from "@/components/common/PageHeader";
import ReportsHeader from "@/components/nav/ReportsHeader";

type Provider = { name: string; label: string };

type OptionSpec = {
    type: "boolean" | "select" | "string" | "number";
    default?: boolean | string | number;
    choices?: string[];
    label?: string;
};

type ProvidersResponse = {
    success: boolean;
    data?: { providers?: Provider[] };
};

type OptionsResponse = {
    success: boolean;
    options?: Record<string, OptionSpec>;
};

export default function ExtractionPage() {
    const router = useRouter();
    const [providers, setProviders] = useState<Provider[]>([]);
    const [loadingProviders, setLoadingProviders] = useState(false);
    const [selected, setSelected] = useState<string | undefined>(undefined);

    const [options, setOptions] = useState<Record<string, OptionSpec> | null>(null);
    const [loadingOptions, setLoadingOptions] = useState(false);
    const [formState, setFormState] = useState<Record<string, string | number | boolean>>({});
    const [extracting, setExtracting] = useState(false);
    const [result, setResult] = useState<ExtractionResult | null>(null);
    const [extractError, setExtractError] = useState<string | null>(null);

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoadingProviders(true);
            try {
                const resp = await fetch(`${apiBase}/api/providers`);
                const data: unknown = await resp.json();
                if (
                    typeof data === "object" &&
                    data !== null &&
                    "success" in data &&
                    (data as ProvidersResponse).success
                ) {
                    const d = data as ProvidersResponse;
                    if (d.data?.providers && mounted) {
                        setProviders(d.data.providers);
                    }
                }
            } catch {
                // ignore
            } finally {
                if (mounted) setLoadingProviders(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [apiBase]);

    useEffect(() => {
        if (!selected) return;
        let mounted = true;
        (async () => {
            setLoadingOptions(true);
            setOptions(null);
            try {
                const resp = await fetch(`${apiBase}/api/providers/${selected}/options`);
                const data: unknown = await resp.json();
                if (
                    typeof data === "object" &&
                    data !== null &&
                    "success" in data &&
                    (data as OptionsResponse).success &&
                    (data as OptionsResponse).options
                ) {
                    const d = data as OptionsResponse;
                    const opts = d.options!;
                    if (!mounted) return;
                    setOptions(opts);

                    // initialize form state from defaults
                    const init: Record<string, string | number | boolean> = {};
                    Object.entries(opts).forEach(([key, val]) => {
                        const spec = val as OptionSpec;
                        if (spec.type === "boolean") init[key] = !!spec.default;
                        else if (spec.type === "select") init[key] = spec.default ?? (spec.choices?.[0] ?? "test");
                        else if (spec.type === "number") init[key] = (typeof spec.default === "number" ? spec.default : 0);
                        else init[key] = spec.default ?? "";
                    });
                    setFormState(init);
                }
            } catch {
                // ignore
            } finally {
                if (mounted) setLoadingOptions(false);
            }
        })();
        return () => {
            mounted = false;
        };
    }, [selected, apiBase]);

    return (
        <div className="min-h-screen bg-muted py-12">
            <div className="container mx-auto px-6">
                <PageHeader
                    title="Extraction"
                    subtitle="Choose a provider and configure inputs to start an extraction."
                    actions={<ReportsHeader />}
                />

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
                                setFormState={setFormState}
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
                                            const data: unknown = await resp.json();
                                            // new API returns { success: true, report_id: "..." }
                                            if (typeof data === "object" && data !== null && "success" in data && data.success && "report_id" in data) {
                                                const id = data.report_id as string;
                                                // navigate to reports page (client-side)
                                                router.push(`/reports/${id}`);
                                                return;
                                            } else {
                                                setExtractError("Extraction failed: unexpected response");
                                            }
                                        } catch (err: unknown) {
                                            const message = err instanceof Error ? err.message : String(err);
                                            setExtractError(message || "Network error");
                                        } finally {
                                            setExtracting(false);
                                        }
                                    }}
                            />
                        ) : (
                            <div className="text-sm text-muted-foreground">Select a provider to load inputs.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
