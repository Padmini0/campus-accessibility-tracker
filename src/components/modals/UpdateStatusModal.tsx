import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { IssueEntity, IssueStatus } from '../../types';
import { StatusBadge } from '../common/Badge';
import { ArrowRight, AlertCircle } from 'lucide-react';

interface UpdateStatusModalProps {
  issue: IssueEntity | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ issue, isOpen, onClose }) => {
  const { updateIssueStatus } = useData();
  const { currentUser, role } = useAuth();

  const [newStatus, setNewStatus] = useState<IssueStatus>(issue?.status || 'IN PROGRESS');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  // Sync initial status when issue opens
  React.useEffect(() => {
    if (issue) {
      if (issue.status === 'ASSIGNED') {
        setNewStatus('IN PROGRESS');
      } else if (issue.status === 'IN PROGRESS') {
        setNewStatus('RESOLVED');
      } else {
        setNewStatus(issue.status);
      }
      setRemarks('');
      setError('');
    }
  }, [issue]);

  if (!issue) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim() || remarks.trim().length < 5) {
      setError('Please provide detailed remarks (at least 5 characters) for the audit log.');
      return;
    }

    const changedByName = currentUser
      ? `${currentUser.name} (${role === 'STAFF' ? 'Staff' : role === 'ADMIN' ? 'Admin' : 'Student'})`
      : 'Maintenance Staff';

    updateIssueStatus(issue.issue_id, newStatus, changedByName, remarks.trim());
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Status: ${issue.issue_id}`}
      subtitle="This operation appends an immutable transaction record to the ISSUE_HISTORY table."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-800">
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-sm space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-slate-500 font-medium">Issue Title:</span>
            <span className="font-semibold text-slate-900 text-right max-w-[240px] truncate">{issue.title}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Current Status:</span>
            <StatusBadge status={issue.status} size="sm" />
          </div>
          <div className="flex items-center justify-center gap-2 pt-1 text-slate-500 text-xs font-mono">
            <span>{issue.status}</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-bold text-blue-700">{newStatus}</span>
          </div>
        </div>

        <div>
          <label htmlFor="new-status-select" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Target Status <span className="text-red-500">*</span>
          </label>
          <select
            id="new-status-select"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as IssueStatus)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          >
            <option value="ASSIGNED">ASSIGNED (Staff assigned / reviewing ticket)</option>
            <option value="IN PROGRESS">IN PROGRESS (Work actively underway on-site)</option>
            <option value="RESOLVED">RESOLVED (Fix completed, ready for admin verification)</option>
          </select>
        </div>

        <div>
          <label htmlFor="status-remarks" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Action Remarks / Log <span className="text-red-500">*</span>
          </label>
          <textarea
            id="status-remarks"
            rows={3}
            value={remarks}
            onChange={(e) => {
              setRemarks(e.target.value);
              if (error) setError('');
            }}
            placeholder="e.g. Replaced faulty hydraulic relay switch. Elevator tested with 8 stops and restored to service."
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
          {error && (
            <p className="flex items-center gap-1 text-xs text-red-600 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </p>
          )}
          <p className="text-[11px] text-slate-500 mt-1">
            Recorded in institutional issue resolution history log.
          </p>
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            id="submit-status-update"
            type="submit"
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors"
          >
            Update Issue
          </button>
        </div>
      </form>
    </Modal>
  );
};
