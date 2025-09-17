"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
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
import { Textarea } from "../ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type OptionDescriptor = {
  type: string;
  description?: string;
  choices?: string[];
  content?: Record<string, Record<string, OptionDescriptor>>;
};

export default function OptionsForm({
  options,
  formState,
  setFormState,
  onStart,
  extracting,
}: {
  options: Record<string, OptionDescriptor>;
  formState: Record<string, string | number | boolean | File | null>;
  setFormState: Dispatch<
    SetStateAction<Record<string, string | number | boolean | File | null>>
  >;
  onStart: () => Promise<void> | void;
  extracting: boolean;
}) {
  function renderField(key: string, desc: OptionDescriptor) {
    // TAB type support
    if (desc.type === "tab" && desc.choices && desc.content) {
      // Track selected tab in local state
      const selectedTab = (formState[key] as string) || desc.choices[0];

      // Handler for tab change
      const handleTabChange = (tab: string) => {
        setFormState({ ...formState, [key]: tab });
      };

      return (
        <div>
          <label className="block text-sm font-medium mb-2">{key}</label>
          <Tabs value={selectedTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full">
              {desc.choices.map((choice) => (
                <TabsTrigger key={choice} value={choice}>
                  {choice}
                </TabsTrigger>
              ))}
            </TabsList>
            {desc.choices.map((choice) => (
              <TabsContent key={choice} value={choice} className="pt-2">
                {/* Render nested fields for this tab */}
                {desc.content && desc.content[choice] &&
                  Object.entries(desc.content[choice]).map(([nestedKey, nestedDesc]) => (
                    <div key={nestedKey}>
                      {renderField(nestedKey, nestedDesc)}
                    </div>
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      );
    }
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

  if (desc.type === "long_string") {
      return (
        <div>
          <label className="block text-sm font-medium mb-2">{key}</label>
          <Textarea
            value={String(formState[key] ?? "")}
            onChange={(e) =>
              setFormState({ ...formState, [key]: e.target.value })
            }
          />
        </div>
      );
    }

  if (desc.type === "file") {
      return (
        <div>
          <label className="block text-sm font-medium mb-2">{key}</label>
          <div className="flex items-center gap-3">
            <Input
              type="file"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormState({
                  ...formState,
                  [key]:
                    e.target.files && e.target.files.length > 0
                      ? e.target.files[0]
                      : null,
                })
              }
            />
          </div>
        </div>
      );
    }

    // Default: string/number
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
      {(Object.entries(options) as [string, OptionDescriptor][]).map(
        ([key, desc]) => (
          <div key={key}>{renderField(key, desc)}</div>
        )
      )}

      <div className="mt-4 flex items-center gap-3">
        <Button disabled={extracting} onClick={onStart}>
          {extracting ? "Extracting…" : "Start Extraction"}
        </Button>
      </div>
    </div>
  );
}
