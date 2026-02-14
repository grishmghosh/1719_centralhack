import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';
import { 
  ArrowLeft, 
  CircleHelp as HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail, 
  Book, 
  FileText, 
  ExternalLink,
  Send,
  Star,
  ChevronRight,
  Search
} from 'lucide-react-native';
import { router } from 'expo-router';
import { BrandColors, Typography } from '@/constants/Typography';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

// Design System Constants
const IconSizes = {
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 28,
};

const STROKE_WIDTH = 1.5;

const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const BorderRadius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
};

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function HelpSupportScreen() {
  const [feedbackText, setFeedbackText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const cardScale = useSharedValue(1);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const handleCardPress = () => {
    cardScale.value = withSpring(0.97, {
      duration: 120,
      dampingRatio: 0.8,
      stiffness: 400
    });
    setTimeout(() => {
      cardScale.value = withSpring(1, {
        duration: 200,
        dampingRatio: 0.7,
        stiffness: 300
      });
    }, 120);
  };

  const quickActions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      subtitle: 'Get instant help from our support team',
      color: BrandColors.primaryGreen,
      action: () => {
        Alert.alert('Live Chat', 'Opening live chat support...');
      },
    },
    {
      icon: Phone,
      title: 'Call Support',
      subtitle: 'Speak directly with a health tech specialist',
      color: BrandColors.deepTeal,
      action: () => {
        Alert.alert(
          'Call Support',
          'Would you like to call our support line?\n\n+1 (555) 123-4567\n\nHours: Mon-Fri 9AM-6PM EST',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Call Now',
              onPress: () => Linking.openURL('tel:+15551234567')
            }
          ]
        );
      },
    },
    {
      icon: Mail,
      title: 'Email Support',
      subtitle: 'Send us a detailed message about your issue',
      color: BrandColors.warning,
      action: () => {
        Linking.openURL('mailto:support@swasthio.com?subject=Swasthio App Support Request');
      },
    },
  ];

  const resources = [
    {
      icon: Book,
      title: 'User Guide',
      subtitle: 'Complete guide to using Swasthio',
      color: BrandColors.success,
      action: () => {
        Alert.alert('User Guide', 'Opening user guide in browser...');
      },
    },
    {
      icon: FileText,
      title: 'Privacy Policy',
      subtitle: 'How we protect your health data',
      color: BrandColors.mintGreen,
      action: () => {
        Alert.alert('Privacy Policy', 'Opening privacy policy...');
      },
    },
    {
      icon: FileText,
      title: 'Terms of Service',
      subtitle: 'Terms and conditions for using Swasthio',
      color: BrandColors.deepTeal,
      action: () => {
        Alert.alert('Terms of Service', 'Opening terms of service...');
      },
    },
  ];

  const faqItems: FAQItem[] = [
    {
      category: 'Account',
      question: 'How do I reset my password?',
      answer: 'You can reset your password by going to Settings > Account Settings > Change Password, or by using the "Forgot Password" link on the login screen.'
    },
    {
      category: 'Health Data',
      question: 'Is my health data secure?',
      answer: 'Yes, we use industry-standard encryption and comply with HIPAA regulations. Your data is stored securely and never shared without your explicit consent.'
    },
    {
      category: 'Family',
      question: 'How do I add family members?',
      answer: 'Go to the Family tab and tap "Add Family Member". You can invite them via email or add their information manually if they\'re a dependent.'
    },
    {
      category: 'Records',
      question: 'Can I upload medical documents?',
      answer: 'Yes, you can upload medical documents, lab results, and prescriptions through the Records tab. Our AI will help extract key information automatically.'
    },
    {
      category: 'Notifications',
      question: 'How do I manage medication reminders?',
      answer: 'Go to Settings > Notifications to customize your medication reminders, appointment alerts, and health check-up notifications.'
    },
    {
      category: 'Accessibility',
      question: 'Does the app support accessibility features?',
      answer: 'Yes, we support voice-over, large text, high contrast mode, and other accessibility features. Check Settings > Accessibility for all options.'
    },
    {
      category: 'Health Data',
      question: 'My diabetes readings seem off, what should I do?',
      answer: 'Based on your profile showing diabetes management, please double-check your glucose meter calibration and ensure you\'re testing at the right times. Contact your doctor if readings remain concerning.'
    },
    {
      category: 'Emergency',
      question: 'How do emergency contacts get notified?',
      answer: 'Your emergency contacts (currently Rajesh Patel and Dr. Priya Sharma) will be automatically notified if you trigger an emergency alert or if critical health readings are detected.'
    },
  ];

  const handleSubmitFeedback = () => {
    if (feedbackText.trim()) {
      Alert.alert(
        'Feedback Submitted',
        'Thank you for your feedback! We\'ll review it and get back to you if needed.',
        [
          {
            text: 'OK',
            onPress: () => setFeedbackText('')
          }
        ]
      );
    } else {
      Alert.alert('Empty Feedback', 'Please enter some feedback before submitting.');
    }
  };

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  const filteredFAQs = faqItems.filter(item =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient
      colors={[BrandColors.cream, '#F8F4EB', '#F6F2E9', BrandColors.cream]}
      locations={[0, 0.3, 0.7, 1]}
      style={styles.container}>
      
      {/* Header */}
      <Animated.View 
        entering={FadeInDown.delay(100).springify()}
        style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}>
          <ArrowLeft size={IconSizes.large} color={BrandColors.textPrimary} strokeWidth={STROKE_WIDTH} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.headerRight} />
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Quick Actions */}
        <Animated.View
          entering={FadeInUp.delay(200).springify()}
          style={styles.section}>
          <View style={styles.sectionHeader}>
            <HelpCircle size={IconSizes.large} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.sectionTitle}>Get Quick Help</Text>
          </View>
          
          <View style={styles.actionsList}>
            {quickActions.map((action, index) => (
              <AnimatedTouchableOpacity
                key={index}
                entering={FadeInUp.delay(300 + index * 100).springify()}
                style={[styles.actionCard, animatedCardStyle]}
                onPress={() => {
                  handleCardPress();
                  action.action();
                }}>
                <View style={styles.cardContainer}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                    style={styles.actionGradient}>
                    <View style={styles.actionContent}>
                      <View style={styles.actionInfo}>
                        <View style={[styles.actionIcon, { backgroundColor: `${action.color}15` }]}>
                          <action.icon size={IconSizes.medium} color={action.color} strokeWidth={STROKE_WIDTH} />
                        </View>
                        <View style={styles.actionText}>
                          <Text style={styles.actionTitle}>{action.title}</Text>
                          <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                        </View>
                      </View>
                      <ChevronRight size={IconSizes.medium} color={BrandColors.textTertiary} strokeWidth={STROKE_WIDTH} />
                    </View>
                  </LinearGradient>
                </View>
              </AnimatedTouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* FAQ Section */}
        <Animated.View
          entering={FadeInUp.delay(400).springify()}
          style={styles.section}>
          <View style={styles.sectionHeader}>
            <Search size={IconSizes.large} color={BrandColors.deepTeal} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={IconSizes.medium} color={BrandColors.textSecondary} strokeWidth={STROKE_WIDTH} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search FAQ..."
                placeholderTextColor={BrandColors.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
          
          <View style={styles.faqList}>
            {filteredFAQs.map((faq, index) => (
              <AnimatedTouchableOpacity
                key={index}
                entering={FadeInUp.delay(500 + index * 50).springify()}
                style={[styles.faqCard, animatedCardStyle]}
                onPress={() => {
                  handleCardPress();
                  toggleFAQ(index);
                }}>
                <View style={styles.cardContainer}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                    style={styles.faqGradient}>
                    <View style={styles.faqHeader}>
                      <View style={styles.faqInfo}>
                        <Text style={styles.faqCategory}>{faq.category}</Text>
                        <Text style={styles.faqQuestion}>{faq.question}</Text>
                      </View>
                      <ChevronRight 
                        size={IconSizes.medium} 
                        color={BrandColors.textTertiary} 
                        strokeWidth={STROKE_WIDTH}
                        style={{
                          transform: [{ rotate: expandedFAQ === index ? '90deg' : '0deg' }]
                        }}
                      />
                    </View>
                    {expandedFAQ === index && (
                      <View style={styles.faqAnswer}>
                        <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                      </View>
                    )}
                  </LinearGradient>
                </View>
              </AnimatedTouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Resources */}
        <Animated.View
          entering={FadeInUp.delay(600).springify()}
          style={styles.section}>
          <View style={styles.sectionHeader}>
            <Book size={IconSizes.large} color={BrandColors.warning} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.sectionTitle}>Resources</Text>
          </View>
          
          <View style={styles.resourcesList}>
            {resources.map((resource, index) => (
              <AnimatedTouchableOpacity
                key={index}
                entering={FadeInUp.delay(700 + index * 100).springify()}
                style={[styles.resourceCard, animatedCardStyle]}
                onPress={() => {
                  handleCardPress();
                  resource.action();
                }}>
                <View style={styles.cardContainer}>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                    style={styles.resourceGradient}>
                    <View style={styles.resourceContent}>
                      <View style={styles.resourceInfo}>
                        <View style={[styles.resourceIcon, { backgroundColor: `${resource.color}15` }]}>
                          <resource.icon size={IconSizes.medium} color={resource.color} strokeWidth={STROKE_WIDTH} />
                        </View>
                        <View style={styles.resourceText}>
                          <Text style={styles.resourceTitle}>{resource.title}</Text>
                          <Text style={styles.resourceSubtitle}>{resource.subtitle}</Text>
                        </View>
                      </View>
                      <ExternalLink size={IconSizes.medium} color={BrandColors.textTertiary} strokeWidth={STROKE_WIDTH} />
                    </View>
                  </LinearGradient>
                </View>
              </AnimatedTouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Feedback */}
        <Animated.View
          entering={FadeInUp.delay(800).springify()}
          style={styles.section}>
          <View style={styles.sectionHeader}>
            <Star size={IconSizes.large} color={BrandColors.success} strokeWidth={STROKE_WIDTH} />
            <Text style={styles.sectionTitle}>Send Feedback</Text>
          </View>
          
          <AnimatedTouchableOpacity
            entering={FadeInUp.delay(900).springify()}
            style={[styles.feedbackCard, animatedCardStyle]}
            onPress={handleCardPress}>
            <View style={styles.cardContainer}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                style={styles.feedbackGradient}>
                <Text style={styles.feedbackLabel}>Help us improve Swasthio</Text>
                <TextInput
                  style={styles.feedbackInput}
                  placeholder="Share your thoughts, suggestions, or report issues..."
                  placeholderTextColor={BrandColors.textSecondary}
                  value={feedbackText}
                  onChangeText={setFeedbackText}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmitFeedback}>
                  <Send size={IconSizes.medium} color={BrandColors.white} strokeWidth={STROKE_WIDTH} />
                  <Text style={styles.submitButtonText}>Submit Feedback</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </AnimatedTouchableOpacity>
        </Animated.View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BrandColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    ...Typography.heading.medium,
    color: BrandColors.textPrimary,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.heading.small,
    color: BrandColors.textPrimary,
    marginLeft: Spacing.sm,
  },
  actionsList: {
    gap: Spacing.sm,
  },
  actionCard: {
    borderRadius: BorderRadius.md,
    shadowColor: BrandColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContainer: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  actionGradient: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    ...Typography.ui.label,
    color: BrandColors.textPrimary,
    marginBottom: 2,
  },
  actionSubtitle: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
  },
  searchContainer: {
    marginBottom: Spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    shadowColor: BrandColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: Spacing.sm,
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
  },
  faqList: {
    gap: Spacing.sm,
  },
  faqCard: {
    borderRadius: BorderRadius.md,
    shadowColor: BrandColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  faqGradient: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqInfo: {
    flex: 1,
  },
  faqCategory: {
    ...Typography.body.small,
    color: BrandColors.primaryGreen,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  faqQuestion: {
    ...Typography.ui.label,
    color: BrandColors.textPrimary,
  },
  faqAnswer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: `${BrandColors.textTertiary}20`,
  },
  faqAnswerText: {
    ...Typography.body.medium,
    color: BrandColors.textSecondary,
    lineHeight: 22,
  },
  resourcesList: {
    gap: Spacing.sm,
  },
  resourceCard: {
    borderRadius: BorderRadius.md,
    shadowColor: BrandColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resourceGradient: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  resourceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resourceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  resourceText: {
    flex: 1,
  },
  resourceTitle: {
    ...Typography.ui.label,
    color: BrandColors.textPrimary,
    marginBottom: 2,
  },
  resourceSubtitle: {
    ...Typography.body.small,
    color: BrandColors.textSecondary,
  },
  feedbackCard: {
    borderRadius: BorderRadius.md,
    shadowColor: BrandColors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  feedbackGradient: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  feedbackLabel: {
    ...Typography.ui.label,
    color: BrandColors.textPrimary,
    marginBottom: Spacing.sm,
  },
  feedbackInput: {
    backgroundColor: `${BrandColors.textTertiary}10`,
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
    ...Typography.body.medium,
    color: BrandColors.textPrimary,
    minHeight: 100,
    marginBottom: Spacing.md,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BrandColors.primaryGreen,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  submitButtonText: {
    ...Typography.ui.button,
    color: BrandColors.white,
    marginLeft: Spacing.sm,
  },
  bottomSpacing: {
    height: 40,
  },
});