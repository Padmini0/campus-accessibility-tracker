import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, PersonEntity, StaffEntity, AdminEntity } from '../types';
import { INITIAL_PEOPLE, INITIAL_STAFF, INITIAL_ADMIN } from '../data/mockData';

interface UserSessionData {
  role: UserRole;
  email: string;
  name: string;
  department?: string;
  institutionalId?: string;
}

interface AuthContextType {
  role: UserRole | null;
  currentUser: PersonEntity | StaffEntity | AdminEntity | null;
  currentPerson: PersonEntity;
  currentStaff: StaffEntity;
  currentAdmin: AdminEntity;
  isAuthenticated: boolean;
  login: (
    role: UserRole,
    email?: string,
    name?: string,
    department?: string,
    institutionalId?: string
  ) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'campus_access_auth_session_clean_v1';

// Clear old automatic dummy login storage
try {
  localStorage.removeItem('campus_access_auth_state');
} catch {
  // ignore
}

const formatNameFromEmail = (email?: string): string => {
  if (!email) return 'Campus Member';
  const local = email.split('@')[0];
  return local
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<UserSessionData | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role) return parsed;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const role = session?.role || null;
  const isAuthenticated = session !== null && session.role !== null;

  useEffect(() => {
    if (session) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [session]);

  const login = (
    newRole: UserRole,
    email?: string,
    name?: string,
    department?: string,
    institutionalId?: string
  ) => {
    const userEmail = email && email.trim() ? email.trim() : `${newRole.toLowerCase()}@jklu.edu.in`;
    const userName = name && name.trim() ? name.trim() : formatNameFromEmail(userEmail);
    const userDept =
      department && department.trim()
        ? department.trim()
        : newRole === 'PERSON'
        ? 'Computer Science & Engineering'
        : newRole === 'STAFF'
        ? 'Maintenance'
        : 'Dean of Student Affairs Office';

    const userInstId =
      institutionalId && institutionalId.trim()
        ? institutionalId.trim()
        : newRole === 'PERSON'
        ? '2024CSB1042'
        : newRole === 'STAFF'
        ? 'STF-001'
        : 'ADM-001';

    setSession({
      role: newRole,
      email: userEmail,
      name: userName,
      department: userDept,
      institutionalId: userInstId,
    });
  };

  const logout = () => {
    setSession(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (!session) return;
    setSession({
      ...session,
      role: newRole,
    });
  };

  // Derive contextual entity objects
  const currentPerson: PersonEntity = {
    person_id: session?.institutionalId ? `PER-${session.institutionalId.slice(-3)}` : 'PER-001',
    name: session?.role === 'PERSON' && session.name ? session.name : 'Nandini Mittal',
    institutional_id: session?.institutionalId || '2024CSB1042',
    email: session?.email || 'student@jklu.edu.in',
    phone: '+91 98765 43210',
    role: 'Student',
    department: session?.department || 'Computer Science & Engineering',
  };

  const currentStaff: StaffEntity = {
    staff_id: session?.institutionalId && session.role === 'STAFF' ? session.institutionalId : 'STF-001',
    name: session?.role === 'STAFF' && session.name ? session.name : 'Rajesh Kumar',
    designation: 'Maintenance Officer',
    department: (session?.department as any) || 'Maintenance',
    email: session?.email || 'staff@jklu.edu.in',
    phone: '+91 98111 22334',
  };

  const currentAdmin: AdminEntity = {
    admin_id: session?.institutionalId && session.role === 'ADMIN' ? session.institutionalId : 'ADM-001',
    name: session?.role === 'ADMIN' && session.name ? session.name : 'Dr. Suresh Rao',
    designation: 'Dean of Infrastructure & Campus Inclusivity',
    email: session?.email || 'admin@jklu.edu.in',
    phone: '+91 98222 33445',
  };

  const currentUser =
    role === 'ADMIN' ? currentAdmin : role === 'STAFF' ? currentStaff : role === 'PERSON' ? currentPerson : null;

  return (
    <AuthContext.Provider
      value={{
        role,
        currentUser,
        currentPerson,
        currentStaff,
        currentAdmin,
        isAuthenticated,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
