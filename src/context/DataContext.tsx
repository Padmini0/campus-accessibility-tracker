
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import {
  IssueEntity,
  IssueHistoryEntity,
  VerificationEntity,
  LocationEntity,
  AccessibilityFeatureEntity,
  StaffEntity,
  PersonEntity,
  AdminEntity,
  PriorityEntity,
  IssueStatus,
  IssuePriority,
  IssueCategory,
  VerificationResult,
} from '../types';

import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface ReportIssueInput {
  title: string;
  category: IssueCategory;
  description: string;
  location_id: string;
  feature_id?: string;
  reporter_id: string;
  priority: IssuePriority;
  image_url?: string;
}

interface DataContextType {
  issues: IssueEntity[];
  history: IssueHistoryEntity[];
  verifications: VerificationEntity[];
  locations: LocationEntity[];
  features: AccessibilityFeatureEntity[];
  staff: StaffEntity[];
  people: PersonEntity[];
  admin: AdminEntity;
  priorities: PriorityEntity[];

  reportIssue: (
    input: ReportIssueInput
  ) => Promise<{ issue_id: string }>;

  assignStaff: (
    issue_id: string,
    staff_id: string,
    admin_name: string,
    remarks?: string
  ) => Promise<void>;

  updateIssueStatus: (
    issue_id: string,
    new_status: IssueStatus,
    changed_by: string,
    remarks: string
  ) => Promise<void>;

  verifyIssue: (
    issue_id: string,
    admin_id: string,
    verification_status: VerificationResult,
    remarks: string
  ) => Promise<void>;

  resetDatabase: () => void;

  getIssueById: (id: string) => IssueEntity | undefined;
  getLocationById: (id: string) => LocationEntity | undefined;
  getFeatureById: (id: string) => AccessibilityFeatureEntity | undefined;
  getStaffById: (id: string) => StaffEntity | undefined;
  getPersonById: (id: string) => PersonEntity | undefined;
  getHistoryForIssue: (id: string) => IssueHistoryEntity[];
  getVerificationForIssue: (id: string) => VerificationEntity | undefined;

