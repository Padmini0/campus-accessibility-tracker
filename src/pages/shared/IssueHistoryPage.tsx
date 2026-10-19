import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Database,
  Search,
  ArrowRight,
  Calendar,
  Clock,
  User,
  ShieldCheck,
} from 'lucide-react';

interface IssueHistoryPageProps {
  onNavigate: (page: string, issueId?: string) => void;
}

export const IssueHistoryPage: React.FC<IssueHistoryPageProps> = ({ onNavigate }) => {
  const { history } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter((h) => {
    if (searchTerm.trim()) {
      const t = searchTerm.toLowerCase();
      return (
        h.history_id.toLowerCase().includes(t) ||
        h.issue_id.toLowerCase().includes(t) ||
        h.changed_by.toLowerCase().includes(t) ||
        h.remarks.toLowerCase().includes(t) ||
        h.new_status.toLowerCase().includes(t)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Complete Audit Trail
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
          Campus Issue Activity & Audit Log
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Chronological audit trail tracking all lifecycle transitions, staff assignments, repair logs, and administrative certifications.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail by History ID, Issue ID (e.g. ISS-1024), actor, or remarks..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Audit Records ({filteredHistory.length})
          </h2>
          <span className="text-xs font-mono text-slate-400">Chronological Order</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">History ID</th>
                <th className="py-3 px-4">Issue ID</th>
                <th className="py-3 px-4">State Transition</th>
                <th className="py-3 px-4">Changed By</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Remarks / Explanation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {filteredHistory.map((h) => (
                <tr key={h.history_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">
                    {h.history_id}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => onNavigate('issue-details', h.issue_id)}
                      className="font-mono font-bold text-blue-700 hover:underline"
                    >
                      {h.issue_id}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="inline-flex items-center gap-1.5 font-medium">
                      <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                        {h.old_status}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="font-bold text-slate-900 bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded text-[11px]">
                        {h.new_status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {h.changed_by}
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {h.change_date}
                  </td>
                  <td className="py-3 px-4 text-slate-600 italic">
                    "{h.remarks}"
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Transparency Callout */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
        <p className="font-bold text-slate-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Audit Log Accountability & Traceability:
        </p>
        <p className="text-[11px] text-slate-600">
          Every status transition, technician dispatch, and resolution observation is permanently recorded with timestamps to maintain accountability and support continuous accessibility improvements across JKLU.
        </p>
      </div>
    </div>
  );
};
