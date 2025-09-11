"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { ReportResponse, Report } from "@/components/extraction/types";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReportsList() {
  const [reports, setReports] = useState<Report[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const resp = await fetch(`${apiBase}/api/reports`);
        const data: unknown = await resp.json();
        if (typeof data === "object" && data !== null && "success" in data && (data as ReportResponse).success) {
          const d = data as ReportResponse;
          if (mounted) setReports(d.data?.reports ?? []);
        } else {
          setError("Failed to load reports");
        }
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        setError(msg || "Network error");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, [apiBase]);

  if (loading) return <div className="p-6 bg-card rounded">Loading reports…</div>;
  if (error) return <div className="p-6 bg-destructive/5 text-destructive rounded">{error}</div>;
  if (!reports || reports.length === 0) return <div className="p-6 bg-muted rounded">No reports found.</div>;

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Report ID</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="break-all">{r.id}</TableCell>
                <TableCell>
                  {r.created_at ? (
                    <div>
                      <div>{format(new Date(r.created_at), "PPpp")}</div>
                      <div className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}</div>
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>
                  <Link href={`/reports/${r.id}`}>
                    <Button variant="ghost" size="sm">View</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
