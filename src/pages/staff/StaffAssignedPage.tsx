import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { UpdateStatusModal } from '../../components/modals/UpdateStatusModal';
import { IssueEntity } from '../../types';
import {
  Search,
  Filter,
  Building,
  Edit3,
  Eye,
  Calendar,
  ClipboardList,
  CheckCircle2,
} from 'lucide-react';

interface StaffAssignedPageProps {
  onNavigate: (page: string, issueId?: string) => void;
}

export const StaffAssignedPage: React.FC<StaffAssignedPageProps> = ({ onNavigate }) => {
  const { currentStaff } = useAuth();
  const { issues, getLocationById } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [selectedIssueForUpdate, setSelectedIssueForUpdate] = useState<IssueEntity | null>(null);

  const staffIssues = useMemo(() => {
    return issues
      .filter((i) => i.assigned_staff_id === currentStaff.staff_id)
      .filter((i) => {
        if (statusFilter !== 'ALL' && i.status !== statusFilter) return false;
        if (priorityFilter !== 'ALL' && i.priority !== priorityFilter) return false;
        if (searchTerm.trim()) {
          const t = searchTerm.toLowerCase();
          return (
            i.issue_id.toLowerCase().includes(t) ||
            i.title.toLowerCase().includes(t) ||
            i.description.toLowerCase().includes(t) ||
            i.category.toLowerCase().includes(t)
          );
        }
        return true;
      });
  }, [issues, currentStaff.staff_id, statusFilter, priorityFilter, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Task Dispatches
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
          Assigned Issues Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review, prioritize, and log on-site repairs for all accessibility infrastructure tickets assigned to {currentStaff.name}.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search assigned tickets..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN PROGRESS">IN PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table / Cards */}
      {staffIssues.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/90 p-12 text-center shadow-2xs">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No matching tickets found</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search criteria or status filter.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Issue ID</th>
                  <th className="py-3 px-4">Issue Title</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Reported Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {staffIssues.map((issue) => {
                  const loc = getLocationById(issue.location_id);
                  return (
                    <tr key={issue.issue_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">
                        {issue.issue_id}
                      </td>
                      <td className="py-3 px-4 max-w-sm">
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-1.5 py-0.5 rounded mr-1.5">
                          {issue.category}
                        </span>
                        <span className="font-semibold text-slate-900">{issue.title}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{loc ? `${loc.building} • ${loc.floor}` : issue.location_id}</span>
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
                            type="button"
                            onClick={() => setSelectedIssueForUpdate(issue)}
                            className="px-2.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Update</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onNavigate('issue-details', issue.issue_id)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Inspect ticket"
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

          <div className="md:hidden space-y-3">
            {staffIssues.map((issue) => {
              const loc = getLocationById(issue.location_id);
              return (
                <div key={issue.issue_id} className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono font-bold text-blue-700">{issue.issue_id}</span>
                      <h4 className="font-bold text-slate-900 text-sm mt-0.5">{issue.title}</h4>
                    </div>
                    <StatusBadge status={issue.status} size="sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">{issue.category}</span>
                    <PriorityBadge priority={issue.priority} size="sm" />
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-slate-600 space-y-1">
                    <p>{loc ? `${loc.building} • ${loc.floor}` : issue.location_id}</p>
                    <p className="text-slate-400">{issue.date_reported}</p>
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
                      className="py-2 bg-slate-100 text-slate-800 rounded-lg font-semibold text-xs flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modal */}
      <UpdateStatusModal
        issue={selectedIssueForUpdate}
        isOpen={Boolean(selectedIssueForUpdate)}
        onClose={() => setSelectedIssueForUpdate(null)}
      />
    </div>
  );
};
