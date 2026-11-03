import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { IssueEntity } from '../../types';
import { PriorityBadge } from '../common/Badge';
import { UserCheck, MapPin, Building } from 'lucide-react';

interface AssignStaffModalProps {
  issue: IssueEntity | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AssignStaffModal: React.FC<AssignStaffModalProps> = ({ issue, isOpen, onClose }) => {
  const { staff, assignStaff, getLocationById, getStaffById } = useData();
  const { currentAdmin } = useAuth();

  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [remarks, setRemarks] = useState('');

  React.useEffect(() => {
    if (issue) {
      setSelectedStaffId(issue.assigned_staff_id || staff[0]?.staff_id || '');
      setRemarks('');
    }
  }, [issue, staff]);

  if (!issue) return null;

  const location = getLocationById(issue.location_id);
  const currentAssigned = getStaffById(issue.assigned_staff_id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStaffId) return;

    assignStaff(
      issue.issue_id,
      selectedStaffId,
      currentAdmin.name,
      remarks.trim() || undefined
    );
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Staff: ${issue.issue_id}`}
      subtitle="Admin action to delegate responsibility and trigger staff notification."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-slate-800">
        <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-sm space-y-2">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block mb-0.5">Issue Description</span>
            <p className="font-semibold text-slate-900">{issue.title}</p>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <span>{location ? `${location.building} • ${location.floor}` : issue.location_id}</span>
            </div>
            <PriorityBadge priority={issue.priority} size="sm" />
          </div>
          {currentAssigned && (
            <div className="text-xs text-slate-600 pt-1 border-t border-slate-200/60">
              <span className="text-slate-500">Currently Assigned: </span>
              <span className="font-medium text-slate-800">{currentAssigned.name} ({currentAssigned.department})</span>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="staff-dropdown" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Assign Responsible Staff <span className="text-red-500">*</span>
          </label>
          <select
            id="staff-dropdown"
            value={selectedStaffId}
            onChange={(e) => setSelectedStaffId(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
            required
          >
            {staff.map((s) => (
              <option key={s.staff_id} value={s.staff_id}>
                {s.name} — {s.department} ({s.designation})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="assign-remarks" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Assignment Remarks / Instructions (Optional)
          </label>
          <textarea
            id="assign-remarks"
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. Priority dispatch. Please inspect before afternoon classes."
            className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-xs text-blue-800">
          <p className="font-semibold flex items-center gap-1.5 mb-0.5">
            <UserCheck className="w-4 h-4 text-blue-600" />
            Relational Foreign Key Binding:
          </p>
          <p className="font-mono text-[11px] text-blue-900">
            UPDATE ISSUE SET assigned_staff_id = '{selectedStaffId}', status = 'ASSIGNED' WHERE issue_id = '{issue.issue_id}';
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
            id="submit-staff-assignment"
            type="submit"
            className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors"
          >
            Assign Staff
          </button>
        </div>
      </form>
    </Modal>
  );
};
