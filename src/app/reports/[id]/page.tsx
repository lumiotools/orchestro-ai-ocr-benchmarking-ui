import React from "react";
import ReportView from "@/components/reports/ReportView";
import ReportsHeader from "@/components/nav/ReportsHeader";
import PageHeader from "@/components/common/PageHeader";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-6">
        <PageHeader
          title="Extraction Report"
          subtitle={`Extraction report details for ${id}`}
          actions={<ReportsHeader />}
        />

        <ReportView id={id} />
      </div>
    </div>
  );
}
