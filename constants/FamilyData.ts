export interface FamilyMember {
  id: number;
  name: string;
  relationship: string;
  age: number;
  healthStatus: 'stable' | 'needs-attention' | 'critical';
  initials: string;
  activeConditions: number;
  upcomingAppointments: number;
  medications: number;
  lastCheckup: string;
  urgency: 'normal' | 'urgent' | 'critical';
  quickStatus?: string; // For homepage display
  emergency: {
    bloodType: string;
    allergies: string[];
    conditions: string[];
    medications: string[];
    emergencyContact: {
      name: string;
      phone: string;
      relation: string;
    };
    hospital: string;
    insurance: string;
  };
}

export const FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 1,
    name: 'John Chen',
    relationship: 'Husband',
    age: 47,
    healthStatus: 'stable',
    initials: 'JC',
    activeConditions: 2,
    upcomingAppointments: 1,
    medications: 3,
    lastCheckup: '2 days ago',
    urgency: 'normal' as const,
    quickStatus: 'Next appointment: Dec 15',
    emergency: {
      bloodType: 'O+',
      allergies: ['Penicillin', 'Shellfish'],
      conditions: ['Hypertension', 'Type 2 Diabetes'],
      medications: ['Lisinopril 10mg', 'Metformin 500mg', 'Aspirin 81mg'],
      emergencyContact: {
        name: 'Dr. Sarah Kim',
        phone: '+1 (555) 123-4567',
        relation: 'Primary Care Physician'
      },
      hospital: 'Seattle General Hospital',
      insurance: 'Blue Cross Blue Shield - Policy #BCX123456'
    }
  },
  {
    id: 2,
    name: 'Emma Chen', 
    relationship: 'Daughter',
    age: 16,
    healthStatus: 'needs-attention',
    initials: 'EC',
    activeConditions: 1,
    upcomingAppointments: 2,
    medications: 1,
    lastCheckup: '1 week ago',
    urgency: 'urgent' as const,
    quickStatus: 'Medication due today',
    emergency: {
      bloodType: 'A+',
      allergies: ['Peanuts'],
      conditions: ['Asthma'],
      medications: ['Albuterol Inhaler'],
      emergencyContact: {
        name: 'Dr. Jennifer Liu',
        phone: '+1 (555) 234-5678',
        relation: 'Pediatrician'
      },
      hospital: 'Children\'s Hospital',
      insurance: 'Blue Cross Blue Shield - Policy #BCX123456'
    }
  },
  {
    id: 3,
    name: 'Robert Chen',
    relationship: 'Father-in-law',
    age: 72,
    healthStatus: 'critical',
    initials: 'RC',
    activeConditions: 4,
    upcomingAppointments: 3,
    medications: 8,
    lastCheckup: 'Yesterday',
    urgency: 'critical' as const,
    quickStatus: 'Critical monitoring required',
    emergency: {
      bloodType: 'B+',
      allergies: ['Sulfa drugs', 'Latex'],
      conditions: ['Heart Disease', 'Diabetes', 'High Blood Pressure', 'Arthritis'],
      medications: ['Metoprolol 50mg', 'Insulin', 'Lisinopril 20mg', 'Atorvastatin 40mg', 'Warfarin 5mg', 'Metformin 1000mg', 'Omeprazole 20mg', 'Glucosamine'],
      emergencyContact: {
        name: 'Dr. Michael Torres',
        phone: '+1 (555) 345-6789',
        relation: 'Cardiologist'
      },
      hospital: 'Seattle Heart Institute',
      insurance: 'Medicare + Supplemental'
    }
  }
];

// Helper function to get family members for homepage (first 2 most relevant)
export const getHomepageFamilyMembers = (): FamilyMember[] => {
  return FAMILY_MEMBERS.slice(0, 2);
};

// Helper function to get family member by ID
export const getFamilyMemberById = (id: number): FamilyMember | undefined => {
  return FAMILY_MEMBERS.find(member => member.id === id);
};