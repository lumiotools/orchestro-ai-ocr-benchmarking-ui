"use client";

import React from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

type Provider = { name: string; label: string };

export default function ProviderSelect({
  providers,
  loading,
  value,
  onChange,
}: {
  providers: Provider[];
  loading: boolean;
  value?: string;
  onChange: (v?: string) => void;
}) {
  return (
    <div>
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading providers…</div>
      ) : (
        <div className="space-y-3">
          <Select value={value ?? ""} onValueChange={(v) => onChange(v || undefined)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a provider" />
            </SelectTrigger>

            <SelectContent>
              {providers.map((p) => (
                <SelectItem key={p.label} value={p.label}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
