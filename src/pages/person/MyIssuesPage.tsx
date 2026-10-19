import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge, PriorityBadge } from '../../components/common/Badge';
import { IssueStatus, IssuePriority, IssueCategory } from '../../types';
import {
  Search,
  Filter,
  ArrowUpDown,
  PlusCircle,
  FileQuestion,
  Building,
  User,
  Eye,
  Calendar,
} from 'lucide-react';

interface MyIssuesPageProps {
  onNavigate: (page: string, issueId?: string) => void;
}

export const MyIssuesPage: React.FC<MyIssuesPageProps> = ({ onNavigate }) => {
  const { currentPerson } = useAuth();
  const { issues, getLocationById, getStaffById } = useData();

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'priority-high'>('date-desc');

  // Filter issues reported by current student
  const filteredIssues = useMemo(() => {
    return issues
      .filter((issue) => issue.reporter_id === currentPerson.person_id)
      .filter((issue) => {
        if (statusFilter !== 'ALL' && issue.status !== statusFilter) return false;
        if (priorityFilter !== 'ALL' && issue.priority !== priorityFilter) return false;
        if (categoryFilter !== 'ALL' && issue.category !== categoryFilter) return false;
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchId = issue.issue_id.toLowerCase().includes(term);
          const matchTitle = issue.title.toLowerCase().includes(term);
          const matchDesc = issue.description.toLowerCase().includes(term);
          const matchCategory = issue.category.toLowerCase().includes(term);
          return matchId || matchTitle || matchDesc || matchCategory;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority-high') {
          const pOrder: { [key: string]: number } = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
          return (pOrder[b.priority] || 0) - (pOrder[a.priority] || 0);
        }
        // Date sorting (simulate latest)
        if (sortBy === 'date-asc') {
          return a.issue_id.localeCompare(b.issue_id);
        }
        return b.issue_id.localeCompare(a.issue_id);
      });
  }, [issues, currentPerson.person_id, statusFilter, priorityFilter, categoryFilter, searchTerm, sortBy]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
        <div>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            Issue Records
          </span>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
            My Reported Issues
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track real-time maintenance status, technician notes, and administrative verification.
          </p>
        </div>

        <button
          onClick={() => onNavigate('report-issue')}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs shadow-xs transition-colors shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Report New Issue</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="search-my-issues"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, title, keyword..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              id="filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
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
              id="filter-priority"
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

          {/* Category Filter */}
          <div>
            <select
              id="filter-category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
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
        </div>

        {/* Sort & Count Row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
          <span>Showing <strong className="text-slate-800">{filteredIssues.length}</strong> record(s)</span>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-700 font-medium"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="priority-high">Highest Priority</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table for Desktop & Cards for Mobile */}
      {filteredIssues.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/90 p-12 text-center shadow-2xs">
          <FileQuestion className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No accessibility issues found.</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, or clear your filters to display all reported items.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('ALL');
                setPriorityFilter('ALL');
                setCategoryFilter('ALL');
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={() => onNavigate('report-issue')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              + Report An Issue
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Issue ID</th>
                  <th className="py-3 px-4">Category & Title</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Assigned Staff</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date Reported</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {filteredIssues.map((issue) => {
                  const location = getLocationById(issue.location_id);
                  const staff = getStaffById(issue.assigned_staff_id);

                  return (
                    <tr key={issue.issue_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">
                        {issue.issue_id}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-100 text-slate-600 mr-1.5">
                          {issue.category}
                        </span>
                        <p className="font-semibold text-slate-900 truncate mt-0.5">{issue.title}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[160px]">
                            {location ? `${location.building}, ${location.floor}` : issue.location_id}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <PriorityBadge priority={issue.priority} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        {staff ? (
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <div>
                              <p className="font-medium text-slate-900">{staff.name}</p>
                              <p className="text-[10px] text-slate-400">{staff.department}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={issue.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                        {issue.date_reported}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onNavigate('issue-details', issue.issue_id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredIssues.map((issue) => {
              const location = getLocationById(issue.location_id);
              const staff = getStaffById(issue.assigned_staff_id);

              return (
                <div
                  key={issue.issue_id}
                  className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {issue.issue_id}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm mt-1.5">{issue.title}</h4>
                    </div>
                    <StatusBadge status={issue.status} size="sm" />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                      {issue.category}
                    </span>
                    <PriorityBadge priority={issue.priority} size="sm" />
                  </div>

                  <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{location ? `${location.building} • ${location.floor}` : issue.location_id}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{staff ? `Assigned: ${staff.name} (${staff.department})` : 'Awaiting Assignment'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{issue.date_reported}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onNavigate('issue-details', issue.issue_id)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Issue Details</span>
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
