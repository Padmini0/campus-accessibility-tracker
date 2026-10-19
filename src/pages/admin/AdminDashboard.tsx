import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { UpdateStatusModal } from '../../components/modals/UpdateStatusModal';
import { AssignStaffModal } from '../../components/modals/AssignStaffModal';
import { VerifyIssueModal } from '../../components/modals/VerifyIssueModal';
import { IssueEntity } from '../../types';
import {
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  UserPlus,
  ArrowRight,
  Building,
  User,
  Eye,
  Edit3,
  BarChart2,
  PieChart,
  ShieldAlert,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: string, issueId?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { currentAdmin } = useAuth();
  const { issues, verifications, staff, getLocationById, getStaffById } = useData();

  const [selectedIssueForUpdate, setSelectedIssueForUpdate] = useState<IssueEntity | null>(null);
  const [selectedIssueForAssign, setSelectedIssueForAssign] = useState<IssueEntity | null>(null);
  const [selectedIssueForVerify, setSelectedIssueForVerify] = useState<IssueEntity | null>(null);

  // Statistics
  const totalIssues = issues.length;
  const openCount = issues.filter((i) => i.status === 'OPEN').length;
  const inProgressCount = issues.filter((i) => i.status === 'IN PROGRESS' || i.status === 'ASSIGNED').length;
  const resolvedCount = issues.filter((i) => i.status === 'RESOLVED').length;
  const pendingVerificationCount = issues.filter(
    (i) => i.status === 'RESOLVED' && (!i.verification_id || verifications.find((v) => v.issue_id === i.issue_id)?.verification_status === 'PENDING')
  ).length;

  // Critical unresolved issues
  const criticalUnresolved = issues.filter(
    (i) => (i.priority === 'CRITICAL' || i.priority === 'HIGH') && i.status !== 'RESOLVED'
  );

  // Chart aggregations
  const categoryCounts = issues.reduce((acc, i) => {
    acc[i.category] = (acc[i.category] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const priorityCounts = {
    CRITICAL: issues.filter((i) => i.priority === 'CRITICAL').length,
    HIGH: issues.filter((i) => i.priority === 'HIGH').length,
    MEDIUM: issues.filter((i) => i.priority === 'MEDIUM').length,
    LOW: issues.filter((i) => i.priority === 'LOW').length,
  };

  const statusCounts = {
    OPEN: issues.filter((i) => i.status === 'OPEN').length,
    ASSIGNED: issues.filter((i) => i.status === 'ASSIGNED').length,
    'IN PROGRESS': issues.filter((i) => i.status === 'IN PROGRESS').length,
    RESOLVED: issues.filter((i) => i.status === 'RESOLVED').length,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
            Campus Administration & Quality Assurance
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Administrative Control Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Logged in as <strong>{currentAdmin.name}</strong> ({currentAdmin.admin_id}) • {currentAdmin.designation}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('staff-assignment')}
            className="px-3.5 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>Staff Assignment</span>
          </button>
          <button
            onClick={() => onNavigate('verification')}
            className="px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Resolution QA ({pendingVerificationCount})</span>
          </button>
        </div>
      </div>

      {/* Top 5 Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Total Issues</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{totalIssues}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Across 29 campus locations</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Open</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-2">{openCount}</p>
          <span className="text-[11px] text-blue-600 mt-0.5 block">Needs staff triage</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">In Progress</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-2">{inProgressCount}</p>
          <span className="text-[11px] text-amber-600 mt-0.5 block">Active work orders</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">Resolved</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-2">{resolvedCount}</p>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">Maintenance done</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs col-span-2 sm:col-span-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 block">Pending Verification</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-800 mt-2">{pendingVerificationCount}</p>
          <span className="text-[11px] text-purple-600 mt-0.5 block">Awaiting Admin inspection</span>
        </div>
      </div>

      {/* Critical Issues Highlight Section */}
      {criticalUnresolved.length > 0 && (
        <div className="bg-red-50/70 rounded-xl border border-red-200 p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              <h2 className="text-sm font-bold text-red-950 uppercase tracking-wider">
                Critical Priority Bottlenecks ({criticalUnresolved.length})
              </h2>
            </div>
            <span className="text-xs font-semibold text-red-700 bg-red-100 px-2 py-0.5 rounded">
              Immediate Mobility Hazard
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {criticalUnresolved.slice(0, 4).map((issue) => {
              const location = getLocationById(issue.location_id);
              const staffMember = getStaffById(issue.assigned_staff_id);
              return (
                <div
                  key={issue.issue_id}
                  className="bg-white p-3.5 rounded-lg border border-red-200 shadow-2xs flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-red-700">{issue.issue_id}</span>
                      <PriorityBadge priority={issue.priority} size="sm" />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mt-1">{issue.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {location ? `${location.building} • ${location.floor}` : issue.location_id}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500">
                      {staffMember ? `Staff: ${staffMember.name}` : <strong className="text-red-600">Unassigned!</strong>}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {!staffMember && (
                        <button
                          onClick={() => setSelectedIssueForAssign(issue)}
                          className="px-2 py-1 bg-red-600 text-white rounded text-[11px] font-semibold hover:bg-red-700"
                        >
                          Dispatch Staff
                        </button>
                      )}
                      <button
                        onClick={() => onNavigate('issue-details', issue.issue_id)}
                        className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-[11px] font-semibold hover:bg-slate-200"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* System Analytics: Issue Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chart 1: Status Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-blue-600" />
              Issues by Lifecycle Status
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Status</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {Object.entries(statusCounts).map(([statusKey, count]) => {
              const pct = totalIssues > 0 ? Math.round((count / totalIssues) * 100) : 0;
              const barColor =
                statusKey === 'OPEN'
                  ? 'bg-blue-600'
                  : statusKey === 'ASSIGNED'
                  ? 'bg-indigo-600'
                  : statusKey === 'IN PROGRESS'
                  ? 'bg-amber-500'
                  : 'bg-emerald-600';

              return (
                <div key={statusKey} className="text-xs">
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-700">{statusKey}</span>
                    <span className="text-slate-900">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Priority Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-orange-600" />
              Issues by Priority (SLA)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Urgency</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {Object.entries(priorityCounts).map(([priKey, count]) => {
              const pct = totalIssues > 0 ? Math.round((count / totalIssues) * 100) : 0;
              const barColor =
                priKey === 'CRITICAL'
                  ? 'bg-red-600'
                  : priKey === 'HIGH'
                  ? 'bg-orange-500'
                  : priKey === 'MEDIUM'
                  ? 'bg-amber-500'
                  : 'bg-blue-500';

              return (
                <div key={priKey} className="text-xs">
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-700">{priKey}</span>
                    <span className="text-slate-900">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Category Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600" />
              Top Infrastructure Categories
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Category</span>
          </div>

          <div className="space-y-2 pt-1">
            {(Object.entries(categoryCounts) as [string, number][])
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4)
              .map(([catKey, count]) => {
                const pct = totalIssues > 0 ? Math.round((count / totalIssues) * 100) : 0;
                return (
                  <div key={catKey} className="text-xs">
                    <div className="flex justify-between text-slate-700 font-medium mb-1">
                      <span className="truncate max-w-[170px]">{catKey}</span>
                      <span className="font-bold text-slate-900">{count}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full bg-indigo-600" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Recent Issues Management Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Recent Issue Ingestion Queue
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live campus accessibility tickets across JKLU locations.
            </p>
          </div>
          <button
            onClick={() => onNavigate('all-issues')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All Issues ({issues.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Issue ID</th>
                <th className="py-3 px-4">Category & Title</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Assigned Staff</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {issues.slice(0, 6).map((issue) => {
                const location = getLocationById(issue.location_id);
                const assignedStaff = getStaffById(issue.assigned_staff_id);

                return (
                  <tr key={issue.issue_id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {issue.issue_id}
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-1.5 py-0.5 rounded mr-1.5">
                        {issue.category}
                      </span>
                      <p className="font-semibold text-slate-900 truncate mt-0.5">{issue.title}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[150px]">
                          {location ? `${location.building} • ${location.floor}` : issue.location_id}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <PriorityBadge priority={issue.priority} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      {assignedStaff ? (
                        <div>
                          <p className="font-medium text-slate-900">{assignedStaff.name}</p>
                          <p className="text-[10px] text-slate-400">{assignedStaff.department}</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedIssueForAssign(issue)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 underline"
                        >
                          + Assign Staff
                        </button>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={issue.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                      {issue.date_reported.split(',')[0]}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedIssueForAssign(issue)}
                          className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded transition-colors"
                          title="Assign staff"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedIssueForUpdate(issue)}
                          className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-slate-100 rounded transition-colors"
                          title="Update status"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onNavigate('issue-details', issue.issue_id)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                          title="View complete record"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <UpdateStatusModal
        issue={selectedIssueForUpdate}
        isOpen={Boolean(selectedIssueForUpdate)}
        onClose={() => setSelectedIssueForUpdate(null)}
      />
      <AssignStaffModal
        issue={selectedIssueForAssign}
        isOpen={Boolean(selectedIssueForAssign)}
        onClose={() => setSelectedIssueForAssign(null)}
      />
      <VerifyIssueModal
        issue={selectedIssueForVerify}
        isOpen={Boolean(selectedIssueForVerify)}
        onClose={() => setSelectedIssueForVerify(null)}
      />
    </div>
  );
};
