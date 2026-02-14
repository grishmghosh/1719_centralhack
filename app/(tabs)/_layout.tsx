import React, { useEffect, useRef } from 'react';
import { Tabs } from 'expo-router';
import { Home, FileText, Users, Heart } from 'lucide-react-native';
import { Platform, View, Dimensions, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate
} from 'react-native-reanimated';
import { useQRScanner } from '@/contexts/QRScannerContext';

// Brand Colors
const BrandColors = {
  primaryGreen: '#14A085',
  deepTeal: '#0D7377',
  textSecondary: '#555555',
  white: '#FFFFFF',
};

// Custom Tab Bar with Sliding Animation
function CustomTabBar({ state, descriptors, navigation }: any) {
  const { isQRScannerOpen, isMedicalSharingOpen } = useQRScanner();
  
  // Hide tab bar when QR scanner OR medical sharing is open
  if (isQRScannerOpen || isMedicalSharingOpen) {
    return null;
  }

  const screenWidth = Dimensions.get('window').width;
  const dockWidth = screenWidth * 0.7; // 70% of screen width
  const containerPadding = 20; // paddingHorizontal of the tab container
  const availableWidth = dockWidth - (containerPadding * 2); // Width available for tabs
  const tabWidth = availableWidth / 4; // 4 tabs
  const highlightPosition = useSharedValue(0);

  useEffect(() => {
    // Calculate the exact center position of each tab - more precise calculation
    const exactTabWidth = availableWidth / 4;
    const tabCenterOffset = exactTabWidth / 2;
    const circleOffset = 22; // Half of 44px circle
    
    // Start from container padding, add tab center offset, then multiply by index
    const targetPosition = containerPadding + tabCenterOffset + (state.index * exactTabWidth) - circleOffset;
    
    highlightPosition.value = withSpring(targetPosition, {
      damping: 25, // Increased damping for less oscillation
      stiffness: 300, // Higher stiffness for snappier movement
      mass: 0.8, // Lower mass for quicker response
    });
  }, [state.index, tabWidth, availableWidth]);

  const animatedHighlightStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: highlightPosition.value }],
  }));

  const tabs = [
    { name: 'index', icon: Home, label: 'Home' },
    { name: 'records', icon: FileText, label: 'Records' },
    { name: 'community', icon: Users, label: 'Community' },
    { name: 'family', icon: Heart, label: 'Family' },
  ];

  return (
    <View style={{
      position: 'absolute',
      bottom: 30,
      left: '15%',
      right: '15%',
      height: 70,
      borderRadius: 25,
      shadowColor: BrandColors.deepTeal,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    }}>
      <BlurView
        intensity={80}
        tint="light"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderRadius: 25,
          overflow: 'hidden',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
        }}
      />

      {/* Sliding Highlight */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 13,
            left: 0, // Start at 0, let translateX handle all positioning
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(20, 160, 133, 0.25)', // Green hue instead of pure white
            shadowColor: 'rgba(20, 160, 133, 0.3)',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.6,
            shadowRadius: 4,
            elevation: 3,
          },
          animatedHighlightStyle,
        ]}
      />

      {/* Tab Buttons */}
      <View style={{
        flexDirection: 'row',
        height: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
      }}>
        {tabs.map((tab, index) => {
          const isFocused = state.index === index;
          const IconComponent = tab.icon;

          return (
            <TouchableOpacity
              key={tab.name}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: state.routes[index].key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(state.routes[index].name);
                }
              }}
            >
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                }}
              >
                <IconComponent
                  size={24}
                  color={isFocused ? BrandColors.primaryGreen : BrandColors.textSecondary}
                  strokeWidth={2}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="records" />
      <Tabs.Screen name="community" />
      <Tabs.Screen name="family" />
    </Tabs>
  );
}