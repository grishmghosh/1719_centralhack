/**
 * SATRONIS Demo Screen
 * 
 * Standalone demo screen for hackathon presentation
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SatronisDemo } from '@/components/SatronisDemo';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SatronisDemoScreen() {
  return (
    <LinearGradient
      colors={['#F0F9FF', '#E0F2FE', '#BAE6FD']}
      style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <SatronisDemo />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
});