import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { UpdateStatusModal } from '../../components/modals/UpdateStatusModal';
import { AssignStaffModal } from '../../components/modals/AssignStaffModal';
import { IssueEntity } from '../../types';
import {
  Search,
  Filter,
  UserPlus,
  Edit3,
  Eye,
  Building,
  User,
  ArrowUpDown,
  Download,
} from 'lucide-react';

interface AdminAllIssuesPageProps {
  onNavigate: (page: string, issueId?: string) => void;
}

export const AdminAllIssuesPage: React.FC<AdminAllIssuesPageProps> = ({ onNavigate }) => {
  const { issues, staff, getLocationById, getStaffById, getFeatureById } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [staffFilter, setStaffFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'id' | 'date-desc' | 'priority-high'>('date-desc');

  // Modals state
  const [selectedIssueForUpdate, setSelectedIssueForUpdate] = useState<IssueEntity | null>(null);
  const [selectedIssueForAssign, setSelectedIssueForAssign] = useState<IssueEntity | null>(null);

  const filteredIssues = useMemo(() => {
    return issues
      .filter((i) => {
        if (statusFilter !== 'ALL' && i.status !== statusFilter) return false;
        if (priorityFilter !== 'ALL' && i.priority !== priorityFilter) return false;
        if (categoryFilter !== 'ALL' && i.category !== categoryFilter) return false;
        if (staffFilter === 'UNASSIGNED' && i.assigned_staff_id) return false;
        if (staffFilter !== 'ALL' && staffFilter !== 'UNASSIGNED' && i.assigned_staff_id !== staffFilter) return false;

        if (searchTerm.trim()) {
          const t = searchTerm.toLowerCase();
          return (
            i.issue_id.toLowerCase().includes(t) ||
            i.title.toLowerCase().includes(t) ||
            i.description.toLowerCase().includes(t) ||
            i.category.toLowerCase().includes(t) ||
            i.location_id.toLowerCase().includes(t)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority-high') {
          const pOrder: { [key: string]: number } = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
          return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
        }
        if (sortBy === 'id') {
          return a.issue_id.localeCompare(b.issue_id);
        }
        return b.issue_id.localeCompare(a.issue_id);
      });
  }, [issues, statusFilter, priorityFilter, categoryFilter, staffFilter, searchTerm, sortBy]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">
            Campus Master Registry
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            All Campus Accessibility Issues
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Central repository of all reported physical barriers, structural deficiencies, and work orders.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('reports')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Filter and Query Panel */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ID, title, keyword..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 font-medium"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">OPEN</option>
              <option value="ASSIGNED">ASSIGNED</option>
              <option value="IN PROGRESS">IN PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 font-medium"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 font-medium"
            >
              <option value="ALL">All Categories</option>
              <option value="Elevator">Elevator</option>
              <option value="Ramp">Ramp</option>
              <option value="Accessible Washroom">Accessible Washroom</option>
              <option value="Tactile Path">Tactile Path</option>
              <option value="Handrail">Handrail</option>
              <option value="Accessible Parking">Accessible Parking</option>
              <option value="Water Cooler">Water Cooler</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Assigned Staff Filter */}
          <div>
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-900 font-medium"
            >
              <option value="ALL">All Staff Members</option>
              <option value="UNASSIGNED">-- Unassigned Only --</option>
              {staff.map((s) => (
                <option key={s.staff_id} value={s.staff_id}>
                  {s.name} ({s.department})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sub toolbar */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>Found <strong className="text-slate-800">{filteredIssues.length}</strong> registered issue(s)</span>
          <div className="flex items-center gap-2">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-700 font-medium"
            >
              <option value="date-desc">Newest First</option>
              <option value="priority-high">Highest Priority</option>
              <option value="id">Issue ID (Ascending)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Issues Table (Desktop) */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
              <th className="py-3 px-3.5">Issue ID</th>
              <th className="py-3 px-3.5">Category & Title</th>
              <th className="py-3 px-3.5">Location</th>
              <th className="py-3 px-3.5">Feature</th>
              <th className="py-3 px-3.5">Priority</th>
              <th className="py-3 px-3.5">Assigned Staff</th>
              <th className="py-3 px-3.5">Status</th>
              <th className="py-3 px-3.5">Date</th>
              <th className="py-3 px-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {filteredIssues.map((issue) => {
              const location = getLocationById(issue.location_id);
              const feature = getFeatureById(issue.feature_id);
              const assignedStaff = getStaffById(issue.assigned_staff_id);

              return (
                <tr key={issue.issue_id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3.5 font-mono font-bold text-blue-700 whitespace-nowrap">
                    {issue.issue_id}
                  </td>
                  <td className="py-3 px-3.5 max-w-xs">
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-1.5 py-0.5 rounded mr-1.5">
                      {issue.category}
                    </span>
                    <p className="font-semibold text-slate-900 truncate mt-0.5">{issue.title}</p>
                  </td>
                  <td className="py-3 px-3.5">
                    <div className="flex items-center gap-1 text-slate-600">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[130px]">
                        {location ? `${location.building} • ${location.floor}` : issue.location_id}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3.5">
                    {feature ? (
                      <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                        {feature.feature_id}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">None</span>
                    )}
                  </td>
                  <td className="py-3 px-3.5">
                    <PriorityBadge priority={issue.priority} size="sm" />
                  </td>
                  <td className="py-3 px-3.5">
                    {assignedStaff ? (
                      <div>
                        <p className="font-medium text-slate-900">{assignedStaff.name}</p>
                        <p className="text-[10px] text-slate-400">{assignedStaff.department}</p>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedIssueForAssign(issue)}
                        className="text-xs font-bold text-purple-700 hover:underline"
                      >
                        + Assign
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-3.5">
                    <StatusBadge status={issue.status} size="sm" />
                  </td>
                  <td className="py-3 px-3.5 whitespace-nowrap text-slate-500">
                    {issue.date_reported.split(',')[0]}
                  </td>
                  <td className="py-3 px-3.5 text-right">
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => setSelectedIssueForAssign(issue)}
                        className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-slate-100 rounded transition-colors"
                        title="Assign staff"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSelectedIssueForUpdate(issue)}
                        className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-slate-100 rounded transition-colors"
                        title="Update status"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onNavigate('issue-details', issue.issue_id)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                        title="View details"
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

      {/* Mobile Card List */}
      <div className="md:hidden space-y-3">
        {filteredIssues.map((issue) => {
          const location = getLocationById(issue.location_id);
          const assignedStaff = getStaffById(issue.assigned_staff_id);

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
                <p>{location ? `${location.building} • ${location.floor}` : issue.location_id}</p>
                <p>Staff: {assignedStaff ? assignedStaff.name : 'Unassigned'}</p>
              </div>

              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  onClick={() => setSelectedIssueForAssign(issue)}
                  className="py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded font-semibold text-center"
                >
                  Assign
                </button>
                <button
                  onClick={() => setSelectedIssueForUpdate(issue)}
                  className="py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded font-semibold text-center"
                >
                  Status
                </button>
                <button
                  onClick={() => onNavigate('issue-details', issue.issue_id)}
                  className="py-1.5 bg-slate-100 text-slate-800 hover:bg-slate-200 rounded font-semibold text-center"
                >
                  View
                </button>
              </div>
            </div>
          );
        })}
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
    </div>
  );
};
