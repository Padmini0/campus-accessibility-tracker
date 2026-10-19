import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { IssueEntity, VerificationResult } from '../../types';
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck, Calendar, User } from 'lucide-react';

interface VerifyIssueModalProps {
  issue: IssueEntity | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VerifyIssueModal: React.FC<VerifyIssueModalProps> = ({ issue, isOpen, onClose }) => {
  const { verifyIssue, getLocationById, getStaffById, getVerificationForIssue } = useData();
  const { currentAdmin } = useAuth();

  const [decision, setDecision] = useState<VerificationResult>('SUCCESSFULLY RESOLVED');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  const existingVer = issue ? getVerificationForIssue(issue.issue_id) : undefined;

  React.useEffect(() => {
    if (issue) {
      if (existingVer) {
        setDecision(existingVer.verification_status !== 'PENDING' ? existingVer.verification_status : 'SUCCESSFULLY RESOLVED');
        setRemarks(existingVer.remarks || '');
      } else {
        setDecision('SUCCESSFULLY RESOLVED');
        setRemarks('On-site verification passed. Physical inspection confirms barrier has been removed according to specifications.');
      }
      setError('');
    }
  }, [issue, existingVer]);

  if (!issue) return null;

  const location = getLocationById(issue.location_id);
  const staff = getStaffById(issue.assigned_staff_id);
  const todayDateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim() || remarks.trim().length < 5) {
      setError('Please provide administrative verification observations (at least 5 characters).');
      return;
    }

    verifyIssue(issue.issue_id, currentAdmin.admin_id, decision, remarks.trim());
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Verify Resolution: ${issue.issue_id}`}
      subtitle="Administrative quality assurance check to certify physical accessibility compliance."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-800">
        {/* Issue summary */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm space-y-2.5">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                {issue.issue_id}
              </span>
              <h4 className="font-bold text-slate-900 mt-1">{issue.title}</h4>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-300">
              RESOLVED
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 block">Location:</span>
              <span className="font-medium text-slate-800">
                {location ? `${location.building}, ${location.floor}` : issue.location_id}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Assigned Staff:</span>
              <span className="font-medium text-slate-800">
                {staff ? `${staff.name} (${staff.department})` : 'Unassigned'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block">Date Resolved:</span>
              <span className="font-medium text-slate-800">{issue.resolved_date || 'Recently'}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Category:</span>
              <span className="font-medium text-slate-800">{issue.category}</span>
            </div>
          </div>

          {issue.resolution_remarks && (
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs">
              <span className="text-slate-500 font-semibold block mb-0.5">Staff Resolution Remarks:</span>
              <p className="text-slate-700 italic">"{issue.resolution_remarks}"</p>
            </div>
          )}
        </div>

        {/* Verification Decision Options */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Verification Assessment Choice <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setDecision('SUCCESSFULLY RESOLVED')}
              className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                decision === 'SUCCESSFULLY RESOLVED'
                  ? 'border-emerald-600 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5 font-bold text-sm">
                <CheckCircle2 className={`w-4 h-4 ${decision === 'SUCCESSFULLY RESOLVED' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>✓ Successfully Resolved</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Fix is durable, tested, and fully compliant with campus accessibility norms.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDecision('PARTIALLY RESOLVED')}
              className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                decision === 'PARTIALLY RESOLVED'
                  ? 'border-amber-600 bg-amber-50/70 text-amber-900 ring-2 ring-amber-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5 font-bold text-sm">
                <AlertTriangle className={`w-4 h-4 ${decision === 'PARTIALLY RESOLVED' ? 'text-amber-600' : 'text-slate-400'}`} />
                <span>◐ Partially Resolved</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Functional work-around in place; pending secondary cosmetic or final parts.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setDecision('NOT FIXED')}
              className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between ${
                decision === 'NOT FIXED'
                  ? 'border-red-600 bg-red-50/70 text-red-900 ring-2 ring-red-500/20 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5 font-bold text-sm">
                <XCircle className={`w-4 h-4 ${decision === 'NOT FIXED' ? 'text-red-600' : 'text-slate-400'}`} />
                <span>✕ Not Fixed</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">
                Barrier persists. Reopens issue back to IN PROGRESS with staff alert.
              </p>
            </button>
          </div>
        </div>

        {/* Admin and Date details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-slate-400 block">Verifying Administrator:</span>
              <span className="font-semibold text-slate-800">{currentAdmin.name} ({currentAdmin.admin_id})</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <span className="text-slate-400 block">Verification Date:</span>
              <span className="font-semibold text-slate-800">{todayDateStr}</span>
            </div>
          </div>
        </div>

        {/* Verification Remarks */}
        <div>
          <label htmlFor="ver-remarks" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Verification Remarks / Official Audit Notes <span className="text-red-500">*</span>
          </label>
          <textarea
            id="ver-remarks"
            rows={3}
            value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value);
              if (error) setError('');
            }}
            placeholder="Document on-site verification findings, inspection measurements, student feedback..."
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
          {error && <p className="text-xs text-red-600 mt-1 font-medium">{error}</p>}
        </div>

        <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            id="submit-verification-btn"
            type="submit"
            className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            Submit Verification
          </button>
        </div>
      </form>
    </Modal>
  );
};
