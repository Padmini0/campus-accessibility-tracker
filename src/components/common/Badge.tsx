import React from 'react';
import { IssueStatus, IssuePriority, FeatureStatus, VerificationResult } from '../../types';
import { AlertCircle, AlertTriangle, Clock, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

export const StatusBadge: React.FC<{ status: IssueStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  switch (status) {
    case 'OPEN':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 tracking-wide uppercase ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          OPEN
        </span>
      );
    case 'ASSIGNED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 tracking-wide uppercase ${sizeClasses}`}
        >
          <Clock className="w-3 h-3" />
          ASSIGNED
        </span>
      );
    case 'IN PROGRESS':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300 tracking-wide uppercase ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
          IN PROGRESS
        </span>
      );
    case 'RESOLVED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 tracking-wide uppercase ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          RESOLVED
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center rounded-full bg-gray-100 text-gray-700 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
};

export const PriorityBadge: React.FC<{ priority: IssuePriority; size?: 'sm' | 'md' }> = ({
  priority,
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  switch (priority) {
    case 'CRITICAL':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-md bg-red-100 text-red-800 border border-red-300 font-bold uppercase tracking-wider ${sizeClasses}`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-red-600" />
          CRITICAL
        </span>
      );
    case 'HIGH':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-md bg-orange-100 text-orange-800 border border-orange-300 font-semibold uppercase tracking-wider ${sizeClasses}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
          HIGH
        </span>
      );
    case 'MEDIUM':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-md bg-yellow-100 text-yellow-800 border border-yellow-300 font-medium uppercase tracking-wider ${sizeClasses}`}
        >
          MEDIUM
        </span>
      );
    case 'LOW':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-md bg-slate-100 text-slate-700 border border-slate-300 font-medium uppercase tracking-wider ${sizeClasses}`}
        >
          LOW
        </span>
      );
    default:
      return <span className={sizeClasses}>{priority}</span>;
  }
};

export const FeatureStatusBadge: React.FC<{ status: FeatureStatus }> = ({ status }) => {
  switch (status) {
    case 'Available':
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Available
        </span>
      );
    case 'Needs Maintenance':
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Needs Maintenance
        </span>
      );
    case 'Unavailable':
      return (
        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium bg-red-50 text-red-700 border border-red-200">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Unavailable
        </span>
      );
    default:
      return <span>{status}</span>;
  }
};

export const VerificationBadge: React.FC<{ status: VerificationResult }> = ({ status }) => {
  switch (status) {
    case 'SUCCESSFULLY RESOLVED':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          VERIFIED RESOLVED
        </span>
      );
    case 'PARTIALLY RESOLVED':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          PARTIALLY RESOLVED
        </span>
      );
    case 'NOT FIXED':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-red-100 text-red-800 border border-red-300">
          <XCircle className="w-3.5 h-3.5 text-red-600" />
          NOT FIXED (REOPENED)
        </span>
      );
    case 'PENDING':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300">
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          PENDING VERIFICATION
        </span>
      );
  }
};
