import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge, PriorityBadge, VerificationBadge } from '../../components/common/Badge';
import { VerifyIssueModal } from '../../components/modals/VerifyIssueModal';
import { IssueEntity } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Building,
  User,
  Eye,
  Calendar,
  Clock,
  Database,
} from 'lucide-react';

interface VerificationPageProps {
  onNavigate: (page: string, issueId?: string) => void;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({ onNavigate }) => {
  const { currentAdmin } = useAuth();
  const { issues, verifications, getLocationById, getStaffById, getVerificationForIssue } = useData();

  const [selectedIssueForVerify, setSelectedIssueForVerify] = useState<IssueEntity | null>(null);

  // Issues that have been resolved or have verification records
  const resolvedIssues = issues.filter((i) => i.status === 'RESOLVED' || i.verification_id);

  const pendingVerification = resolvedIssues.filter((i) => {
    const v = getVerificationForIssue(i.issue_id);
    return !v || v.verification_status === 'PENDING';
  });

  const completedVerification = resolvedIssues.filter((i) => {
    const v = getVerificationForIssue(i.issue_id);
    return v && v.verification_status !== 'PENDING';
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
        <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
          Quality Control & Sign-Off
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
          Resolution Verification
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Perform administrative verification and physically certify that reported barriers have been completely resolved according to accessibility standards.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Resolved Tickets
          </span>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{resolvedIssues.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Reported fixed by technicians</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Pending Physical QA
          </span>
          <p className="text-3xl font-extrabold text-amber-700 mt-2">{pendingVerification.length}</p>
          <span className="text-[11px] text-amber-600 mt-0.5 block">Requires Admin on-site inspection</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Certified & Closed
          </span>
          <p className="text-3xl font-extrabold text-emerald-700 mt-2">{completedVerification.length}</p>
          <span className="text-[11px] text-emerald-600 mt-0.5 block">Signed off in VERIFICATION table</span>
        </div>
      </div>

      {/* Resolved Issues Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Resolved Issues Queue
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review on-site work and attach an official inspection verdict.
            </p>
          </div>
        </div>

        {resolvedIssues.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-800">No resolved issues awaiting verification.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Issue ID</th>
                  <th className="py-3 px-4">Title & Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Completed By</th>
                  <th className="py-3 px-4">Resolution Date</th>
                  <th className="py-3 px-4">Verification Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {resolvedIssues.map((issue) => {
                  const location = getLocationById(issue.location_id);
                  const staffMember = getStaffById(issue.assigned_staff_id);
                  const verification = getVerificationForIssue(issue.issue_id);

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
                        {staffMember ? (
                          <div>
                            <p className="font-medium text-slate-900">{staffMember.name}</p>
                            <p className="text-[10px] text-slate-400">{staffMember.department}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unknown</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                        {issue.resolved_date || 'Recently Fixed'}
                      </td>
                      <td className="py-3 px-4">
                        <VerificationBadge status={verification?.verification_status || 'PENDING'} />
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            id={`verify-btn-${issue.issue_id}`}
                            type="button"
                            onClick={() => setSelectedIssueForVerify(issue)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-lg font-semibold text-xs transition-colors flex items-center gap-1 shadow-2xs"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{verification ? 'Re-Verify' : 'Verify'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onNavigate('issue-details', issue.issue_id)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Inspect details"
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
        )}
      </div>

      {/* Quality Verification Callout */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
        <p className="font-bold text-slate-800 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Physical Verification Sign-Off:
        </p>
        <p className="text-[11px] text-slate-600">
          Administrator inspection certifies that physical barriers have been genuinely cleared, compliant hardware installed, and safety standards satisfied prior to closing the incident.
        </p>
      </div>

      {/* Modal */}
      <VerifyIssueModal
        issue={selectedIssueForVerify}
        isOpen={Boolean(selectedIssueForVerify)}
        onClose={() => setSelectedIssueForVerify(null)}
      />
    </div>
  );
};
