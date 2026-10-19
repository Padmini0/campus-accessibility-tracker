import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';

interface PersonDashboardProps {
  onNavigate: (page: string, issueId?: string) => void;
}

export const PersonDashboard: React.FC<PersonDashboardProps> = ({ onNavigate }) => {
  const { currentPerson } = useAuth();
  const { issues, getLocationById } = useData();

  // Filter issues reported by current student
  const studentIssues = issues.filter((i) => i.reporter_id === currentPerson.person_id);

  const totalReported = studentIssues.length;
  const openCount = studentIssues.filter((i) => i.status === 'OPEN').length;
  const inProgressCount = studentIssues.filter((i) => i.status === 'IN PROGRESS' || i.status === 'ASSIGNED').length;
  const resolvedCount = studentIssues.filter((i) => i.status === 'RESOLVED').length;

  return (
    <div className="space-y-6">
      {/* Top Welcome Bar & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Student Accessibility Portal
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            Good morning, {currentPerson.name.split(' ')[0]}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Institutional ID: <span className="font-mono text-slate-700 font-semibold">{currentPerson.institutional_id}</span> • {currentPerson.department}
          </p>
        </div>

        <button
          id="btn-report-issue-main"
          type="button"
          onClick={() => onNavigate('report-issue')}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-sm transition-all shrink-0 hover:shadow-md"
        >
          <PlusCircle className="w-5 h-5" />
          <span>+ Report Accessibility Issue</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Issues Reported */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Issues Reported
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">{totalReported}</p>
          <span className="text-[11px] text-slate-500 mt-1 block">Total submitted tickets</span>
        </div>

        {/* Open Issues */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Open Issues
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-blue-700 mt-3">{openCount}</p>
          <span className="text-[11px] text-blue-600 mt-1 block">Pending staff assignment</span>
        </div>

        {/* In Progress */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              In Progress
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-amber-700 mt-3">{inProgressCount}</p>
          <span className="text-[11px] text-amber-600 mt-1 block">Active on-site repair</span>
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
          <span className="text-[11px] text-emerald-600 mt-1 block">Barrier eliminated</span>
        </div>
      </div>

      {/* Recent Reports Section */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">Recent Reports</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live status tracking of your submitted campus accessibility complaints.
            </p>
          </div>
          <button
            onClick={() => onNavigate('my-issues')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All ({studentIssues.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {studentIssues.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-semibold text-slate-800">No accessibility issues reported yet.</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Spot a barrier on campus? Submit a report to alert the administration and maintenance staff.
            </p>
            <button
              onClick={() => onNavigate('report-issue')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
            >
              + Report Accessibility Issue
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {studentIssues.slice(0, 5).map((issue) => {
              const location = getLocationById(issue.location_id);
              return (
                <div
                  key={issue.issue_id}
                  className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {issue.issue_id}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">•</span>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {issue.category}
                      </span>
                      <PriorityBadge priority={issue.priority} size="sm" />
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {issue.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {location ? `${location.building} • ${location.floor}` : issue.location_id}
                      </span>
                      <span>•</span>
                      <span>Reported: {issue.date_reported}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <StatusBadge status={issue.status} />
                    <button
                      id={`view-details-${issue.issue_id}`}
                      type="button"
                      onClick={() => onNavigate('issue-details', issue.issue_id)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* JKLU Campus Accessibility Commitment Banner */}
      <div className="bg-linear-to-r from-blue-50 via-slate-50 to-indigo-50 p-4 rounded-xl border border-blue-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
          <div>
            <p className="font-bold text-slate-900">
              JKLU Barrier-Free Campus Commitment
            </p>
            <p className="text-slate-600 text-[11px]">
              Every submitted report is logged with priority response SLAs, assigned to facilities engineers, and tracked through full verification.
            </p>
          </div>
        </div>
        <button
          onClick={() => onNavigate('issue-history')}
          className="text-xs font-semibold text-blue-700 hover:underline shrink-0"
        >
          View Activity History →
        </button>
      </div>
    </div>
  );
};
