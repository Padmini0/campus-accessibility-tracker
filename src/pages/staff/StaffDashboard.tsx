import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { UpdateStatusModal } from '../../components/modals/UpdateStatusModal';
import { IssueEntity } from '../../types';
import {
  ClipboardList,
  AlertCircle,
  Clock,
  CheckCircle2,
  Building,
  Edit3,
  Eye,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

interface StaffDashboardProps {
  onNavigate: (page: string, issueId?: string) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ onNavigate }) => {
  const { currentStaff } = useAuth();
  const { issues, getLocationById } = useData();

  const [selectedIssueForUpdate, setSelectedIssueForUpdate] = useState<IssueEntity | null>(null);

  // Issues assigned to current staff
  const staffIssues = issues.filter((i) => i.assigned_staff_id === currentStaff.staff_id);

  const assignedCount = staffIssues.filter((i) => i.status !== 'RESOLVED').length;
  const criticalCount = staffIssues.filter((i) => i.priority === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const inProgressCount = staffIssues.filter((i) => i.status === 'IN PROGRESS').length;
  const resolvedCount = staffIssues.filter((i) => i.status === 'RESOLVED').length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Maintenance Engineering Operations
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Welcome, {currentStaff.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {currentStaff.designation} • <span className="font-semibold text-slate-700">{currentStaff.department} Department</span> ({currentStaff.staff_id})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('assigned-issues')}
            className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <ClipboardList className="w-4 h-4" />
            <span>All Assigned Work ({staffIssues.length})</span>
          </button>
        </div>
      </div>

      {/* Staff Dashboard Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Assigned to Me */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Assigned to Me
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">{assignedCount}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Active work orders</span>
        </div>

        {/* Critical */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Critical
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-red-700 mt-3">{criticalCount}</p>
          <span className="text-[11px] text-red-600 mt-1 block">4-Hour SLA Target</span>
        </div>

        {/* In Progress */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              In Progress
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-700 mt-3">{inProgressCount}</p>
          <span className="text-[11px] text-amber-600 mt-1 block">Under physical repair</span>
        </div>

        {/* Resolved */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Resolved
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-700 mt-3">{resolvedCount}</p>
          <span className="text-[11px] text-emerald-600 mt-1 block">Passed to Admin QA</span>
        </div>
      </div>

      {/* Main Section: Assigned Issues Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Assigned Work Queue
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select an issue to inspect details or log status updates and repair remarks.
            </p>
          </div>
          <button
            onClick={() => onNavigate('assigned-issues')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View Full Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {staffIssues.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <p className="font-bold text-slate-800">You're all caught up!</p>
            <p className="text-xs text-slate-500 mt-1">
              No outstanding maintenance tickets are currently dispatched to your ID.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                    <th className="py-3 px-4">Issue ID</th>
                    <th className="py-3 px-4">Issue Title & Category</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Reported Date</th>
                    <th className="py-3 px-4">Current Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {staffIssues.map((issue) => {
                    const location = getLocationById(issue.location_id);
                    return (
                      <tr key={issue.issue_id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">
                          {issue.issue_id}
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-600 mr-1.5">
                            {issue.category}
                          </span>
                          <p className="font-semibold text-slate-900 truncate mt-0.5">{issue.title}</p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate max-w-[170px]">
                              {location ? `${location.building} • ${location.floor}` : issue.location_id}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <PriorityBadge priority={issue.priority} size="sm" />
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                          {issue.date_reported}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={issue.status} size="sm" />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              id={`update-status-btn-${issue.issue_id}`}
                              type="button"
                              onClick={() => setSelectedIssueForUpdate(issue)}
                              className="px-2.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Update Status</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => onNavigate('issue-details', issue.issue_id)}
                              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-3">
              {staffIssues.map((issue) => {
                const location = getLocationById(issue.location_id);
                return (
                  <div
                    key={issue.issue_id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono font-bold text-blue-700">{issue.issue_id}</span>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">{issue.title}</h4>
                      </div>
                      <StatusBadge status={issue.status} size="sm" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {issue.category}
                      </span>
                      <PriorityBadge priority={issue.priority} size="sm" />
                    </div>

                    <div className="text-slate-600 space-y-1 pt-2 border-t border-slate-200">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <span>{location ? `${location.building} • ${location.floor}` : issue.location_id}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{issue.date_reported}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedIssueForUpdate(issue)}
                        className="py-2 bg-blue-600 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Update Status</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate('issue-details', issue.issue_id)}
                        className="py-2 bg-slate-200 text-slate-800 rounded-lg font-semibold text-xs flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Maintenance Progress Callout */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
        <p className="font-bold text-slate-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          Maintenance Dispatch Responsibility:
        </p>
        <p className="text-[11px] text-slate-600">
          Work orders dispatched to technician ID {currentStaff.staff_id} ({currentStaff.name}) should be updated as work progresses (ASSIGNED ➔ IN PROGRESS ➔ RESOLVED) with detailed repair remarks for administrative certification.
        </p>
      </div>

      {/* Modal */}
      <UpdateStatusModal
        issue={selectedIssueForUpdate}
        isOpen={Boolean(selectedIssueForUpdate)}
        onClose={() => setSelectedIssueForUpdate(null)}
      />
    </div>
  );
};
