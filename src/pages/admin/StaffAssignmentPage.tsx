import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { AssignStaffModal } from '../../components/modals/AssignStaffModal';
import { IssueEntity, StaffEntity } from '../../types';
import {
  UserPlus,
  Users,
  AlertCircle,
  Building,
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface StaffAssignmentPageProps {
  onNavigate: (page: string, issueId?: string) => void;
}

export const StaffAssignmentPage: React.FC<StaffAssignmentPageProps> = ({ onNavigate }) => {
  const { issues, staff, getLocationById, getStaffById } = useData();
  const [selectedIssueForAssign, setSelectedIssueForAssign] = useState<IssueEntity | null>(null);

  // Issues needing assignment
  const unassignedIssues = issues.filter((i) => !i.assigned_staff_id || i.status === 'OPEN');

  // Compute workload per staff member
  const staffWithWorkload = staff.map((s) => {
    const activeTasks = issues.filter(
      (i) => i.assigned_staff_id === s.staff_id && i.status !== 'RESOLVED'
    );
    const resolvedTasks = issues.filter(
      (i) => i.assigned_staff_id === s.staff_id && i.status === 'RESOLVED'
    );
    return {
      ...s,
      activeCount: activeTasks.length,
      resolvedCount: resolvedTasks.length,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
        <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
          Resource Allocation & Dispatch
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
          Staff Workload & Issue Assignment
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Distribute accessibility remediation tickets among campus maintenance engineers based on department expertise.
        </p>
      </div>

      {/* Staff Capacity & Workload Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {staffWithWorkload.map((member) => (
          <div
            key={member.staff_id}
            className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-slate-400">{member.staff_id}</span>
                <h3 className="font-bold text-slate-900 text-sm mt-0.5">{member.name}</h3>
                <p className="text-xs text-blue-700 font-semibold">{member.department} Division</p>
                <p className="text-[11px] text-slate-500">{member.designation}</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-extrabold text-slate-900 block">{member.activeCount}</span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Tasks</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                {member.phone}
              </span>
              <span className="text-emerald-700 font-semibold">{member.resolvedCount} Resolved</span>
            </div>
          </div>
        ))}
      </div>

      {/* Unassigned Issues Queue */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Unassigned Issues Requiring Dispatch ({unassignedIssues.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              These issues are currently unassigned or awaiting technician dispatch.
            </p>
          </div>
        </div>

        {unassignedIssues.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <p className="font-bold text-slate-800">All open tickets have been assigned!</p>
            <p className="text-xs text-slate-500 mt-1">
              There are no pending tickets awaiting staff dispatch.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {unassignedIssues.map((issue) => {
              const location = getLocationById(issue.location_id);
              return (
                <div
                  key={issue.issue_id}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {issue.issue_id}
                      </span>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {issue.category}
                      </span>
                      <PriorityBadge priority={issue.priority} size="sm" />
                      <StatusBadge status={issue.status} size="sm" />
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {issue.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {location ? `${location.building} • ${location.floor} (${location.area})` : issue.location_id}
                      </span>
                      <span>•</span>
                      <span>Reported: {issue.date_reported}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id={`assign-btn-${issue.issue_id}`}
                      type="button"
                      onClick={() => setSelectedIssueForAssign(issue)}
                      className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 shrink-0"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Assign Staff</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('issue-details', issue.issue_id)}
                      className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors shrink-0"
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Staff Dispatch Protocol Callout */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
        <p className="font-bold text-slate-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-purple-700" />
          Dispatch & Turnaround Protocol:
        </p>
        <p className="text-[11px] text-slate-600">
          Assigning a technician automatically updates the issue status to ASSIGNED, alerts the maintenance team, and begins the resolution SLA clock for the assigned department.
        </p>
      </div>

      {/* Modal */}
      <AssignStaffModal
        issue={selectedIssueForAssign}
        isOpen={Boolean(selectedIssueForAssign)}
        onClose={() => setSelectedIssueForAssign(null)}
      />
    </div>
  );
};
