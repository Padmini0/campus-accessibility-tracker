
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import { UserRole, PersonEntity, StaffEntity, AdminEntity } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  role: UserRole | null;
  currentUser: PersonEntity | StaffEntity | AdminEntity | null;
  currentPerson: PersonEntity;
  currentStaff: StaffEntity;
  currentAdmin: AdminEntity;
  isAuthenticated: boolean;
  authLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultPerson: PersonEntity = {
  person_id: 'PER-001',
  name: 'Student',
  institutional_id: '2024CSB1042',
  email: '',
  phone: '',
  role: 'Student',
  department: 'Computer Science & Engineering',
};

const defaultStaff: StaffEntity = {
  staff_id: 'STF-001',
  name: 'Staff',
  designation: 'Maintenance Officer',
  department: 'Maintenance',
  email: '',
  phone: '',
};

const defaultAdmin: AdminEntity = {
  admin_id: 'ADM-001',
  name: 'Admin',
  designation: 'Administrator',
  email: '',
  phone: '',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [role, setRole] = useState<UserRole | null>(null);
  const [currentPerson, setCurrentPerson] = useState<PersonEntity>(defaultPerson);
  const [currentStaff, setCurrentStaff] = useState<StaffEntity>(defaultStaff);
  const [currentAdmin, setCurrentAdmin] = useState<AdminEntity>(defaultAdmin);
  const [authLoading, setAuthLoading] = useState(true);

  const isAuthenticated = role !== null;

  const loadUserProfile = async (userId: string) => {
    // Check Admin profile
    const { data: admin, error: adminError } = await supabase
      .from('admin')
      .select('*')
      .eq('auth_user_id', userId)
      .maybeSingle();

    if (adminError) throw adminError;

    if (admin) {
      setCurrentAdmin({
        admin_id: String(admin.admin_id),
        name: admin.name,
        designation: admin.designation || 'Administrator',
        email: admin.email,
        phone: admin.phone || '',
      });
      setRole('ADMIN');
      return;
    }

    // Check Staff profile
    const { data: staff, error: staffError } = await supabase
      .from('staff')
      .select('*')
      .eq('auth_user_id', userId)
      .maybeSingle();

    if (staffError) throw staffError;

    if (staff) {
      setCurrentStaff({
        staff_id: String(staff.staff_id),
        name: staff.name,
        designation: staff.designation || 'Staff',
        department: staff.department || 'Maintenance',
        email: '',
        phone: staff.phone || '',
      });
      setRole('STAFF');
      return;
    }

    // Check Person profile
    const { data: person, error: personError } = await supabase
      .from('person')
      .select('*')
      .eq('auth_user_id', userId)
      .maybeSingle();

    if (personError) throw personError;

    if (person) {
      setCurrentPerson({
        person_id: String(person.person_id),
        name: person.name,
        institutional_id: person.student_id || String(person.person_id),
        email: '',
        phone: person.phone || '',
        role: 'Student',
        department: person.department || '',
      });
      setRole('PERSON');
      return;
    }

    throw new Error('No profile is linked to this account. Please contact the administrator.');
  };

  const clearUser = () => {
    setRole(null);
    setCurrentPerson(defaultPerson);
    setCurrentStaff(defaultStaff);
    setCurrentAdmin(defaultAdmin);
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    try {
      await loadUserProfile(data.user.id);
    } catch (profileError) {
      await supabase.auth.signOut();
      clearUser();
      throw profileError;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    clearUser();
  };

  useEffect(() => {
    let mounted = true;

    const restoreSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        clearUser();
        setAuthLoading(false);
        return;
      }

      if (data.session) {
        try {
          await loadUserProfile(data.session.user.id);
        } catch (error) {
          console.error('Could not load user profile:', error);
          await supabase.auth.signOut();
          clearUser();
        }
      }

      if (mounted) setAuthLoading(false);
    };

    restoreSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          clearUser();
        } else if (event === 'SIGNED_IN' && session) {
          setTimeout(() => {
            if (mounted) {
              loadUserProfile(session.user.id)
                .catch((error) => {
                  console.error('Could not load user profile:', error);
                  clearUser();
                })
                .finally(() => {
                  if (mounted) setAuthLoading(false);
                });
            }
          }, 0);
        }
      }
    );

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const currentUser =
    role === 'ADMIN'
      ? currentAdmin
      : role === 'STAFF'
      ? currentStaff
      : role === 'PERSON'
      ? currentPerson
      : null;

  return (
    <AuthContext.Provider
      value={{
        role,
        currentUser,
        currentPerson,
        currentStaff,
        currentAdmin,
        isAuthenticated,
        authLoading,
        login,
        logout,
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