  toastMessage: string;
  showToast: (message: string) => void;
  clearToast: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const toDbId = (id: string) => {
  const number = Number(id.replace(/^[A-Z]+-/, ''));
  return Number.isFinite(number) ? number : Number(id);
};

const displayId = (prefix: string, id: number | string) =>
  `${prefix}-${id}`;

const toDbStatus = (status: IssueStatus): string => {
  const values: Record<IssueStatus, string> = {
    OPEN: 'Open',
    ASSIGNED: 'Assigned',
    'IN PROGRESS': 'In Progress',
    RESOLVED: 'Resolved',
  };
  return values[status];
};

const fromDbStatus = (status: string): IssueStatus => {
  const value = status.toUpperCase();

  if (value === 'ASSIGNED') return 'ASSIGNED';
  if (value === 'IN PROGRESS') return 'IN PROGRESS';
  if (value === 'RESOLVED') return 'RESOLVED';

  return 'OPEN';
};

const toDbPriority = (priority: IssuePriority) => {
  const values: Record<IssuePriority, string> = {
    CRITICAL: 'Critical',
    HIGH: 'High',
    MEDIUM: 'Medium',
    LOW: 'Low',
  };
  return values[priority];
};

const fromDbPriority = (priority: string): IssuePriority =>
  priority.toUpperCase() as IssuePriority;

const fromDbResult = (result: string): VerificationResult =>
  result.toUpperCase() as VerificationResult;

const toDbResult = (result: VerificationResult): string => {
  const values: Record<VerificationResult, string> = {
    PENDING: 'Pending',
    'SUCCESSFULLY RESOLVED': 'Successfully Resolved',
    'PARTIALLY RESOLVED': 'Partially Resolved',
    'NOT FIXED': 'Not Fixed',
  };
  return values[result];
};

export function DataProvider({ children }: { children: ReactNode }) {
  const { currentUser, currentAdmin } = useAuth();

  const [issues, setIssues] = useState<IssueEntity[]>([]);
  const [history, setHistory] = useState<IssueHistoryEntity[]>([]);
  const [verifications, setVerifications] = useState<VerificationEntity[]>([]);
  const [locations, setLocations] = useState<LocationEntity[]>([]);
  const [features, setFeatures] = useState<AccessibilityFeatureEntity[]>([]);
  const [staff, setStaff] = useState<StaffEntity[]>([]);
  const [people, setPeople] = useState<PersonEntity[]>([]);
  const [priorities, setPriorities] = useState<PriorityEntity[]>([]);
  const [toastMessage, setToastMessage] = useState('');

  const admin: AdminEntity = currentAdmin;

  const loadData = async () => {
    const [
      issueResult,
      historyResult,
      verificationResult,
      locationResult,
      featureResult,
      staffResult,
      personResult,
      priorityResult,
    ] = await Promise.all([
      supabase
        .from('issue')
        .select('*')
        .order('issue_id', { ascending: false }),

      supabase
        .from('issue_history')
        .select('*')
        .order('change_date', { ascending: false }),

      supabase.from('verification').select('*'),
      supabase.from('location').select('*'),
      supabase.from('accessibility_feature').select('*'),
      supabase.from('staff').select('*'),
      supabase.from('person').select('*'),
      supabase.from('priority').select('*'),
    ]);

    if (issueResult.error) console.error('Issues:', issueResult.error);
    if (historyResult.error) console.error('History:', historyResult.error);
    if (verificationResult.error) console.error('Verification:', verificationResult.error);
    if (locationResult.error) console.error('Locations:', locationResult.error);
    if (featureResult.error) console.error('Features:', featureResult.error);
    if (staffResult.error) console.error('Staff:', staffResult.error);
    if (personResult.error) console.error('People:', personResult.error);
    if (priorityResult.error) console.error('Priorities:', priorityResult.error);

    const priorityRows = priorityResult.data ?? [];

    setPriorities(
      priorityRows.map((p: any) => ({
        level: fromDbPriority(p.priority_name),
        sla_hours: p.response_hours,
        description: '',
        color_code: '',
      }))
    );

    const priorityNameById = new Map(
      priorityRows.map((p: any) => [
        p.priority_id,
        fromDbPriority(p.priority_name),
      ])
    );

    setIssues(
      (issueResult.data ?? []).map((i: any) => ({
        issue_id: displayId('ISS', i.issue_id),
        title: i.category,
        category: i.category as IssueCategory,
        description: i.description,
        location_id: String(i.location_id),
        feature_id: i.feature_id ? String(i.feature_id) : undefined,
        reporter_id: String(i.person_id),
        assigned_staff_id: i.staff_id ? String(i.staff_id) : undefined,
        priority: priorityNameById.get(i.priority_id) ?? 'MEDIUM',
        status: fromDbStatus(i.status),
        date_reported: i.date_reported,
        image_url: undefined,
      }))
    );

    setLocations(
      (locationResult.data ?? []).map((l: any) => ({
        location_id: String(l.location_id),
        building: l.building,
        floor: l.floor,
        area: l.area,
        description: l.description ?? '',
        accessibility_features_count: (featureResult.data ?? []).filter(
          (f: any) => f.location_id === l.location_id
        ).length,
      }))
    );

    setFeatures(
      (featureResult.data ?? []).map((f: any) => ({
        feature_id: String(f.feature_id),
        feature_type: f.feature_type,
        location_id: String(f.location_id),
        current_status: f.status,
        install_date: '',
        last_inspected: '',
        notes: '',
      }))
    );

    setStaff(
      (staffResult.data ?? []).map((s: any) => ({
        staff_id: String(s.staff_id),
        name: s.name,
        designation: s.designation ?? '',
        department: s.department ?? 'Facilities',
        email: '',
        phone: s.phone,
      }))
    );

    setPeople(
      (personResult.data ?? []).map((p: any) => ({
        person_id: String(p.person_id),
        name: p.name,
        institutional_id: p.student_id ?? '',
        email: p.email ?? '',
        phone: p.phone,
        role: p.student_id ? 'Student' : 'Visitor',
        department: p.department ?? '',
      }))
    );

    setHistory(
      (historyResult.data ?? []).map((h: any) => ({
        history_id: displayId('HIS', h.history_id),
        issue_id: displayId('ISS', h.issue_id),
        old_status: h.old_status ?? '',
        new_status: fromDbStatus(h.new_status),
        changed_by: h.changed_by ?? '',
        change_date: h.change_date,
        remarks: h.remarks ?? '',
      }))
    );

    setVerifications(
      (verificationResult.data ?? []).map((v: any) => ({
        verification_id: displayId('VER', v.verification_id),
        issue_id: displayId('ISS', v.issue_id),
        admin_id: String(v.verified_by),
        verification_status: fromDbResult(v.result),
        verification_date: v.verification_date,
        remarks: v.remarks ?? '',
        completed_date: v.completed_date ?? undefined,
      }))
    );
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    } else {
      setIssues([]);
      setHistory([]);
      setVerifications([]);
    }
  }, [currentUser]);

  // Report a new accessibility issue
  const reportIssue = async (input: ReportIssueInput) => {
    const { data: priorityRow, error: priorityError } = await supabase
      .from('priority')
      .select('priority_id')
      .eq('priority_name', toDbPriority(input.priority))
      .single();

    if (priorityError) throw priorityError;

    const { data: insertedIssue, error } = await supabase
      .from('issue')
      .insert({
        category: input.category,
        description: input.description,
        severity: toDbPriority(input.priority),
        date_reported: new Date().toISOString(),
        status: 'Open',
        person_id: toDbId(input.reporter_id),
        location_id: toDbId(input.location_id),
        feature_id: input.feature_id
          ? toDbId(input.feature_id)
          : null,
        priority_id: priorityRow.priority_id,
        staff_id: null,
      })
      .select('issue_id')
      .single();

    if (error) throw error;

    await loadData();

    showToast('Issue reported successfully!');

    return {
      issue_id: displayId('ISS', insertedIssue.issue_id),
    };
  };

  // Assign an issue to a staff member (admin only)
  const assignStaff = async (
    issue_id: string,
    staff_id: string,
    admin_name: string,
    remarks = ''
  ) => {
    const { error } = await supabase.rpc('admin_assign_issue', {
      p_issue_id: toDbId(issue_id),
      p_staff_id: toDbId(staff_id),
    });

    if (error) {
      console.error('Assignment error:', error);
      throw error;
    }

    await loadData();

    showToast(`Issue assigned successfully by ${admin_name}. ${remarks}`);
  };

  // Update the status of an issue
  const updateIssueStatus = async (
    issue_id: string,
    new_status: IssueStatus,
    changed_by: string,
    remarks: string
  ) => {
    const { error } = await supabase
      .from('issue')
      .update({ status: toDbStatus(new_status) })
      .eq('issue_id', toDbId(issue_id));

    if (error) throw error;

    await loadData();

    showToast(`Issue status updated. ${remarks}`);
  };

  // Verify an issue (admin only)
  const verifyIssue = async (
    issue_id: string,
    admin_id: string,
    verification_status: VerificationResult,
    remarks: string
  ) => {
    const successful = verification_status === 'SUCCESSFULLY RESOLVED';

    const { error } = await supabase.from('verification').insert({
      issue_id: toDbId(issue_id),
      verified_by: toDbId(admin_id),
      result: toDbResult(verification_status),
      verification_date: new Date().toISOString(),
      remarks,
      completed_date: successful ? new Date().toISOString() : null,
    });

    if (error) throw error;

    await loadData();

    showToast('Verification saved successfully!');
  };

  const resetDatabase = () => {
    showToast('Database reset is disabled for the live database.');
  };

  const getIssueById = (id: string) =>
    issues.find((i) => i.issue_id === id);

  const getLocationById = (id: string) =>
    locations.find((l) => l.location_id === id);

  const getFeatureById = (id: string) =>
    features.find((f) => f.feature_id === id);

  const getStaffById = (id: string) =>
    staff.find((s) => s.staff_id === id);

  const getPersonById = (id: string) =>
    people.find((p) => p.person_id === id);

  const getHistoryForIssue = (id: string) =>
    history.filter((h) => h.issue_id === id);

  const getVerificationForIssue = (id: string) =>
    verifications.find((v) => v.issue_id === id);

  const showToast = (message: string) => setToastMessage(message);
  const clearToast = () => setToastMessage('');

  return (
    <DataContext.Provider
      value={{
        issues,
        history,
        verifications,
        locations,
        features,
        staff,
        people,
        admin,
        priorities,
        reportIssue,
        assignStaff,
        updateIssueStatus,
        verifyIssue,
        resetDatabase,
        getIssueById,
        getLocationById,
        getFeatureById,
        getStaffById,
        getPersonById,
        getHistoryForIssue,
        getVerificationForIssue,
        toastMessage,
        showToast,
        clearToast,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error('useData must be used inside DataProvider');
  }

  return context;
}
