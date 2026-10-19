import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Download,
  FileText,
  Building,
  CheckCircle2,
  Clock,
  AlertCircle,
  Database,
  BarChart2,
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { issues, locations, staff, verifications } = useData();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const total = issues.length;
  const resolved = issues.filter((i) => i.status === 'RESOLVED').length;
  const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 0;

  // Group by building
  const issuesByBuilding: { [key: string]: number } = {};
  locations.forEach((loc) => {
    issuesByBuilding[loc.building] = 0;
  });
  issues.forEach((i) => {
    const loc = locations.find((l) => l.location_id === i.location_id);
    if (loc) {
      issuesByBuilding[loc.building] = (issuesByBuilding[loc.building] || 0) + 1;
    }
  });

  // Group by Category
  const categorySummary = issues.reduce((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  // Group by Priority
  const prioritySummary = {
    CRITICAL: issues.filter((i) => i.priority === 'CRITICAL').length,
    HIGH: issues.filter((i) => i.priority === 'HIGH').length,
    MEDIUM: issues.filter((i) => i.priority === 'MEDIUM').length,
    LOW: issues.filter((i) => i.priority === 'LOW').length,
  };

  // CSV Exporter
  const handleExportCSV = () => {
    const headers = [
      'Issue ID',
      'Title',
      'Category',
      'Priority',
      'Status',
      'Location ID',
      'Reporter ID',
      'Assigned Staff ID',
      'Date Reported',
      'Resolved Date',
    ];

    const rows = issues.map((i) => [
      i.issue_id,
      `"${i.title.replace(/"/g, '""')}"`,
      `"${i.category}"`,
      i.priority,
      i.status,
      i.location_id,
      i.reporter_id,
      i.assigned_staff_id || 'UNASSIGNED',
      `"${i.date_reported}"`,
      i.resolved_date ? `"${i.resolved_date}"` : '',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `campus_accessibility_issues_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
            JKLU Compliance & Analytics
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Accessibility Compliance Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Aggregated institutional statistics, resolution turnaround rates, and exportable datasets for university review.
          </p>
        </div>

        <button
          id="btn-export-csv"
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-lg shadow-sm transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export Issues Dataset (CSV)</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Success:</strong> CSV dataset exported successfully with {issues.length} records.
          </span>
        </div>
      )}

      {/* High-level KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Issues Reported
          </span>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{total}</p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Campuswide tally</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Resolution Efficiency
          </span>
          <p className="text-3xl font-extrabold text-emerald-700 mt-2">{resolutionRate}%</p>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">{resolved} of {total} tickets closed</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Verified by Admin
          </span>
          <p className="text-3xl font-extrabold text-purple-700 mt-2">
            {verifications.filter((v) => v.verification_status === 'SUCCESSFULLY RESOLVED').length}
          </p>
          <span className="text-[11px] text-purple-600 mt-0.5 block">Signed off with QA inspection</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Active Technicians
          </span>
          <p className="text-3xl font-extrabold text-blue-700 mt-2">{staff.length}</p>
          <span className="text-[11px] text-blue-600 mt-0.5 block">Across Civil & Electrical</span>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Building Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            Barrier Density by Campus Building
          </h3>

          <div className="space-y-2 pt-2 text-xs">
            {Object.entries(issuesByBuilding).map(([buildingName, count]) => {
              const pct = total > 0 ? Math.round((count / total) * 100) : 0;
              return (
                <div key={buildingName} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-700">{buildingName}</span>
                    <span className="text-slate-900 font-bold">{count} tickets ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-blue-600" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority / Severity */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            Priority Breakdown & Service Level Agreement
          </h3>

          <div className="space-y-2.5 pt-2 text-xs">
            <div className="flex justify-between items-center p-2 rounded-lg bg-red-50/70 border border-red-200">
              <span className="font-bold text-red-950">CRITICAL (4h SLA)</span>
              <span className="font-extrabold text-red-700 text-sm">{prioritySummary.CRITICAL}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-orange-50/70 border border-orange-200">
              <span className="font-bold text-orange-950">HIGH (24h SLA)</span>
              <span className="font-extrabold text-orange-700 text-sm">{prioritySummary.HIGH}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-amber-50/70 border border-amber-200">
              <span className="font-bold text-amber-950">MEDIUM (72h SLA)</span>
              <span className="font-extrabold text-amber-700 text-sm">{prioritySummary.MEDIUM}</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50/70 border border-blue-200">
              <span className="font-bold text-blue-950">LOW (120h SLA)</span>
              <span className="font-extrabold text-blue-700 text-sm">{prioritySummary.LOW}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Campus Quality Standards and Resolution Protocol */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2 text-blue-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              JKLU Campus Accessibility Standards & Verification Protocol
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">ISO 21542 Standards</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Reports generated reflect all tracked incidents across the 29 campus locations. Closed tickets undergo physical verification before sign-off to ensure full compliance with accessibility regulations and barrier-free transit standards.
        </p>
      </div>
    </div>
  );
};
