import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge, PriorityBadge, FeatureStatusBadge, VerificationBadge } from '../../components/common/Badge';
import { UpdateStatusModal } from '../../components/modals/UpdateStatusModal';
import { AssignStaffModal } from '../../components/modals/AssignStaffModal';
import { VerifyIssueModal } from '../../components/modals/VerifyIssueModal';
import {
  ArrowLeft,
  Calendar,
  Building,
  MapPin,
  User,
  Phone,
  Mail,
  Shield,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  ShieldCheck,
  UserCheck,
  Edit3,
} from 'lucide-react';

interface IssueDetailsPageProps {
  issueId: string;
  onBack: () => void;
  onNavigate: (page: string, issueId?: string) => void;
}

export const IssueDetailsPage: React.FC<IssueDetailsPageProps> = ({
  issueId,
  onBack,
  onNavigate,
}) => {
  const { role, currentAdmin } = useAuth();
  const {
    getIssueById,
    getLocationById,
    getFeatureById,
    getStaffById,
    getPersonById,
    getHistoryForIssue,
    getVerificationForIssue,
  } = useData();

  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [isAssignStaffOpen, setIsAssignStaffOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);

  const issue = getIssueById(issueId);

  if (!issue) {
    return (
      <div className="bg-white p-12 rounded-xl border border-slate-200 text-center shadow-2xs">
        <p className="text-slate-600 font-semibold mb-3">Issue ticket '{issueId}' not found in database.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
        >
          Return to Previous List
        </button>
      </div>
    );
  }

  const location = getLocationById(issue.location_id);
  const feature = getFeatureById(issue.feature_id);
  const staff = getStaffById(issue.assigned_staff_id);
  const reporter = getPersonById(issue.reporter_id);
  const historyList = getHistoryForIssue(issue.issue_id);
  const verification = getVerificationForIssue(issue.issue_id);

  // Compute lifecycle steps status
  const isReportedDone = true;
  const isAssignedDone = issue.status !== 'OPEN';
  const isInProgressDone = issue.status === 'IN PROGRESS' || issue.status === 'RESOLVED';
  const isResolvedDone = issue.status === 'RESOLVED';

  // Find timestamps from history
  const reportedHistory = historyList.find((h) => h.old_status === 'NEW' || h.new_status === 'OPEN');
  const assignedHistory = historyList.find((h) => h.new_status === 'ASSIGNED');
  const inProgressHistory = historyList.find((h) => h.new_status === 'IN PROGRESS');
  const resolvedHistory = historyList.find((h) => h.new_status === 'RESOLVED');

  return (
    <div className="space-y-6">
      {/* Back button & Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Issues</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Staff or Admin can Update Status */}
          {(role === 'STAFF' || role === 'ADMIN') && (
            <button
              id="btn-open-update-status"
              type="button"
              onClick={() => setIsUpdateStatusOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-2xs transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Update Status</span>
            </button>
          )}

          {/* Admin can Assign Staff */}
          {role === 'ADMIN' && (
            <button
              id="btn-open-assign-staff"
              type="button"
              onClick={() => setIsAssignStaffOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Assign Staff</span>
            </button>
          )}

          {/* Admin can Verify if Resolved */}
          {role === 'ADMIN' && issue.status === 'RESOLVED' && (
            <button
              id="btn-open-verify-modal"
              type="button"
              onClick={() => setIsVerifyModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify Resolution</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Issue Header Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
              {issue.issue_id}
            </span>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
              {issue.category}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <PriorityBadge priority={issue.priority} size="md" />
            <StatusBadge status={issue.status} size="md" />
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-4">
          {issue.title}
        </h1>

        <p className="text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
          {issue.description}
        </p>

        {issue.image_url && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 block mb-2">Supporting Field Photograph:</span>
            <img
              src={issue.image_url}
              alt="Issue evidence"
              className="max-h-72 rounded-lg border border-slate-200 object-cover shadow-2xs"
            />
          </div>
        )}
      </div>

      {/* ISSUE LIFECYCLE PROGRESSION */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Issue Lifecycle State Machine
          </h2>
          <span className="text-xs font-mono text-slate-400">OPEN → ASSIGNED → IN PROGRESS → RESOLVED</span>
        </div>

        {/* Horizontal Process Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {/* Step 1: Reported */}
          <div className="flex sm:flex-col items-center sm:items-start gap-3 p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              ✓
            </div>
            <div>
              <p className="font-bold text-emerald-950">● Reported</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                {reportedHistory?.change_date || issue.date_reported}
              </p>
            </div>
          </div>

          {/* Step 2: Assigned */}
          <div
            className={`flex sm:flex-col items-center sm:items-start gap-3 p-3 rounded-lg text-xs border ${
              isAssignedDone
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                isAssignedDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {isAssignedDone ? '✓' : '2'}
            </div>
            <div>
              <p className={`font-bold ${isAssignedDone ? 'text-emerald-950' : 'text-slate-700'}`}>
                ● Assigned
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {assignedHistory ? assignedHistory.change_date : isAssignedDone ? 'Assigned' : 'Pending Staff Dispatch'}
              </p>
            </div>
          </div>

          {/* Step 3: In Progress */}
          <div
            className={`flex sm:flex-col items-center sm:items-start gap-3 p-3 rounded-lg text-xs border ${
              isInProgressDone
                ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                isInProgressDone ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {isInProgressDone ? (isResolvedDone ? '✓' : '●') : '3'}
            </div>
            <div>
              <p className={`font-bold ${isInProgressDone ? 'text-amber-950' : 'text-slate-700'}`}>
                ● In Progress
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {inProgressHistory ? inProgressHistory.change_date : isInProgressDone ? 'Under Inspection' : 'Awaiting Work Start'}
              </p>
            </div>
          </div>

          {/* Step 4: Resolved */}
          <div
            className={`flex sm:flex-col items-center sm:items-start gap-3 p-3 rounded-lg text-xs border ${
              isResolvedDone
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                isResolvedDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {isResolvedDone ? '✓' : '4'}
            </div>
            <div>
              <p className={`font-bold ${isResolvedDone ? 'text-emerald-950' : 'text-slate-700'}`}>
                {isResolvedDone ? '● Resolved' : '○ Resolved'}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {issue.resolved_date || 'Pending Fix Completion'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Relational Entity Cards Grid: Location, Reporter, Assigned Staff */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Location & Feature Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-blue-600" />
              LOCATION & FEATURE
            </span>
            <span className="text-[10px] font-mono text-slate-400">{issue.location_id}</span>
          </div>

          {location ? (
            <div className="space-y-1.5 text-xs text-slate-700">
              <p className="font-bold text-slate-900 text-sm">{location.building}</p>
              <p className="text-slate-600">{location.floor} • {location.area}</p>
              <p className="text-slate-500 text-[11px] italic">{location.description}</p>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Location details not loaded.</p>
          )}

          {feature && (
            <div className="mt-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-medium text-slate-600">Feature: {feature.feature_type}</span>
                <FeatureStatusBadge status={feature.current_status} />
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">{feature.feature_id}</p>
            </div>
          )}
        </div>

        {/* Reporter Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-600" />
              PERSON (REPORTER)
            </span>
            <span className="text-[10px] font-mono text-slate-400">{issue.reporter_id}</span>
          </div>

          {reporter ? (
            <div className="space-y-1.5 text-xs text-slate-700">
              <p className="font-bold text-slate-900 text-sm">{reporter.name}</p>
              <p className="text-slate-600 font-mono text-[11px]">ID: {reporter.institutional_id}</p>
              <div className="pt-1 space-y-1 text-slate-500 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{reporter.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{reporter.phone}</span>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Reporter: PER-001</p>
          )}
        </div>

        {/* Assigned Staff Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              ASSIGNED STAFF
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {issue.assigned_staff_id || 'UNASSIGNED'}
            </span>
          </div>

          {staff ? (
            <div className="space-y-1.5 text-xs text-slate-700">
              <p className="font-bold text-slate-900 text-sm">{staff.name}</p>
              <p className="text-blue-700 font-semibold">{staff.department} Department</p>
              <p className="text-slate-500 text-[11px]">{staff.designation}</p>
              <div className="pt-1 space-y-1 text-slate-500 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-slate-400" />
                  <span>{staff.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-400" />
                  <span>{staff.phone}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-2 text-center text-xs text-slate-500">
              <p className="italic">No technician assigned yet.</p>
              {role === 'ADMIN' && (
                <button
                  onClick={() => setIsAssignStaffOpen(true)}
                  className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  + Assign Staff Now
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* VERIFICATION SECTION (Direct representation of VERIFICATION Table) */}
      {(issue.status === 'RESOLVED' || verification) && (
        <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Resolution Quality Assurance & Verification
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-500">
              {verification ? `Record: ${verification.verification_id}` : 'Pending Inspection'}
            </span>
          </div>

          {verification ? (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-700">{verification.verification_id}</span>
                  <VerificationBadge status={verification.verification_status} />
                </div>
                <span className="text-slate-500 font-medium">Verified On: {verification.verification_date}</span>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block mb-0.5">Admin Audit Observations:</span>
                <p className="text-slate-800 font-medium">{verification.remarks}</p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>Certified By: <strong>{currentAdmin.name} ({verification.admin_id})</strong></span>
                {verification.completed_date && <span>Completed Date: {verification.completed_date}</span>}
              </div>
            </div>
          ) : (
            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
              <div>
                <p className="font-bold text-amber-950">Resolution Awaiting Admin Physical Certification</p>
                <p className="text-amber-800 text-[11px] mt-0.5">
                  Maintenance staff marked this issue as resolved. An administrator must inspect on-site before closure.
                </p>
              </div>
              {role === 'ADMIN' && (
                <button
                  onClick={() => setIsVerifyModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs shrink-0 transition-colors"
                >
                  Verify Resolution Now
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ISSUE HISTORY AUDIT TABLE (Direct representation of ISSUE_HISTORY Table) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Issue Activity & Audit Log
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Traceable log of all status transitions, timestamps, and authorized actors.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
            {historyList.length} History Record(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">History ID</th>
                <th className="py-3 px-4">State Transition</th>
                <th className="py-3 px-4">Changed By</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {historyList.map((entry) => (
                <tr key={entry.history_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-blue-700">
                    {entry.history_id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="inline-flex items-center gap-1.5 font-medium">
                      <span className="text-slate-500">{entry.old_status}</span>
                      <ArrowRight className="w-3 h-3 text-blue-500" />
                      <span className="font-bold text-slate-900">{entry.new_status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {entry.changed_by}
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {entry.change_date}
                  </td>
                  <td className="py-3 px-4 text-slate-600 italic">
                    "{entry.remarks}"
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <UpdateStatusModal
        issue={issue}
        isOpen={isUpdateStatusOpen}
        onClose={() => setIsUpdateStatusOpen(false)}
      />
      <AssignStaffModal
        issue={issue}
        isOpen={isAssignStaffOpen}
        onClose={() => setIsAssignStaffOpen(false)}
      />
      <VerifyIssueModal
        issue={issue}
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
      />
    </div>
  );
};
