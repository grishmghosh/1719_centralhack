import React, { useEffect, useState } from 'react';
import { Platform, StatusBar as RNStatusBar, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type StatusBarStyle = 'auto' | 'light' | 'dark';

interface StatusBarManagerProps {
  style?: StatusBarStyle;
  backgroundColor?: string;
  translucent?: boolean;
  animated?: boolean;
}

export default function StatusBarManager({ 
  style = 'dark', 
  backgroundColor = 'transparent',
  translucent = true,
  animated = true 
}: StatusBarManagerProps) {
  const insets = useSafeAreaInsets();
  const [currentStyle, setCurrentStyle] = useState<StatusBarStyle>(style);

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Android-specific configurations
      RNStatusBar.setTranslucent(translucent);
      RNStatusBar.setBackgroundColor(backgroundColor, animated);
      
      // Ensure proper status bar content based on background
      if (backgroundColor === 'transparent' || backgroundColor === '#FFFFFF') {
        setCurrentStyle('dark');
      } else {
        setCurrentStyle('light');
      }
    } else {
      // iOS uses the style prop directly
      setCurrentStyle(style);
    }
  }, [style, backgroundColor, translucent, animated]);

  return (
    <>
      <StatusBar 
        style={currentStyle} 
        backgroundColor={backgroundColor}
        translucent={translucent}
        animated={animated}
      />
      {/* Android status bar spacing compensation */}
      {Platform.OS === 'android' && translucent && (
        <View style={{ height: RNStatusBar.currentHeight || 24 }} />
      )}
    </>
  );
}

// Utility function to get safe status bar height
export function getStatusBarHeight(): number {
  if (Platform.OS === 'ios') {
    return 0; // iOS handles this automatically with SafeAreaView
  }
  return RNStatusBar.currentHeight || 24;
}

// Pre-configured status bar themes
export const StatusBarThemes = {
  light: {
    style: 'dark' as StatusBarStyle,
    backgroundColor: '#FFFFFF',
  },
  dark: {
    style: 'light' as StatusBarStyle,
    backgroundColor: '#000000',
  },
  primary: {
    style: 'light' as StatusBarStyle,
    backgroundColor: '#14A085',
  },
  transparent: {
    style: 'dark' as StatusBarStyle,
    backgroundColor: 'transparent',
  },
  medical: {
    style: 'light' as StatusBarStyle,
    backgroundColor: '#2563EB', // Medical blue
  }
};