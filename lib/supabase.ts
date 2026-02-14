import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import {
  Activity,
  Image as ImageIcon,
  Pill,
  User,
  Heart,
  Scissors,
  Shield,
  Zap,
} from 'lucide-react-native';

// Get Supabase credentials from environment
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || 'https://elcnyywgrzrkrdwjmouz.supabase.co';
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsY255eXdncnpya3Jkd2ptb3V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MzkzMDIsImV4cCI6MjA3NDAxNTMwMn0.cqsnIwpp5dW_8XKLg56FSCDDpnhx0D7ywDY_LKfqzrk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types to match our database schema
export interface DatabaseRecord {
  id: number;
  user_id: string;
  title: string;
  date: string;
  type: string;
  icon_name: string;
  color_key: string;
  has_ai_summary: boolean;
  urgency: string;
  provider: string;
  content_type: string;
  record_data: any;
  ai_summary?: string;
  ai_confidence?: number;
  medical_content: string;
  created_at: string;
  updated_at: string;
}

// Transform database record to UI format
export const transformDatabaseRecord = (dbRecord: DatabaseRecord) => {
  // Icon mapping
  const iconMap: { [key: string]: any } = {
    'Activity': Activity,
    'ImageIcon': ImageIcon, 
    'Pill': Pill,
    'User': User,
    'Heart': Heart,
    'Scissors': Scissors,
    'Shield': Shield,
    'Zap': Zap
  };

  // Color mapping (these should match your BrandColors)
  const colorMap: { [key: string]: string } = {
    'primaryGreen': '#2D5A27',
    'deepTeal': '#0F766E',
    'mintGreen': '#10B981', 
    'warning': '#F59E0B',
    'error': '#EF4444'
  };

  return {
    id: dbRecord.id,
    title: dbRecord.title,
    date: dbRecord.date,
    type: dbRecord.type,
    icon: iconMap[dbRecord.icon_name] || Activity,
    color: colorMap[dbRecord.color_key] || '#2D5A27',
    hasAiSummary: dbRecord.has_ai_summary,
    urgency: dbRecord.urgency,
    provider: dbRecord.provider,
    contentType: dbRecord.content_type,
    data: dbRecord.record_data,
    aiSummary: dbRecord.ai_summary,
    medicalContent: dbRecord.medical_content
  };
};