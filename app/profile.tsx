import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    FadeInUp,
    FadeInDown,
} from 'react-native-reanimated';
import { User, Settings, Bell, Shield, Globe, Accessibility, CircleHelp as HelpCircle, LogOut, ChevronRight, Smartphone, Moon, UserCog, ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { BrandColors, Typography } from '@/constants/Typography';

// Consistent Design System (matching homepage)
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

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function ProfileScreen() {
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

    const handleSignOut = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: () => {
                        Alert.alert('Sign Out', 'You have been signed out.');
                        // Here you would typically handle the actual sign out logic
                    }
                }
            ]
        );
    };

    const profileSettings = [
        {
            icon: UserCog,
            title: 'Account Settings',
            subtitle: 'Edit profile, emergency contacts, password',
            color: '#6B7280',
            onPress: () => router.push('/account-settings'),
        },
        {
            icon: Bell,
            title: 'Notifications',
            subtitle: 'Manage alerts and reminders',
            color: '#F59E0B',
            onPress: () => router.push('/notification-settings'),
        },
        {
            icon: Shield,
            title: 'Privacy & Security',
            subtitle: 'Data sharing, permissions, security',
            color: '#10B981',
            onPress: () => router.push('/privacy-security'),
        },
        {
            icon: Accessibility,
            title: 'Accessibility',
            subtitle: 'Voice, display, interaction settings',
            color: '#8B5CF6',
            onPress: () => router.push('/accessibility'),
        },
        {
            icon: Globe,
            title: 'Language',
            subtitle: 'App language and region settings',
            color: '#14B8A6',
            onPress: () => router.push('/language-settings'),
        },
        {
            icon: HelpCircle,
            title: 'Help & Support',
            subtitle: 'FAQ, contact us, feedback',
            color: '#0066CC',
            onPress: () => router.push('/help-support'),
        },
    ];

    return (
        <LinearGradient
            colors={[BrandColors.cream, '#F8F4EB', '#F6F2E9', BrandColors.cream]}
            locations={[0, 0.3, 0.7, 1]}
            style={styles.container}>

            {/* Header */}
            <Animated.View
                entering={FadeInDown.delay(50).springify()}
                style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}>
                    <ArrowLeft size={IconSizes.large} color={BrandColors.textPrimary} strokeWidth={STROKE_WIDTH} />
                </TouchableOpacity>
            </Animated.View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}>

                {/* Profile Header */}
                <Animated.View
                    entering={FadeInDown.delay(100).springify()}
                    style={styles.profileHeader}>
                    <View style={styles.cardContainer}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                            style={styles.profileGradient}>
                            <View style={styles.avatarContainer}>
                                <LinearGradient
                                    colors={[BrandColors.deepTeal, BrandColors.primaryGreen]}
                                    style={styles.avatar}>
                                    <Text style={styles.avatarText}>SC</Text>
                                </LinearGradient>
                            </View>
                            <Text style={styles.profileName}>Sarah Chen</Text>
                            <Text style={styles.profileEmail}>sarah.chen@email.com</Text>
                            <View style={styles.profileStats}>
                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>47</Text>
                                    <Text style={styles.statLabel}>Records</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>3</Text>
                                    <Text style={styles.statLabel}>Family Members</Text>
                                </View>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statNumber}>2</Text>
                                    <Text style={styles.statLabel}>Communities</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                </Animated.View>

                {/* Settings Menu */}
                <Animated.View
                    entering={FadeInUp.delay(200).springify()}
                    style={styles.section}>
                    <Text style={styles.sectionTitle}>Settings</Text>
                    <View style={styles.settingsList}>
                        {profileSettings.map((setting, index) => (
                            <Animated.View
                                key={index}
                                entering={FadeInUp.delay(250 + index * 50).springify()}>
                                <AnimatedTouchableOpacity
                                    style={[styles.settingCard, animatedCardStyle]}
                                    onPress={() => {
                                        handleCardPress();
                                        setting.onPress?.();
                                    }}>
                                    <View style={styles.cardContainer}>
                                        <LinearGradient
                                            colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                                            style={styles.settingGradient}>
                                            <View style={styles.iconContainer}>
                                                <LinearGradient
                                                    colors={[`${setting.color}20`, `${setting.color}10`]}
                                                    style={styles.iconGradient}>
                                                    <setting.icon size={IconSizes.large} color={setting.color} strokeWidth={STROKE_WIDTH} />
                                                </LinearGradient>
                                            </View>
                                            <View style={styles.settingContent}>
                                                <Text style={styles.settingTitle}>{setting.title}</Text>
                                                <Text style={styles.settingSubtitle}>{setting.subtitle}</Text>
                                            </View>
                                            <ChevronRight size={IconSizes.medium} color={BrandColors.textSecondary} strokeWidth={STROKE_WIDTH} />
                                        </LinearGradient>
                                    </View>
                                </AnimatedTouchableOpacity>
                            </Animated.View>
                        ))}
                    </View>
                </Animated.View>

                {/* Quick Settings */}
                <Animated.View
                    entering={FadeInUp.delay(500).springify()}
                    style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Settings</Text>
                    <AnimatedTouchableOpacity
                        style={[styles.quickSettingsCard, animatedCardStyle]}
                        onPress={handleCardPress}>
                        <View style={styles.cardContainer}>
                            <LinearGradient
                                colors={['rgba(255, 255, 255, 0.95)', 'rgba(255, 255, 255, 0.85)']}
                                style={styles.quickSettingsGradient}>
                                <View style={styles.toggleItem}>
                                    <View style={styles.toggleInfo}>
                                        <View style={styles.toggleIconContainer}>
                                            <Moon size={IconSizes.medium} color={BrandColors.textSecondary} strokeWidth={STROKE_WIDTH} />
                                        </View>
                                        <Text style={styles.toggleTitle}>Dark Mode</Text>
                                    </View>
                                    <Switch
                                        value={false}
                                        onValueChange={() => { }}
                                        trackColor={{ false: `${BrandColors.textTertiary}30`, true: `${BrandColors.primaryGreen}40` }}
                                        thumbColor={BrandColors.textSecondary}
                                        ios_backgroundColor={`${BrandColors.textTertiary}30`}
                                    />
                                </View>
                                <View style={styles.toggleDivider} />
                                <View style={styles.toggleItem}>
                                    <View style={styles.toggleInfo}>
                                        <View style={styles.toggleIconContainer}>
                                            <Smartphone size={IconSizes.medium} color={BrandColors.primaryGreen} strokeWidth={STROKE_WIDTH} />
                                        </View>
                                        <Text style={styles.toggleTitle}>Offline Mode</Text>
                                    </View>
                                    <Switch
                                        value={true}
                                        onValueChange={() => { }}
                                        trackColor={{ false: `${BrandColors.textTertiary}30`, true: `${BrandColors.primaryGreen}40` }}
                                        thumbColor={BrandColors.primaryGreen}
                                        ios_backgroundColor={`${BrandColors.textTertiary}30`}
                                    />
                                </View>
                            </LinearGradient>
                        </View>
                    </AnimatedTouchableOpacity>
                </Animated.View>

                {/* Sign Out */}
                <Animated.View
                    entering={FadeInUp.delay(600).springify()}
                    style={styles.section}>
                    <AnimatedTouchableOpacity
                        style={[styles.signOutCard, animatedCardStyle]}
                        onPress={() => {
                            handleCardPress();
                            handleSignOut();
                        }}>
                        <View style={styles.cardContainer}>
                            <LinearGradient
                                colors={['rgba(231, 111, 81, 0.08)', 'rgba(231, 111, 81, 0.04)']}
                                style={styles.signOutGradient}>
                                <View style={styles.iconContainer}>
                                    <LinearGradient
                                        colors={[`${BrandColors.error}20`, `${BrandColors.error}10`]}
                                        style={styles.iconGradient}>
                                        <LogOut size={IconSizes.large} color={BrandColors.error} strokeWidth={STROKE_WIDTH} />
                                    </LinearGradient>
                                </View>
                                <View style={styles.signOutContent}>
                                    <Text style={styles.signOutTitle}>Sign Out</Text>
                                    <Text style={styles.signOutSubtitle}>Sign out of your account</Text>
                                </View>
                                <ChevronRight size={IconSizes.medium} color={BrandColors.error} strokeWidth={STROKE_WIDTH} />
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingTop: 100,
        paddingHorizontal: Spacing.lg,
    },
    header: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        zIndex: 1,
        paddingHorizontal: Spacing.lg,
    },
    backButton: {
        padding: Spacing.sm,
    },
    profileHeader: {
        marginBottom: Spacing.xl,
    },
    cardContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        shadowColor: BrandColors.primaryGreen,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    profileGradient: {
        alignItems: 'center',
        padding: Spacing.xl,
    },
    avatarContainer: {
        marginBottom: Spacing.md,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        ...Typography.heading.large,
        color: 'white',
        fontSize: 28,
    },
    profileName: {
        ...Typography.heading.large,
        color: BrandColors.textPrimary,
        marginBottom: Spacing.xs,
    },
    profileEmail: {
        ...Typography.body.large,
        color: BrandColors.textSecondary,
        marginBottom: Spacing.lg,
    },
    profileStats: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        ...Typography.metric.large,
        color: BrandColors.textPrimary,
        marginBottom: Spacing.xs,
    },
    statLabel: {
        ...Typography.ui.caption,
        color: BrandColors.textSecondary,
        textAlign: 'center',
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: `${BrandColors.textTertiary}20`,
        marginHorizontal: Spacing.md,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        ...Typography.heading.small,
        color: BrandColors.textPrimary,
        marginBottom: Spacing.md,
        marginLeft: Spacing.sm,
    },
    settingsList: {
        gap: Spacing.md,
    },
    settingCard: {
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        shadowColor: BrandColors.primaryGreen,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    settingGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        marginRight: Spacing.md,
    },
    iconGradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingContent: {
        flex: 1,
        marginRight: Spacing.sm,
    },
    settingTitle: {
        ...Typography.heading.tiny,
        color: BrandColors.textPrimary,
        marginBottom: Spacing.xs,
    },
    settingSubtitle: {
        ...Typography.body.medium,
        color: BrandColors.textSecondary,
        lineHeight: 18,
    },
    quickSettingsCard: {
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        shadowColor: BrandColors.primaryGreen,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    quickSettingsGradient: {
        padding: Spacing.lg,
    },
    toggleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.sm,
    },
    toggleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    toggleIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: `${BrandColors.textTertiary}10`,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    toggleTitle: {
        ...Typography.ui.label,
        fontSize: 16,
        color: BrandColors.textPrimary,
    },
    toggleDivider: {
        height: 1,
        backgroundColor: `${BrandColors.textTertiary}15`,
        marginVertical: Spacing.sm,
    },
    signOutCard: {
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        shadowColor: BrandColors.error,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    signOutGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    signOutContent: {
        flex: 1,
        marginRight: Spacing.sm,
    },
    signOutTitle: {
        ...Typography.heading.tiny,
        color: BrandColors.error,
        marginBottom: Spacing.xs,
    },
    signOutSubtitle: {
        ...Typography.body.medium,
        color: BrandColors.textSecondary,
        lineHeight: 18,
    },
    bottomSpacing: {
        height: 120,
    },
});
