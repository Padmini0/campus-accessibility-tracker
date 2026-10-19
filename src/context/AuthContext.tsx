import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, PersonEntity, StaffEntity, AdminEntity } from '../types';
import { INITIAL_PEOPLE, INITIAL_STAFF, INITIAL_ADMIN } from '../data/mockData';

interface AuthContextType {
  role: UserRole | null;
  currentUser: PersonEntity | StaffEntity | AdminEntity | null;
  currentPerson: PersonEntity;
  currentStaff: StaffEntity;
  currentAdmin: AdminEntity;
  isAuthenticated: boolean;
  login: (role: UserRole, email?: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'campus_access_auth_state';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentPerson = INITIAL_PEOPLE[0]; // Nandini Mittal
  const currentStaff = INITIAL_STAFF[0];   // Rajesh Kumar
  const currentAdmin = INITIAL_ADMIN;     // Dr. Suresh Rao

  const [role, setRole] = useState<UserRole | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.role) return parsed.role;
      }
    } catch {
      // ignore
    }
    // Default to PERSON for realistic initial student dashboard experience
    return 'PERSON';
  });

  const currentUser = role === 'ADMIN' ? currentAdmin : role === 'STAFF' ? currentStaff : role === 'PERSON' ? currentPerson : null;
  const isAuthenticated = role !== null;

  useEffect(() => {
    if (role) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ role }));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [role]);

  const login = (newRole: UserRole, _email?: string) => {
    setRole(newRole);
  };

  const logout = () => {
    setRole(null);
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
  };

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
