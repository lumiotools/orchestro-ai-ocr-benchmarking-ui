"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ReportsHeader({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <Link href="/reports">
        <Button variant="ghost" size="sm">
          All Reports
        </Button>
      </Link>
      <Link href="/extraction">
        <Button variant="default" size="sm">
          New Extraction
        </Button>
      </Link>
    </div>
  );
}
