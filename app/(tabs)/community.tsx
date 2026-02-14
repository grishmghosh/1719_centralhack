import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  FadeInUp,
  FadeInDown,
} from 'react-native-reanimated';
import {
  MessageCircle,
  Users,
  Heart,
  Activity,
  Brain,
  Eye,
  TrendingUp,
  Star,
} from 'lucide-react-native';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function CommunityScreen() {
  const cardScale = useSharedValue(1);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const handleCardPress = () => {
    cardScale.value = withSpring(0.95, { duration: 150 });
    setTimeout(() => {
      cardScale.value = withSpring(1, { duration: 150 });
    }, 150);
  };

  const communityGroups = [
    {
      id: 1,
      name: 'Diabetes Support',
      members: 1247,
      icon: Activity,
      color: '#0066CC',
      isJoined: true,
      recentActivity: '12 new posts',
    },
    {
      id: 2,
      name: 'Heart Health',
      members: 892,
      icon: Heart,
      color: '#EF4444',
      isJoined: false,
      recentActivity: '8 new posts',
    },
    {
      id: 3,
      name: 'Mental Wellness',
      members: 634,
      icon: Brain,
      color: '#8B5CF6',
      isJoined: true,
      recentActivity: '15 new posts',
    },
    {
      id: 4,
      name: 'Senior Care',
      members: 456,
      icon: Users,
      color: '#10B981',
      isJoined: false,
      recentActivity: '6 new posts',
    },
  ];

  const trendingTopics = [
    { title: 'Managing Blood Sugar Levels', replies: 23, icon: TrendingUp },
    { title: 'Exercise for Seniors', replies: 18, icon: Activity },
    { title: 'Medication Side Effects', replies: 31, icon: Eye },
  ];

  return (
    <LinearGradient
      colors={['#F0F9FF', '#E0F2FE', '#BAE6FD']}
      style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <Animated.View 
          entering={FadeInDown.delay(100).springify()}
          style={styles.header}>
          <Text style={styles.title}>Community</Text>
          <Text style={styles.subtitle}>Connect with others on similar health journeys</Text>
        </Animated.View>

        {/* My Groups Section */}
        <Animated.View 
          entering={FadeInUp.delay(200).springify()}
          style={styles.section}>
          <Text style={styles.sectionTitle}>My Groups</Text>
          <View style={styles.groupsList}>
            {communityGroups
              .filter(group => group.isJoined)
              .map((group, index) => (
                <Animated.View
                  key={group.id}
                  entering={FadeInUp.delay(300 + index * 100).springify()}>
                  <AnimatedTouchableOpacity
                    style={[styles.groupCard, animatedCardStyle]}
                    onPress={handleCardPress}>
                    <BlurView intensity={40} tint="light" style={styles.cardBlur}>
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                        style={styles.cardGradient}>
                        <View style={styles.groupHeader}>
                          <View style={[styles.groupIcon, { backgroundColor: `${group.color}15` }]}>
                            <group.icon size={24} color={group.color} strokeWidth={2} />
                          </View>
                          <View style={styles.groupInfo}>
                            <Text style={styles.groupName}>{group.name}</Text>
                            <Text style={styles.groupMembers}>{group.members} members</Text>
                          </View>
                          <View style={styles.joinedBadge}>
                            <Text style={styles.joinedText}>Joined</Text>
                          </View>
                        </View>
                        <View style={styles.activityIndicator}>
                          <MessageCircle size={16} color="#6B7280" strokeWidth={2} />
                          <Text style={styles.activityText}>{group.recentActivity}</Text>
                        </View>
                      </LinearGradient>
                    </BlurView>
                  </AnimatedTouchableOpacity>
                </Animated.View>
              ))}
          </View>
        </Animated.View>

        {/* Trending Topics */}
        <Animated.View 
          entering={FadeInUp.delay(600).springify()}
          style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Topics</Text>
          <AnimatedTouchableOpacity
            style={[styles.trendingCard, animatedCardStyle]}
            onPress={handleCardPress}>
            <BlurView intensity={35} tint="light" style={styles.cardBlur}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                style={styles.trendingGradient}>
                {trendingTopics.map((topic, index) => (
                  <View key={index} style={styles.topicItem}>
                    <View style={styles.topicIcon}>
                      <topic.icon size={18} color="#0066CC" strokeWidth={2} />
                    </View>
                    <View style={styles.topicContent}>
                      <Text style={styles.topicTitle}>{topic.title}</Text>
                      <Text style={styles.topicReplies}>{topic.replies} replies</Text>
                    </View>
                    <TrendingUp size={16} color="#10B981" strokeWidth={2} />
                  </View>
                ))}
              </LinearGradient>
            </BlurView>
          </AnimatedTouchableOpacity>
        </Animated.View>

        {/* Suggested Groups */}
        <Animated.View 
          entering={FadeInUp.delay(700).springify()}
          style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested Groups</Text>
          <View style={styles.suggestionsList}>
            {communityGroups
              .filter(group => !group.isJoined)
              .map((group, index) => (
                <Animated.View
                  key={group.id}
                  entering={FadeInUp.delay(800 + index * 100).springify()}>
                  <AnimatedTouchableOpacity
                    style={[styles.suggestionCard, animatedCardStyle]}
                    onPress={handleCardPress}>
                    <BlurView intensity={30} tint="light" style={styles.cardBlur}>
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)']}
                        style={styles.suggestionGradient}>
                        <View style={styles.suggestionHeader}>
                          <View style={[styles.suggestionIcon, { backgroundColor: `${group.color}15` }]}>
                            <group.icon size={20} color={group.color} strokeWidth={2} />
                          </View>
                          <View style={styles.suggestionInfo}>
                            <Text style={styles.suggestionName}>{group.name}</Text>
                            <Text style={styles.suggestionMembers}>{group.members} members</Text>
                          </View>
                          <TouchableOpacity style={styles.joinButton}>
                            <Text style={styles.joinButtonText}>Join</Text>
                          </TouchableOpacity>
                        </View>
                      </LinearGradient>
                    </BlurView>
                  </AnimatedTouchableOpacity>
                </Animated.View>
              ))}
          </View>
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
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 16,
  },
  groupsList: {
    gap: 16,
  },
  groupCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  cardBlur: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  joinedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  joinedText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  activityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginLeft: 8,
  },
  trendingCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },
  trendingGradient: {
    padding: 20,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(107, 114, 128, 0.1)',
  },
  topicIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 102, 204, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  topicContent: {
    flex: 1,
  },
  topicTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  topicReplies: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  suggestionsList: {
    gap: 12,
  },
  suggestionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  suggestionGradient: {
    padding: 16,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 2,
  },
  suggestionMembers: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  joinButton: {
    backgroundColor: '#0066CC',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  joinButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  bottomSpacing: {
    height: 120,
  },
});