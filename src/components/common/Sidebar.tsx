import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { JKLULogo } from './JKLULogo';
import {
  LayoutDashboard,
  PlusCircle,
  ListTodo,
  History,
  User,
  LogOut,
  ClipboardList,
  UserPlus,
  MapPin,
  Sparkles,
  ShieldCheck,
  BarChart3,
  Database,
  X,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
}) => {
  const { role, logout, currentStaff, currentPerson } = useAuth();
  const { issues, verifications } = useData();

  // Counts
  const myIssuesCount = issues.filter((i) => i.reporter_id === currentPerson.person_id).length;
  const staffAssignedCount = issues.filter(
    (i) => i.assigned_staff_id === currentStaff.staff_id && i.status !== 'RESOLVED'
  ).length;
  const pendingVerificationsCount = issues.filter(
    (i) => i.status === 'RESOLVED' && (!i.verification_id || verifications.find((v) => v.issue_id === i.issue_id)?.verification_status === 'PENDING')
  ).length;

  const handleNavClick = (page: string) => {
    onNavigate(page);
    onClose();
  };

  const navItemClass = (page: string) => {
    const isActive = currentPage === page;
    return `w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-700 font-semibold border-l-3 border-blue-600'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
    }`;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed top-0 bottom-0 left-0 z-50 md:z-30 w-64 bg-white border-r border-slate-200/90 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:h-[calc(100vh-4rem)] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header in Drawer */}
        <div className="md:hidden flex items-center justify-between px-4 h-16 border-b border-slate-200">
          <JKLULogo size="xs" showText />
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {/* PERSON / STUDENT NAVIGATION */}
          {role === 'PERSON' && (
            <>
              <div className="px-3 pb-1 pt-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Student Portal
              </div>
              <button
                id="nav-dashboard"
                onClick={() => handleNavClick('dashboard')}
                className={navItemClass('dashboard')}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  <span>Dashboard</span>
                </div>
              </button>

              <button
                id="nav-report-issue"
                onClick={() => handleNavClick('report-issue')}
                className={navItemClass('report-issue')}
              >
                <div className="flex items-center gap-3">
                  <PlusCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-blue-700 font-semibold">+ Report Issue</span>
                </div>
              </button>

              <button
                id="nav-my-issues"
                onClick={() => handleNavClick('my-issues')}
                className={navItemClass('my-issues')}
              >
                <div className="flex items-center gap-3">
                  <ListTodo className="w-4 h-4 text-slate-500" />
                  <span>My Issues</span>
                </div>
                {myIssuesCount > 0 && (
                  <span className="px-1.5 py-0.5 text-xs rounded-full bg-slate-100 text-slate-700 font-semibold">
                    {myIssuesCount}
                  </span>
                )}
              </button>

              <button
                id="nav-issue-history"
                onClick={() => handleNavClick('issue-history')}
                className={navItemClass('issue-history')}
              >
                <div className="flex items-center gap-3">
                  <History className="w-4 h-4 text-slate-500" />
                  <span>Issue History</span>
                </div>
              </button>
            </>
          )}

          {/* STAFF NAVIGATION */}
          {role === 'STAFF' && (
            <>
              <div className="px-3 pb-1 pt-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Maintenance Staff Portal
              </div>
              <button
                id="nav-dashboard"
                onClick={() => handleNavClick('dashboard')}
                className={navItemClass('dashboard')}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  <span>Dashboard</span>
                </div>
              </button>

              <button
                id="nav-assigned-issues"
                onClick={() => handleNavClick('assigned-issues')}
                className={navItemClass('assigned-issues')}
              >
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-4 h-4 text-slate-500" />
                  <span>Assigned Issues</span>
                </div>
                {staffAssignedCount > 0 && (
                  <span className="px-1.5 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 font-semibold">
                    {staffAssignedCount}
                  </span>
                )}
              </button>

              <button
                id="nav-issue-history"
                onClick={() => handleNavClick('issue-history')}
                className={navItemClass('issue-history')}
              >
                <div className="flex items-center gap-3">
                  <History className="w-4 h-4 text-slate-500" />
                  <span>Issue History</span>
                </div>
              </button>
            </>
          )}

          {/* ADMIN NAVIGATION */}
          {role === 'ADMIN' && (
            <>
              <div className="px-3 pb-1 pt-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Administration
              </div>
              <button
                id="nav-dashboard"
                onClick={() => handleNavClick('dashboard')}
                className={navItemClass('dashboard')}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  <span>Dashboard</span>
                </div>
              </button>

              <button
                id="nav-all-issues"
                onClick={() => handleNavClick('all-issues')}
                className={navItemClass('all-issues')}
              >
                <div className="flex items-center gap-3">
                  <ClipboardList className="w-4 h-4 text-slate-500" />
                  <span>All Issues</span>
                </div>
                <span className="px-1.5 py-0.5 text-xs rounded-full bg-slate-100 text-slate-700 font-semibold">
                  {issues.length}
                </span>
              </button>

              <button
                id="nav-staff-assignment"
                onClick={() => handleNavClick('staff-assignment')}
                className={navItemClass('staff-assignment')}
              >
                <div className="flex items-center gap-3">
                  <UserPlus className="w-4 h-4 text-slate-500" />
                  <span>Staff Assignment</span>
                </div>
              </button>

              <button
                id="nav-verification"
                onClick={() => handleNavClick('verification')}
                className={navItemClass('verification')}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verification</span>
                </div>
                {pendingVerificationsCount > 0 && (
                  <span className="px-1.5 py-0.5 text-xs rounded-full bg-amber-100 text-amber-800 font-bold animate-pulse">
                    {pendingVerificationsCount}
                  </span>
                )}
              </button>

              <div className="px-3 pt-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Campus Master Data
              </div>

              <button
                id="nav-locations"
                onClick={() => handleNavClick('locations')}
                className={navItemClass('locations')}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>Locations (29)</span>
                </div>
              </button>

              <button
                id="nav-accessibility-features"
                onClick={() => handleNavClick('accessibility-features')}
                className={navItemClass('accessibility-features')}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-slate-500" />
                  <span>Accessibility Features</span>
                </div>
              </button>

              <button
                id="nav-reports"
                onClick={() => handleNavClick('reports')}
                className={navItemClass('reports')}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4 text-slate-500" />
                  <span>Reports & Stats</span>
                </div>
              </button>

              <button
                id="nav-issue-history"
                onClick={() => handleNavClick('issue-history')}
                className={navItemClass('issue-history')}
              >
                <div className="flex items-center gap-3">
                  <History className="w-4 h-4 text-slate-500" />
                  <span>Audit History</span>
                </div>
              </button>
            </>
          )}

          {/* COMMON BOTTOM NAVIGATION */}
          <div className="pt-4 border-t border-slate-200 mt-4">
            <div className="px-3 pb-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Account
            </div>
            <button
              id="nav-profile"
              onClick={() => handleNavClick('profile')}
              className={navItemClass('profile')}
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-slate-500" />
                <span>Profile</span>
              </div>
            </button>

            <button
              id="nav-logout"
              onClick={logout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Portal status badge at bottom of sidebar */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500">
          <div className="flex items-center gap-2 mb-1.5">
            <JKLULogo size="xs" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-slate-800 font-bold">
                <span className="truncate">JKLU Portal</span>
                <span className="text-emerald-600 font-semibold text-[10px]">Active</span>
              </div>
              <p className="text-[10px] text-slate-400 truncate">Barrier-Free Infrastructure</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
