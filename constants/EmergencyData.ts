import AsyncStorage from '@react-native-async-storage/async-storage';

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  primary: boolean;
}

const EMERGENCY_CONTACTS_KEY = 'emergency_contacts';

// Default emergency contacts
const DEFAULT_EMERGENCY_CONTACTS: EmergencyContact[] = [
  {
    id: '1',
    name: 'John Chen',
    phone: '+1 (555) 987-6543',
    relationship: 'Spouse',
    primary: true
  },
  {
    id: '2',
    name: 'Dr. Michael Johnson',
    phone: '+1 (555) 456-7890',
    relationship: 'Family Doctor',
    primary: false
  },
  {
    id: '3',
    name: 'Emma Chen',
    phone: '+1 (555) 123-4567',
    relationship: 'Daughter',
    primary: false
  }
];

// Get all emergency contacts
export const getEmergencyContacts = async (): Promise<EmergencyContact[]> => {
  try {
    const contactsJson = await AsyncStorage.getItem(EMERGENCY_CONTACTS_KEY);
    if (contactsJson) {
      return JSON.parse(contactsJson);
    }
    // Return default contacts if none exist
    await saveEmergencyContacts(DEFAULT_EMERGENCY_CONTACTS);
    return DEFAULT_EMERGENCY_CONTACTS;
  } catch (error) {
    console.error('Error getting emergency contacts:', error);
    return DEFAULT_EMERGENCY_CONTACTS;
  }
};

// Save emergency contacts
export const saveEmergencyContacts = async (contacts: EmergencyContact[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(EMERGENCY_CONTACTS_KEY, JSON.stringify(contacts));
  } catch (error) {
    console.error('Error saving emergency contacts:', error);
  }
};

// Add new emergency contact
export const addEmergencyContact = async (contact: Omit<EmergencyContact, 'id'>): Promise<EmergencyContact[]> => {
  try {
    const contacts = await getEmergencyContacts();
    const newContact: EmergencyContact = {
      ...contact,
      id: Date.now().toString(), // Simple ID generation
    };
    
    // If this is set as primary, remove primary from others
    if (newContact.primary) {
      contacts.forEach(c => c.primary = false);
    }
    
    const updatedContacts = [...contacts, newContact];
    await saveEmergencyContacts(updatedContacts);
    return updatedContacts;
  } catch (error) {
    console.error('Error adding emergency contact:', error);
    return await getEmergencyContacts();
  }
};

// Update emergency contact
export const updateEmergencyContact = async (id: string, updates: Partial<EmergencyContact>): Promise<EmergencyContact[]> => {
  try {
    const contacts = await getEmergencyContacts();
    const updatedContacts = contacts.map(contact => {
      if (contact.id === id) {
        const updated = { ...contact, ...updates };
        // If this is set as primary, remove primary from others
        if (updated.primary && !contact.primary) {
          contacts.forEach(c => c.primary = false);
        }
        return updated;
      }
      return contact;
    });
    
    await saveEmergencyContacts(updatedContacts);
    return updatedContacts;
  } catch (error) {
    console.error('Error updating emergency contact:', error);
    return await getEmergencyContacts();
  }
};

// Delete emergency contact
export const deleteEmergencyContact = async (id: string): Promise<EmergencyContact[]> => {
  try {
    const contacts = await getEmergencyContacts();
    const updatedContacts = contacts.filter(contact => contact.id !== id);
    
    // If we deleted the primary contact, make the first remaining contact primary
    if (updatedContacts.length > 0 && !updatedContacts.some(c => c.primary)) {
      updatedContacts[0].primary = true;
    }
    
    await saveEmergencyContacts(updatedContacts);
    return updatedContacts;
  } catch (error) {
    console.error('Error deleting emergency contact:', error);
    return await getEmergencyContacts();
  }
};

// Get primary emergency contact
export const getPrimaryEmergencyContact = async (): Promise<EmergencyContact | null> => {
  try {
    const contacts = await getEmergencyContacts();
    return contacts.find(contact => contact.primary) || contacts[0] || null;
  } catch (error) {
    console.error('Error getting primary emergency contact:', error);
    return null;
  }
};

// Set primary emergency contact
export const setPrimaryEmergencyContact = async (id: string): Promise<EmergencyContact[]> => {
  try {
    const contacts = await getEmergencyContacts();
    const updatedContacts = contacts.map(contact => ({
      ...contact,
      primary: contact.id === id
    }));
    
    await saveEmergencyContacts(updatedContacts);
    return updatedContacts;
  } catch (error) {
    console.error('Error setting primary emergency contact:', error);
    return await getEmergencyContacts();
  }
};