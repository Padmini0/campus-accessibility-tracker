import React, { createContext, useContext, useState, useEffect } from 'react';
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
  VerificationResult,
  IssuePriority,
  IssueCategory,
} from '../types';
import {
  INITIAL_ISSUES,
  INITIAL_HISTORY,
  INITIAL_VERIFICATIONS,
  INITIAL_LOCATIONS,
  INITIAL_FEATURES,
  INITIAL_STAFF,
  INITIAL_PEOPLE,
  INITIAL_ADMIN,
  INITIAL_PRIORITIES,
} from '../data/mockData';

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

  // CRUD & Transactions
  reportIssue: (input: ReportIssueInput) => IssueEntity;
  assignStaff: (issue_id: string, staff_id: string, admin_name: string, remarks?: string) => void;
  updateIssueStatus: (issue_id: string, new_status: IssueStatus, changed_by: string, remarks: string) => void;
  verifyIssue: (
    issue_id: string,
    admin_id: string,
    verification_status: VerificationResult,
    remarks: string
  ) => void;
  resetDatabase: () => void;

  // Relational Lookups
  getIssueById: (issue_id: string) => IssueEntity | undefined;
  getLocationById: (location_id: string) => LocationEntity | undefined;
  getFeatureById: (feature_id?: string) => AccessibilityFeatureEntity | undefined;
  getStaffById: (staff_id?: string) => StaffEntity | undefined;
  getPersonById: (person_id: string) => PersonEntity | undefined;
  getHistoryForIssue: (issue_id: string) => IssueHistoryEntity[];
  getVerificationForIssue: (issue_id: string) => VerificationEntity | undefined;

  // Toast
  toastMessage: { text: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
  clearToast: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'jklu_campus_access_v2';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<IssueEntity[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_issues`);
      return saved ? JSON.parse(saved) : INITIAL_ISSUES;
    } catch {
      return INITIAL_ISSUES;
    }
  });

  const [history, setHistory] = useState<IssueHistoryEntity[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_history`);
      return saved ? JSON.parse(saved) : INITIAL_HISTORY;
    } catch {
      return INITIAL_HISTORY;
    }
  });

  const [verifications, setVerifications] = useState<VerificationEntity[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_verifications`);
      return saved ? JSON.parse(saved) : INITIAL_VERIFICATIONS;
    } catch {
      return INITIAL_VERIFICATIONS;
    }
  });

  const [locations] = useState<LocationEntity[]>(INITIAL_LOCATIONS);
  const [features] = useState<AccessibilityFeatureEntity[]>(INITIAL_FEATURES);
  const [staff] = useState<StaffEntity[]>(INITIAL_STAFF);
  const [people] = useState<PersonEntity[]>(INITIAL_PEOPLE);
  const [admin] = useState<AdminEntity>(INITIAL_ADMIN);
  const [priorities] = useState<PriorityEntity[]>(INITIAL_PRIORITIES);

  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const clearToast = () => setToastMessage(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_issues`, JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_history`, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_verifications`, JSON.stringify(verifications));
  }, [verifications]);

  const reportIssue = (input: ReportIssueInput): IssueEntity => {
    // Generate next issue ID
    const maxNum = issues.reduce((max, item) => {
      const num = parseInt(item.issue_id.replace('ISS-', ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 1026);
    const newIssueId = `ISS-${maxNum + 1}`;

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')} Sep 2026, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newIssue: IssueEntity = {
      issue_id: newIssueId,
      title: input.title,
      category: input.category,
      description: input.description,
      location_id: input.location_id,
      feature_id: input.feature_id,
      reporter_id: input.reporter_id,
      priority: input.priority,
      status: 'OPEN',
      date_reported: formattedDate,
      image_url: input.image_url,
    };

    // Generate history ID
    const historyMax = history.reduce((max, item) => {
      const num = parseInt(item.history_id.replace('HIS-', ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 12);
    const newHistoryId = `HIS-${(historyMax + 1).toString().padStart(3, '0')}`;

    const reporter = people.find((p) => p.person_id === input.reporter_id);
    const reporterName = reporter ? `${reporter.name} (${reporter.role})` : 'Student Reporter';

    const newHistoryRecord: IssueHistoryEntity = {
      history_id: newHistoryId,
      issue_id: newIssueId,
      old_status: 'NEW',
      new_status: 'OPEN',
      changed_by: reporterName,
      change_date: formattedDate,
      remarks: 'Issue reported via student accessibility portal.',
    };

    setIssues((prev) => [newIssue, ...prev]);
    setHistory((prev) => [newHistoryRecord, ...prev]);
    showToast(`Issue ${newIssueId} reported successfully! Track in My Issues.`, 'success');

    return newIssue;
  };

  const assignStaff = (issue_id: string, staff_id: string, admin_name: string, remarks?: string) => {
    const targetIssue = issues.find((i) => i.issue_id === issue_id);
    if (!targetIssue) return;

    const assignedStaffMember = staff.find((s) => s.staff_id === staff_id);
    const staffLabel = assignedStaffMember ? `${assignedStaffMember.name} (${assignedStaffMember.department})` : staff_id;

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')} Sep 2026, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const oldStatus = targetIssue.status;
    const newStatus: IssueStatus = targetIssue.status === 'OPEN' ? 'ASSIGNED' : targetIssue.status;

    // History record
    const historyMax = history.reduce((max, item) => {
      const num = parseInt(item.history_id.replace('HIS-', ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 12);
    const newHistoryId = `HIS-${(historyMax + 1).toString().padStart(3, '0')}`;

    const newHistoryRecord: IssueHistoryEntity = {
      history_id: newHistoryId,
      issue_id: issue_id,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: `Admin (${admin_name})`,
      change_date: formattedDate,
      remarks: remarks || `Assigned to ${staffLabel}`,
    };

    setIssues((prev) =>
      prev.map((i) =>
        i.issue_id === issue_id
          ? {
              ...i,
              assigned_staff_id: staff_id,
              status: newStatus,
            }
          : i
      )
    );

    setHistory((prev) => [newHistoryRecord, ...prev]);
    showToast(`Assigned ${issue_id} to ${staffLabel}.`, 'info');
  };

  const updateIssueStatus = (
    issue_id: string,
    new_status: IssueStatus,
    changed_by: string,
    remarks: string
  ) => {
    const targetIssue = issues.find((i) => i.issue_id === issue_id);
    if (!targetIssue) return;

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')} Sep 2026, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const oldStatus = targetIssue.status;

    const historyMax = history.reduce((max, item) => {
      const num = parseInt(item.history_id.replace('HIS-', ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 12);
    const newHistoryId = `HIS-${(historyMax + 1).toString().padStart(3, '0')}`;

    const newHistoryRecord: IssueHistoryEntity = {
      history_id: newHistoryId,
      issue_id: issue_id,
      old_status: oldStatus,
      new_status: new_status,
      changed_by,
      change_date: formattedDate,
      remarks: remarks || `Status changed to ${new_status}`,
    };

    setIssues((prev) =>
      prev.map((i) => {
        if (i.issue_id === issue_id) {
          const updated: IssueEntity = {
            ...i,
            status: new_status,
          };
          if (new_status === 'RESOLVED') {
            updated.resolved_date = formattedDate;
            updated.resolution_remarks = remarks;
          }
          return updated;
        }
        return i;
      })
    );

    setHistory((prev) => [newHistoryRecord, ...prev]);
    showToast(`Status for ${issue_id} updated to ${new_status}.`, 'success');
  };

  const verifyIssue = (
    issue_id: string,
    admin_id: string,
    verification_status: VerificationResult,
    remarks: string
  ) => {
    const targetIssue = issues.find((i) => i.issue_id === issue_id);
    if (!targetIssue) return;

    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')} Sep 2026, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const verMax = verifications.reduce((max, item) => {
      const num = parseInt(item.verification_id.replace('VER-', ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 2);
    const newVerId = `VER-${(verMax + 1).toString().padStart(3, '0')}`;

    const newVerRecord: VerificationEntity = {
      verification_id: newVerId,
      issue_id,
      admin_id,
      verification_status,
      verification_date: formattedDate,
      remarks,
      completed_date: verification_status === 'SUCCESSFULLY RESOLVED' ? formattedDate : undefined,
    };

    // If NOT FIXED, reopen issue to IN PROGRESS
    const newIssueStatus: IssueStatus = verification_status === 'NOT FIXED' ? 'IN PROGRESS' : targetIssue.status;

    // History record
    const historyMax = history.reduce((max, item) => {
      const num = parseInt(item.history_id.replace('HIS-', ''), 10);
      return !isNaN(num) && num > max ? num : max;
    }, 12);
    const newHistoryId = `HIS-${(historyMax + 1).toString().padStart(3, '0')}`;

    const adminUser = admin;
    const historyRemark =
      verification_status === 'SUCCESSFULLY RESOLVED'
        ? `Resolution Verified: ${remarks}`
        : verification_status === 'PARTIALLY RESOLVED'
        ? `Partial Resolution Verified: ${remarks}`
        : `Resolution Failed Verification - Reopened: ${remarks}`;

    const newHistoryRecord: IssueHistoryEntity = {
      history_id: newHistoryId,
      issue_id,
      old_status: targetIssue.status,
      new_status: newIssueStatus,
      changed_by: `Admin (${adminUser.name})`,
      change_date: formattedDate,
      remarks: historyRemark,
    };

    setVerifications((prev) => {
      // replace if existing or prepend
      const filtered = prev.filter((v) => v.issue_id !== issue_id);
      return [newVerRecord, ...filtered];
    });

    setIssues((prev) =>
      prev.map((i) =>
        i.issue_id === issue_id
          ? {
              ...i,
              verification_id: newVerId,
              status: newIssueStatus,
            }
          : i
      )
    );

    setHistory((prev) => [newHistoryRecord, ...prev]);
    showToast(`Verification recorded: ${verification_status} for ${issue_id}`, 'success');
  };

  const resetDatabase = () => {
    localStorage.removeItem(`${STORAGE_KEY}_issues`);
    localStorage.removeItem(`${STORAGE_KEY}_history`);
    localStorage.removeItem(`${STORAGE_KEY}_verifications`);
    setIssues(INITIAL_ISSUES);
    setHistory(INITIAL_HISTORY);
    setVerifications(INITIAL_VERIFICATIONS);
    showToast('Database reset to original seed data state.', 'info');
  };

  // Relational Lookups
  const getIssueById = (issue_id: string) => issues.find((i) => i.issue_id === issue_id);
  const getLocationById = (location_id: string) => locations.find((l) => l.location_id === location_id);
  const getFeatureById = (feature_id?: string) => (feature_id ? features.find((f) => f.feature_id === feature_id) : undefined);
  const getStaffById = (staff_id?: string) => (staff_id ? staff.find((s) => s.staff_id === staff_id) : undefined);
  const getPersonById = (person_id: string) => people.find((p) => p.person_id === person_id);
  const getHistoryForIssue = (issue_id: string) => history.filter((h) => h.issue_id === issue_id);
  const getVerificationForIssue = (issue_id: string) => verifications.find((v) => v.issue_id === issue_id);

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
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
