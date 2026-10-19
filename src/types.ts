export type UserRole = 'PERSON' | 'STAFF' | 'ADMIN';

export type IssueStatus = 'OPEN' | 'ASSIGNED' | 'IN PROGRESS' | 'RESOLVED';

export type IssuePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type VerificationResult = 'PENDING' | 'SUCCESSFULLY RESOLVED' | 'PARTIALLY RESOLVED' | 'NOT FIXED';

export type IssueCategory =
  | 'Infrastructure'
  | 'Elevator'
  | 'Ramp'
  | 'Accessible Washroom'
  | 'Tactile Path'
  | 'Handrail'
  | 'Accessible Parking'
  | 'Water Cooler'
  | 'Other';

export type FeatureType =
  | 'Elevator'
  | 'Ramp'
  | 'Accessible Washroom'
  | 'Tactile Path'
  | 'Handrail'
  | 'Accessible Parking'
  | 'Water Cooler';

export type FeatureStatus = 'Available' | 'Needs Maintenance' | 'Unavailable';

// DBMS ENTITIES

export interface PersonEntity {
  person_id: string; // PK: PER-001
  name: string;
  institutional_id: string;
  email: string;
  phone: string;
  role: 'Student' | 'Faculty' | 'Visitor';
  department: string;
}

export interface StaffEntity {
  staff_id: string; // PK: STF-001
  name: string;
  designation: string;
  department: 'Maintenance' | 'Electrical' | 'Civil Works' | 'Facilities';
  email: string;
  phone: string;
  active_assigned_count?: number;
}

export interface AdminEntity {
  admin_id: string; // PK: ADM-001
  name: string;
  designation: string;
  email: string;
  phone: string;
}

export interface LocationEntity {
  location_id: string; // PK: LOC-001
  building: string;
  floor: string;
  area: string;
  description: string;
  accessibility_features_count: number;
}

export interface AccessibilityFeatureEntity {
  feature_id: string; // PK: FEAT-001
  feature_type: FeatureType | string;
  location_id: string; // FK -> LocationEntity.location_id
  current_status: FeatureStatus;
  install_date: string;
  last_inspected: string;
  notes: string;
  description?: string;
}

export interface PriorityEntity {
  level: IssuePriority; // PK
  sla_hours: number;
  description: string;
  color_code: string;
}

export interface IssueEntity {
  issue_id: string; // PK: ISS-1001
  title: string;
  category: IssueCategory;
  description: string;
  location_id: string; // FK -> LocationEntity.location_id
  feature_id?: string; // FK -> AccessibilityFeatureEntity.feature_id
  reporter_id: string; // FK -> PersonEntity.person_id
  assigned_staff_id?: string; // FK -> StaffEntity.staff_id (nullable)
  priority: IssuePriority;
  status: IssueStatus;
  date_reported: string;
  image_url?: string;
  resolution_remarks?: string;
  resolved_date?: string;
  verification_id?: string; // FK -> VerificationEntity.verification_id
}

export interface IssueHistoryEntity {
  history_id: string; // PK: HIS-001
  issue_id: string; // FK -> IssueEntity.issue_id
  old_status: string;
  new_status: IssueStatus;
  changed_by: string;
  change_date: string;
  remarks: string;
}

export interface VerificationEntity {
  verification_id: string; // PK: VER-001
  issue_id: string; // FK -> IssueEntity.issue_id
  admin_id: string; // FK -> AdminEntity.admin_id
  verification_status: VerificationResult;
  verification_date: string;
  remarks: string;
  completed_date?: string;
}
