/**
 * Backend-Ready Health Data Schemas
 * TypeScript interfaces for health management system
 */

// Base Types
export type UrgencyLevel = 'critical' | 'urgent' | 'dueSoon' | 'completed' | 'neutral';
export type MedicationStatus = 'pending' | 'taken' | 'skipped' | 'overdue';
export type AlertType = 'medication' | 'appointment' | 'refill' | 'checkup' | 'test' | 'emergency';
export type ConditionSeverity = 'mild' | 'moderate' | 'severe';
export type ConditionStatus = 'active' | 'managed' | 'resolved' | 'chronic' | 'monitoring';
export type ConditionType = 'chronic' | 'acute' | 'allergic' | 'mental' | 'musculoskeletal' | 'cardiovascular' | 'endocrine' | 'respiratory' | 'dermatological' | 'gastrointestinal' | 'neurological' | 'other';

// User Schema
export interface User {
  id: string;
  email: string;
  name: string;
  dateOfBirth: Date;
  emergencyContact?: EmergencyContact;
  createdAt: Date;
  updatedAt: Date;
}

// Emergency Contact Schema
export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Medication Schema
export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string;
  instructions?: string;
  prescribedBy?: string;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  reminderTimes: string[]; // ["08:00", "14:00", "20:00"]
  createdAt: Date;
  updatedAt: Date;
}

// Medication Dose Schema (for tracking individual doses)
export interface MedicationDose {
  id: string;
  medicationId: string;
  userId: string;
  scheduledTime: Date;
  takenTime?: Date;
  status: MedicationStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Health Alert Schema
export interface HealthAlert {
  id: string;
  userId: string;
  type: AlertType;
  title: string;
  description: string;
  urgency: UrgencyLevel;
  dueDate?: Date;
  isRecurring: boolean;
  recurringPattern?: string; // "daily", "weekly", "monthly", "yearly"
  isDismissed: boolean;
  dismissedAt?: Date;
  isSnoozed: boolean;
  snoozedUntil?: Date;
  actionRequired: boolean;
  actionButtons?: AlertAction[];
  relatedEntityId?: string; // medication, appointment, condition ID
  relatedEntityType?: 'medication' | 'appointment' | 'condition';
  createdAt: Date;
  updatedAt: Date;
}

// Alert Action Schema
export interface AlertAction {
  id: string;
  label: string;
  action: 'schedule' | 'refill' | 'call' | 'navigate' | 'dismiss' | 'snooze';
  actionData?: Record<string, any>;
}

// Health Condition Schema
export interface HealthCondition {
  id: string;
  userId: string;
  name: string;
  type: ConditionType;
  description?: string;
  severity: ConditionSeverity;
  status: ConditionStatus;
  diagnosedDate?: Date;
  diagnosedBy?: string;
  treatmentPlan?: string;
  relatedMedications: string[]; // Array of medication IDs
  medications?: string[]; // Alternative property name for compatibility
  symptoms: string[];
  specialists?: string[];
  notes?: string;
  nextAppointment?: Date;
  riskFactors?: string[];
  lifestyle?: {
    dietRestrictions?: string[];
    exerciseRecommendations?: string[];
    monitoring?: string[];
  };
  emergencyActions?: string[];
  relatedConditions?: string[];
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Symptom Log Schema
export interface SymptomLog {
  id: string;
  conditionId: string;
  userId: string;
  symptoms: string[];
  severity: 1 | 2 | 3 | 4 | 5; // 1-5 scale
  notes?: string;
  loggedAt: Date;
  createdAt: Date;
}

// Appointment Schema
export interface Appointment {
  id: string;
  userId: string;
  title: string;
  description?: string;
  doctorName?: string;
  location?: string;
  scheduledDate: Date;
  duration: number; // minutes
  type: 'checkup' | 'consultation' | 'test' | 'procedure' | 'followup';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  reminderTime?: Date;
  notes?: string;
  relatedConditions: string[]; // Array of condition IDs
  createdAt: Date;
  updatedAt: Date;
}

// Family Member Schema (for family health management)
export interface FamilyMember {
  id: string;
  userId: string; // The user who manages this family member
  name: string;
  relationship: string;
  dateOfBirth?: Date;
  canViewHealth: boolean;
  canEditHealth: boolean;
  emergencyContact?: EmergencyContact;
  sharedMedications: string[]; // Array of medication IDs
  sharedConditions: string[]; // Array of condition IDs
  createdAt: Date;
  updatedAt: Date;
}

// Emergency Profile Schema
export interface EmergencyProfile {
  id: string;
  userId: string;
  bloodType?: string;
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  emergencyContacts: EmergencyContact[];
  insuranceInfo?: InsuranceInfo;
  medicalAlerts: string[];
  qrCodeData: string; // Encrypted essential data for QR sharing
  lastUpdated: Date;
  createdAt: Date;
}

// Insurance Info Schema
export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  phoneNumber?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Frontend State Types
export interface TodaysHealthData {
  medications: (Medication & { 
    todaysDoses: MedicationDose[];
    streak: number;
    nextDose?: MedicationDose;
  })[];
  completedCount: number;
  pendingCount: number;
  overdueCount: number;
}

export interface HealthAlertsData {
  alerts: HealthAlert[];
  criticalCount: number;
  urgentCount: number;
  dueSoonCount: number;
}

export interface MyConditionsData {
  conditions: (HealthCondition & {
    relatedAlerts: HealthAlert[];
    recentSymptoms: SymptomLog[];
  })[];
  recentSymptoms: SymptomLog[];
  activeCount: number;
  managedCount: number;
  monitoringCount: number;
  resolvedCount: number;
}