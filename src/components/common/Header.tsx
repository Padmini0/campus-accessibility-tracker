import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { JKLULogo } from './JKLULogo';
import {
  Bell,
  Menu,
  User,
  Shield,
  Briefcase,
  GraduationCap,
  ChevronDown,
  LogOut,
} from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, onNavigate }) => {
  const { role, currentUser, logout } = useAuth();
  const { issues, verifications } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Compute pending items for badge
  const pendingVerifications = verifications.filter((v) => v.verification_status === 'PENDING').length;
  const criticalCount = issues.filter((i) => i.priority === 'CRITICAL' && i.status !== 'RESOLVED').length;


  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Left: Brand & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-sidebar-toggle"
            type="button"
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <JKLULogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm sm:text-base leading-tight tracking-tight">
                  JKLU Accessibility
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                  Campus Portal
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-none mt-0.5">
                Issue Reporting & Management System
              </p>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Role Indicator Badge */}
          <div className="flex items-center">
            {role === 'ADMIN' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-purple-200 bg-purple-50 text-xs font-bold text-purple-700">
                <Shield className="w-3.5 h-3.5" />
                <span>Admin</span>
              </span>
            )}
            {role === 'STAFF' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-blue-200 bg-blue-50 text-xs font-bold text-blue-700">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Staff</span>
              </span>
            )}
            {role === 'PERSON' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-200 bg-emerald-50 text-xs font-bold text-emerald-700">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student</span>
              </span>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              id="notifications-button"
              type="button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {(criticalCount > 0 || pendingVerifications > 0) && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50 text-xs animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2 font-semibold text-slate-900">
                  <span>System Alerts</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono">
                    Activity Alerts
                  </span>
                </div>
                <div className="space-y-2">
                  {criticalCount > 0 && (
                    <div className="p-2 bg-red-50 text-red-900 rounded-lg border border-red-200">
                      <p className="font-bold">{criticalCount} Critical Priority Issue(s)</p>
                      <p className="text-[11px] text-red-700 mt-0.5">Requires immediate attention (4h SLA).</p>
                    </div>
                  )}
                  {pendingVerifications > 0 && role === 'ADMIN' && (
                    <div className="p-2 bg-amber-50 text-amber-900 rounded-lg border border-amber-200">
                      <p className="font-bold">{pendingVerifications} Pending Resolution Verifications</p>
                      <p className="text-[11px] text-amber-700 mt-0.5">Staff has marked issues resolved.</p>
                    </div>
                  )}
                  <div className="p-2 bg-slate-50 text-slate-700 rounded-lg border border-slate-200">
                    <p className="font-medium">JKLU System Active</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{issues.length} active issue records tracked.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile avatar dropdown */}
          <div className="relative">
            <button
              id="user-profile-button"
              type="button"
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-blue-700 text-white font-semibold flex items-center justify-center text-xs shadow-2xs">
                {currentUser?.name.charAt(0) || 'U'}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-semibold text-slate-900 leading-tight truncate max-w-[120px]">
                  {currentUser?.name || 'User'}
                </p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider leading-none">
                  {role}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 text-xs animate-fadeIn">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-slate-900">{currentUser?.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                </div>
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-50 text-slate-700"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Profile Information</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowProfileMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-red-50 text-red-600 border-t border-slate-100"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
