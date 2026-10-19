import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Shield,
  GraduationCap,
  Briefcase,
  Mail,
  Phone,
  Building,
  Key,
  Database,
  CheckCircle2,
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { role, currentPerson, currentStaff, currentAdmin } = useAuth();

  const activeUser =
    role === 'PERSON'
      ? {
          name: currentPerson.name,
          id: currentPerson.person_id,
          subId: currentPerson.institutional_id,
          email: currentPerson.email,
          phone: currentPerson.phone,
          department: currentPerson.department,
          designation: `${currentPerson.role} (${currentPerson.department})`,
          table: 'PERSON',
        }
      : role === 'STAFF'
      ? {
          name: currentStaff.name,
          id: currentStaff.staff_id,
          subId: 'Staff Payroll ID: 8849',
          email: currentStaff.email,
          phone: currentStaff.phone,
          department: currentStaff.department,
          designation: currentStaff.designation,
          table: 'STAFF',
        }
      : {
          name: currentAdmin.name,
          id: currentAdmin.admin_id,
          subId: 'Admin Auth Credential',
          email: currentAdmin.email,
          phone: currentAdmin.phone,
          department: 'Dean of Student Affairs Office',
          designation: currentAdmin.designation,
          table: 'ADMIN',
        };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-2xs">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          Identity & Role Configuration
        </span>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5">
          User Institutional Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Authenticated institutional account details, role permissions, and user profile information.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
            {activeUser.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{activeUser.name}</h2>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                {role}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono">
              User Reference: <strong className="text-slate-800">{activeUser.table} ({activeUser.id})</strong>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 uppercase tracking-wider font-semibold block">
              Institutional ID / Credential
            </span>
            <p className="text-sm font-mono font-bold text-slate-800">{activeUser.subId}</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 uppercase tracking-wider font-semibold block">
              Department / Office
            </span>
            <p className="text-sm font-bold text-slate-800">{activeUser.department}</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 uppercase tracking-wider font-semibold block">
              Email Address
            </span>
            <p className="text-sm font-semibold text-slate-800">{activeUser.email}</p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 uppercase tracking-wider font-semibold block">
              Contact Phone
            </span>
            <p className="text-sm font-semibold text-slate-800">{activeUser.phone}</p>
          </div>
        </div>

        {/* Role Permissions Card */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
            Active Role Capabilities ({role})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {role === 'PERSON' && (
              <>
                <div className="flex items-center gap-2 p-2 rounded bg-emerald-50 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Report new campus accessibility problems</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-emerald-50 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Track real-time status of reported tickets</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-emerald-50 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>View campus locations & feature operational status</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-emerald-50 text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Inspect public issue history audit logs</span>
                </div>
              </>
            )}

            {role === 'STAFF' && (
              <>
                <div className="flex items-center gap-2 p-2 rounded bg-blue-50 text-blue-800">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>View dispatches assigned to your technician ID</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-blue-50 text-blue-800">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Update ticket status (ASSIGNED ➔ IN PROGRESS ➔ RESOLVED)</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-blue-50 text-blue-800">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Log repair notes and estimated repair timeline</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-blue-50 text-blue-800">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Inspect complete issue history and reporter contacts</span>
                </div>
              </>
            )}

            {role === 'ADMIN' && (
              <>
                <div className="flex items-center gap-2 p-2 rounded bg-purple-50 text-purple-800">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Manage complete campus issue registry</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-purple-50 text-purple-800">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Assign & re-dispatch tickets to maintenance staff</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-purple-50 text-purple-800">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Physically verify and certify completed resolutions</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded bg-purple-50 text-purple-800">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Export compliance CSVs & view campus analytics reports</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
