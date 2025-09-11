import React from "react";
import ReportsList from "@/components/reports/ReportsList";
import ReportsHeader from "@/components/nav/ReportsHeader";
import PageHeader from "@/components/common/PageHeader";

export default function ReportsIndexPage() {
  return (
    <div className="min-h-screen bg-muted py-12">
      <div className="container mx-auto px-6">
        <PageHeader
          title="Reports"
          subtitle="All extraction reports"
          actions={<ReportsHeader />}
        />

        <ReportsList />
      </div>
    </div>
  );
}
