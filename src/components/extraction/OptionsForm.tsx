"use client";

import React, { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type OptionDescriptor = {
  type: string;
  description?: string;
  choices?: string[];
};

export default function OptionsForm({
  options,
  formState,
  setFormState,
  onStart,
  extracting,
}: {
  options: Record<string, OptionDescriptor>;
  formState: Record<string, string | number | boolean>;
  setFormState: Dispatch<SetStateAction<Record<string, string | number | boolean>>>;
  onStart: () => Promise<void> | void;
  extracting: boolean;
}) {
  function renderField(key: string, desc: OptionDescriptor) {
    if (desc.type === "boolean") {
      return (
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="font-medium">{key}</div>
            <div className="text-sm text-muted-foreground">
              {desc.description ?? ""}
            </div>
          </div>
          <Switch
            checked={!!formState[key]}
            onCheckedChange={(v) => setFormState({ ...formState, [key]: v })}
          />
        </div>
      );
    }

    if (desc.type === "select") {
      return (
        <div>
          <label className="block text-sm font-medium mb-2">{key}</label>
          <Select
            value={String(formState[key] ?? "")}
            onValueChange={(v) => setFormState({ ...formState, [key]: v })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>

            <SelectContent>
              {desc.choices?.map((c: string) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    return (
      <div>
        <label className="block text-sm font-medium mb-2">{key}</label>
        <Input
          value={String(formState[key] ?? "")}
          onChange={(e) =>
            setFormState({ ...formState, [key]: e.target.value })
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {(
        Object.entries(options) as [string, OptionDescriptor][]
      ).map(([key, desc]) => (
        <div key={key}>{renderField(key, desc)}</div>
      ))}

      <div className="mt-4 flex items-center gap-3">
        <Button disabled={extracting} onClick={onStart}>
          {extracting ? "Extracting…" : "Start Extraction"}
        </Button>
      </div>
    </div>
  );
}
