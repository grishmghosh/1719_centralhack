/**
 * Profile Settings Hook
 * 
 * Manages user profile settings with persistence and validation
 */

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface NotificationSettings {
  appointment_alerts: {
    enabled: boolean;
    reminder_time: string;
  };
  medicine_reminder_alerts: {
    enabled: boolean;
    reminder_time: string;
  };
  emergency_contact_alerts: {
    enabled: boolean;
    action: string;
  };
  critical_health_alerts: {
    enabled: boolean;
    alert_type: string;
  };
  ai_health_wellness_reminders: {
    enabled: boolean;
    reminders: Array<{
      type: string;
      reminder_time: string;
      enabled?: boolean;
    }>;
  };
}

interface PrivacySecuritySettings {
  data_sharing: 'enabled' | 'disabled';
  security_settings: string;
}

interface AccessibilitySettings {
  font_size: 'small' | 'medium' | 'large' | 'extra_large';
  high_contrast: boolean;
  screen_reader_hints: boolean;
  reduce_motion: boolean;
  voice_settings: 'enabled' | 'disabled';
}

interface LanguageSettings {
  current_language: string;
}

interface HelpSupportSettings {
  faq_link: string;
  support_contact: string;
}

export interface ProfileSettings {
  notifications: NotificationSettings;
  privacy_security: PrivacySecuritySettings;
  accessibility: AccessibilitySettings;
  language: LanguageSettings;
  help_support: HelpSupportSettings;
}

const DEFAULT_SETTINGS: ProfileSettings = {
  notifications: {
    appointment_alerts: {
      enabled: true,
      reminder_time: "24 hours before"
    },
    medicine_reminder_alerts: {
      enabled: true,
      reminder_time: "timely"
    },
    emergency_contact_alerts: {
      enabled: true,
      action: "Notify emergency contacts in case of urgent health events"
    },
    critical_health_alerts: {
      enabled: true,
      alert_type: "lab results, abnormal vitals"
    },
    ai_health_wellness_reminders: {
      enabled: true,
      reminders: [
        {
          type: "drink_water",
          reminder_time: "every 2 hours",
          enabled: true
        },
        {
          type: "take_a_walk",
          reminder_time: "every 4 hours",
          enabled: true
        },
        {
          type: "stretch",
          reminder_time: "every 1 hour",
          enabled: true
        }
      ]
    }
  },
  privacy_security: {
    data_sharing: "enabled",
    security_settings: "2FA enabled"
  },
  accessibility: {
    font_size: "medium",
    high_contrast: false,
    screen_reader_hints: false,
    reduce_motion: false,
    voice_settings: "enabled"
  },
  language: {
    current_language: "en"
  },
  help_support: {
    faq_link: "https://example.com/faq",
    support_contact: "support@example.com"
  }
};

const STORAGE_KEY = '@profile_settings';

export function useProfileSettings() {
  const [settings, setSettings] = useState<ProfileSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings from storage on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const storedSettings = await AsyncStorage.getItem(STORAGE_KEY);
      
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        // Merge with defaults to ensure all properties exist
        setSettings(mergeWithDefaults(parsedSettings, DEFAULT_SETTINGS));
      }
    } catch (err) {
      console.error('Failed to load profile settings:', err);
      setError('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: ProfileSettings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setError(null);
    } catch (err) {
      console.error('Failed to save profile settings:', err);
      setError('Failed to save settings');
      throw err;
    }
  };

  const updateSetting = useCallback(async (path: string, value: any) => {
    try {
      const newSettings = { ...settings };
      const pathParts = path.split('.');
      
      // Navigate to the nested property
      let current: any = newSettings;
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) {
          current[pathParts[i]] = {};
        }
        current = current[pathParts[i]];
      }
      
      // Set the value
      current[pathParts[pathParts.length - 1]] = value;
      
      setSettings(newSettings);
      await saveSettings(newSettings);
    } catch (err) {
      console.error('Failed to update setting:', err);
      setError('Failed to update setting');
    }
  }, [settings]);

  const resetToDefaults = useCallback(async () => {
    try {
      setSettings(DEFAULT_SETTINGS);
      await saveSettings(DEFAULT_SETTINGS);
    } catch (err) {
      console.error('Failed to reset settings:', err);
      setError('Failed to reset settings');
    }
  }, []);

  const toggleNotification = useCallback(async (category: keyof NotificationSettings, enabled: boolean) => {
    await updateSetting(`notifications.${category}.enabled`, enabled);
  }, [updateSetting]);

  const updateReminderTime = useCallback(async (category: string, time: string) => {
    await updateSetting(`notifications.${category}.reminder_time`, time);
  }, [updateSetting]);

  const updateAccessibilitySetting = useCallback(async (setting: keyof AccessibilitySettings, value: any) => {
    await updateSetting(`accessibility.${setting}`, value);
  }, [updateSetting]);

  const updateLanguage = useCallback(async (language: string) => {
    await updateSetting('language.current_language', language);
  }, [updateSetting]);

  // Helper function to merge settings with defaults
  const mergeWithDefaults = (stored: any, defaults: ProfileSettings): ProfileSettings => {
    const merged = { ...defaults };
    
    if (stored.notifications) {
      merged.notifications = { ...defaults.notifications, ...stored.notifications };
      
      // Ensure wellness reminders have the enabled property
      if (stored.notifications.ai_health_wellness_reminders?.reminders) {
        merged.notifications.ai_health_wellness_reminders.reminders = 
          defaults.notifications.ai_health_wellness_reminders.reminders.map(defaultReminder => {
            const storedReminder = stored.notifications.ai_health_wellness_reminders.reminders
              .find((r: any) => r.type === defaultReminder.type);
            return storedReminder ? { ...defaultReminder, ...storedReminder } : defaultReminder;
          });
      }
    }
    
    if (stored.privacy_security) {
      merged.privacy_security = { ...defaults.privacy_security, ...stored.privacy_security };
    }
    
    if (stored.accessibility) {
      merged.accessibility = { ...defaults.accessibility, ...stored.accessibility };
    }
    
    if (stored.language) {
      merged.language = { ...defaults.language, ...stored.language };
    }
    
    if (stored.help_support) {
      merged.help_support = { ...defaults.help_support, ...stored.help_support };
    }
    
    return merged;
  };

  return {
    settings,
    isLoading,
    error,
    updateSetting,
    resetToDefaults,
    toggleNotification,
    updateReminderTime,
    updateAccessibilitySetting,
    updateLanguage,
    
    // Convenience getters
    isNotificationEnabled: (category: keyof NotificationSettings) => 
      settings.notifications[category]?.enabled || false,
    
    getReminderTime: (category: string) => 
      (settings.notifications as any)[category]?.reminder_time || '',
    
    getAccessibilitySetting: (setting: keyof AccessibilitySettings) => 
      settings.accessibility[setting],
    
    getCurrentLanguage: () => settings.language.current_language,
    
    isDataSharingEnabled: () => settings.privacy_security.data_sharing === 'enabled',
  };
}

// Export types for use in components
export type {
  NotificationSettings,
  PrivacySecuritySettings,
  AccessibilitySettings,
  LanguageSettings,
  HelpSupportSettings,
};
