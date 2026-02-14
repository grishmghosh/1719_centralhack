import React from 'react';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

// Enhanced navigation utilities for Expo Router with smooth transitions
export const NavigationUtils = {
  // Navigate with haptic feedback and optimized timing
  push: (href: any, options?: { withHaptics?: boolean }) => {
    if (options?.withHaptics !== false) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Small delay to let haptics feel natural
    setTimeout(() => {
      router.push(href);
    }, Platform.select({ ios: 50, android: 30 }));
  },

  // Navigate back with haptic feedback
  back: (options?: { withHaptics?: boolean }) => {
    if (options?.withHaptics !== false) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setTimeout(() => {
      router.back();
    }, Platform.select({ ios: 30, android: 20 }));
  },

  // Replace current screen
  replace: (href: any, options?: { withHaptics?: boolean }) => {
    if (options?.withHaptics !== false) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setTimeout(() => {
      router.replace(href);
    }, Platform.select({ ios: 40, android: 25 }));
  },

  // Modal-style navigation with medium haptic
  presentModal: (href: any) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    setTimeout(() => {
      router.push(href);
    }, Platform.select({ ios: 70, android: 50 }));
  },

  // Dismiss modal with soft haptic
  dismissModal: () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    setTimeout(() => {
      router.back();
    }, Platform.select({ ios: 40, android: 30 }));
  },
};

// Page transition styles for consistent animations
export const PageTransitionStyles = {
  // Default page style for consistent backgrounds
  defaultPage: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Modal page style
  modalPage: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  // Medical page style
  medicalPage: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  // Emergency page style
  emergencyPage: {
    flex: 1,
    backgroundColor: '#FEF2F2',
  },

  // Settings page style
  settingsPage: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
};

// Screen transition configurations for different screen types
export const ScreenTransitionConfig = {
  // Standard navigation screens
  standard: {
    animation: 'slide_from_right',
    duration: Platform.select({ ios: 350, android: 300 }),
  },

  // Modal screens
  modal: {
    animation: 'slide_from_bottom',
    duration: Platform.select({ ios: 500, android: 400 }),
  },

  // Tab transitions
  tab: {
    animation: 'fade',
    duration: Platform.select({ ios: 250, android: 200 }),
  },

  // Settings/profile screens
  settings: {
    animation: 'slide_from_right',
    duration: Platform.select({ ios: 400, android: 350 }),
  },

  // Instant (no animation)
  instant: {
    animation: 'none',
    duration: 0,
  },
};

// Utility to create smooth navigation actions with visual feedback
export const createNavigationAction = (
  action: () => void,
  options: {
    hapticStyle?: Haptics.ImpactFeedbackStyle;
    delay?: number;
    withHaptics?: boolean;
  } = {}
) => {
  const {
    hapticStyle = Haptics.ImpactFeedbackStyle.Light,
    delay = Platform.select({ ios: 50, android: 30 }),
    withHaptics = true,
  } = options;

  return () => {
    if (withHaptics) {
      Haptics.impactAsync(hapticStyle);
    }

    if (delay && delay > 0) {
      setTimeout(action, delay);
    } else {
      action();
    }
  };
};

// Pre-configured navigation actions for common use cases
export const NavigationActions = {
  // Go to profile
  goToProfile: createNavigationAction(
    () => router.push('/profile'),
    { hapticStyle: Haptics.ImpactFeedbackStyle.Light }
  ),

  // Go to settings
  goToSettings: createNavigationAction(
    () => router.push('/account-settings'),
    { hapticStyle: Haptics.ImpactFeedbackStyle.Light }
  ),

  // Go to family member profile
  goToFamilyProfile: (id: string) => createNavigationAction(
    () => router.push(`/family-profile/${id}`),
    { hapticStyle: Haptics.ImpactFeedbackStyle.Light }
  ),

  // Present emergency screen
  presentEmergency: createNavigationAction(
    () => router.push('/emergency-profile'),
    { hapticStyle: Haptics.ImpactFeedbackStyle.Heavy, delay: 100 }
  ),

  // Go back with feedback
  goBack: createNavigationAction(
    () => router.back(),
    { hapticStyle: Haptics.ImpactFeedbackStyle.Light, delay: 30 }
  ),
};