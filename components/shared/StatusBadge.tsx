import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BrandColors, Typography } from '@/constants/Typography';
import { UrgencyLevel } from '@/types/health';

interface StatusBadgeProps {
  status: UrgencyLevel | string;
  size?: 'small' | 'medium' | 'large';
  showDot?: boolean;
  customColor?: string;
  customText?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'medium',
  showDot = true,
  customColor,
  customText
}) => {
  const getStatusColor = (status: string): string => {
    if (customColor) return customColor;
    
    switch (status) {
      case 'critical': return BrandColors.critical;
      case 'urgent': return BrandColors.urgent;
      case 'dueSoon': return BrandColors.dueSoon;
      case 'completed': return BrandColors.completed;
      case 'pending': return BrandColors.urgent;
      case 'overdue': return BrandColors.critical;
      case 'taken': return BrandColors.completed;
      case 'skipped': return BrandColors.neutral;
      default: return BrandColors.neutral;
    }
  };

  const getStatusText = (status: string): string => {
    if (customText) return customText;
    
    switch (status) {
      case 'critical': return 'Critical';
      case 'urgent': return 'Urgent';
      case 'dueSoon': return 'Due Soon';
      case 'completed': return 'Completed';
      case 'pending': return 'Pending';
      case 'overdue': return 'OVERDUE';
      case 'taken': return 'Taken';
      case 'skipped': return 'Skipped';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const color = getStatusColor(status);
  const text = getStatusText(status);
  
  const containerStyle = [
    styles.container,
    styles[`container_${size}`],
    { backgroundColor: `${color}15` }, // 15% opacity
    status === 'overdue' && styles.overdueBorder
  ];

  const dotStyle = [
    styles.dot,
    styles[`dot_${size}`],
    { backgroundColor: color }
  ];

  const textStyle = [
    styles.text,
    styles[`text_${size}`],
    { color: color },
    (status === 'overdue' || status === 'critical') && styles.boldText
  ];

  return (
    <View style={containerStyle}>
      {showDot && <View style={dotStyle} />}
      <Text style={textStyle}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  container_small: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  container_medium: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  container_large: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  overdueBorder: {
    borderWidth: 1,
    borderColor: BrandColors.critical,
  },
  dot: {
    borderRadius: 4,
    marginRight: 6,
  },
  dot_small: {
    width: 6,
    height: 6,
    marginRight: 4,
  },
  dot_medium: {
    width: 8,
    height: 8,
    marginRight: 6,
  },
  dot_large: {
    width: 10,
    height: 10,
    marginRight: 8,
  },
  text: {
    fontFamily: 'Outfit-Medium',
  },
  text_small: {
    fontSize: 10,
    lineHeight: 12,
  },
  text_medium: {
    fontSize: 12,
    lineHeight: 14,
  },
  text_large: {
    fontSize: 14,
    lineHeight: 16,
  },
  boldText: {
    fontFamily: 'Outfit-SemiBold',
  },
});