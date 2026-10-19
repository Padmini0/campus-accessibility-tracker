import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { JKLULogo } from '../components/common/JKLULogo';
import {
  Lock,
  Mail,
  GraduationCap,
  Briefcase,
  Shield,
  ArrowRight,
  Building2,
  CheckCircle2,
} from 'lucide-react';

interface LoginPageProps {
  onSuccess: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('student@jklu.edu.in');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('PERSON');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      login(selectedRole, email);
      setIsSubmitting(false);
      onSuccess();
    }, 250);
  };

  const handleDemoLogin = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'PERSON') setEmail('student@jklu.edu.in');
    if (role === 'STAFF') setEmail('staff@jklu.edu.in');
    if (role === 'ADMIN') setEmail('admin@jklu.edu.in');

    setIsSubmitting(true);
    setTimeout(() => {
      login(role);
      setIsSubmitting(false);
      onSuccess();
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* Left Side: JKLU Accessibility System Info */}
        <div className="md:col-span-6 bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle decorative background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute -right-12 -top-12 w-64 h-64 border-8 border-white rounded-full" />
            <div className="absolute -left-12 -bottom-12 w-72 h-72 border-8 border-white rounded-full" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3.5 mb-6">
              <JKLULogo size="lg" />
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-blue-400 uppercase">
                  JKLU Institutional Portal
                </span>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Campus Accessibility
                </h1>
              </div>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-white mb-3">
              Accessibility Issue Tracker
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Report, track, and resolve accessibility issues across the JK Lakshmipat University campus. Ensuring a barrier-free physical infrastructure for all students, staff, and visitors.
            </p>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Full Issue Lifecycle:</strong> From student barrier report to maintenance dispatch and administrative resolution verification.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Traceable Audit History:</strong> Complete transparency with logged status transitions and repair remarks.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>29 Campus Locations:</strong> Complete coverage across academic blocks, LRC, hostels, grounds, and parking zones.
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span>JK Lakshmipat University</span>
            </div>
            <span className="font-mono text-slate-500">@jklu.edu.in</span>
          </div>
        </div>

        {/* Right Side: Login Form & Presentation Fast-Logins */}
        <div className="md:col-span-6 p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">Sign in to Portal</h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your institutional @jklu.edu.in credentials or choose a quick role below.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selector Tabs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Select User Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('PERSON');
                      setEmail('student@jklu.edu.in');
                    }}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      selectedRole === 'PERSON'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('STAFF');
                      setEmail('staff@jklu.edu.in');
                    }}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      selectedRole === 'STAFF'
                        ? 'bg-blue-50 border-blue-500 text-blue-800 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Staff</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('ADMIN');
                      setEmail('admin@jklu.edu.in');
                    }}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border flex flex-col items-center gap-1 transition-all ${
                      selectedRole === 'ADMIN'
                        ? 'bg-purple-50 border-purple-500 text-purple-800 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Institutional Email (@jklu.edu.in)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="login-email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="yourname@jklu.edu.in"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <button
                id="login-submit-button"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Demo Logins */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">
                Instant Quick Logins
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  id="demo-login-student"
                  type="button"
                  onClick={() => handleDemoLogin('PERSON')}
                  className="px-2.5 py-2 text-xs font-medium bg-slate-50 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 text-slate-700 border border-slate-200 rounded-lg transition-colors text-left"
                >
                  <span className="block font-bold text-emerald-700">Student</span>
                  <span className="text-[10px] text-slate-500 truncate block">Nandini Mittal</span>
                </button>

                <button
                  id="demo-login-staff"
                  type="button"
                  onClick={() => handleDemoLogin('STAFF')}
                  className="px-2.5 py-2 text-xs font-medium bg-slate-50 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 text-slate-700 border border-slate-200 rounded-lg transition-colors text-left"
                >
                  <span className="block font-bold text-blue-700">Staff</span>
                  <span className="text-[10px] text-slate-500 truncate block">Rajesh Kumar</span>
                </button>

                <button
                  id="demo-login-admin"
                  type="button"
                  onClick={() => handleDemoLogin('ADMIN')}
                  className="px-2.5 py-2 text-xs font-medium bg-slate-50 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-300 text-slate-700 border border-slate-200 rounded-lg transition-colors text-left"
                >
                  <span className="block font-bold text-purple-700">Admin</span>
                  <span className="text-[10px] text-slate-500 truncate block">Dr. Suresh Rao</span>
                </button>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 text-center mt-6">
            JK Lakshmipat University • Campus Accessibility Infrastructure System
          </p>
        </div>
      </div>
    </div>
  );
};
