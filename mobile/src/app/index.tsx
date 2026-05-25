import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  LayoutAnimation,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CircularProgress } from '@/components/CircularProgress';
import { Accordion } from '@/components/Accordion';
import { GuideModal } from '@/components/GuideModal';
import { roadmapData, RoadmapItem, RoadmapPhase } from '../data/roadmapData';

export default function HomeScreen() {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [selectedItem, setSelectedItem] = useState<RoadmapItem | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<RoadmapPhase | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Load progress from AsyncStorage on mount
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedProgress = await AsyncStorage.getItem('roadmap_progress_state');
        if (savedProgress) {
          setCheckedItems(JSON.parse(savedProgress));
        }
      } catch (e) {
        console.error('Failed to load progress', e);
      }
    };
    loadProgress();
  }, []);

  // Handle checking/unchecking items
  const toggleItem = async (itemId: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newChecked = {
      ...checkedItems,
      [itemId]: !checkedItems[itemId],
    };
    setCheckedItems(newChecked);
    try {
      await AsyncStorage.setItem('roadmap_progress_state', JSON.stringify(newChecked));
    } catch (e) {
      console.error('Failed to save progress', e);
    }
  };

  // Open guide modal
  const openGuide = (item: RoadmapItem, phase: RoadmapPhase) => {
    setSelectedItem(item);
    setSelectedPhase(phase);
    setModalVisible(true);
  };

  // Compute overall progress metrics
  let totalTopics = 0;
  let completedTopics = 0;

  roadmapData.forEach((phase) => {
    phase.items.forEach((item) => {
      totalTopics++;
      if (checkedItems[item.id]) {
        completedTopics++;
      }
    });
  });

  const overallPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  // Compute completed counts per phase
  const getPhaseCompletedCount = (phase: RoadmapPhase) => {
    let count = 0;
    phase.items.forEach((item) => {
      if (checkedItems[item.id]) count++;
    });
    return count;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoAndTitle}>
            <View style={styles.logoIcon}>
              <ThemedText style={styles.logoIconText}>⚡</ThemedText>
            </View>
            <ThemedText style={styles.headerTitle}>Roadmap</ThemedText>
          </View>
          <View style={styles.profileBadge}>
            <ThemedText style={styles.profileBadgeText}>DK</ThemedText>
          </View>
        </View>

        {/* Overall Progress Card */}
        <ThemedView style={styles.progressCard}>
          <View style={styles.progressLeft}>
            <ThemedText style={styles.progressCardLabel}>OVERALL PROGRESS</ThemedText>
            <ThemedText style={styles.progressFraction}>
              {completedTopics} <ThemedText style={styles.progressFractionMuted}>/ {totalTopics} Topics</ThemedText>
            </ThemedText>
          </View>
          <View style={styles.progressRight}>
            <CircularProgress percentage={overallPercentage} size={68} strokeWidth={6} />
          </View>
        </ThemedView>

        {/* Core Strategic Insight Card */}
        <ThemedView style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <ThemedText style={styles.insightIcon}>💡</ThemedText>
            <ThemedText style={styles.insightTitle}>CORE STRATEGIC INSIGHT</ThemedText>
          </View>
          <ThemedText style={styles.insightQuote}>
            "The safest engineer is the one who can <ThemedText style={styles.highlightText}>learn, adapt, debug, and think across systems</ThemedText>. AI replaces implementation, not judgment. Your goal is to become the engineer who orchestrates it."
          </ThemedText>
        </ThemedView>

        {/* Learning Path Header */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Learning Path</ThemedText>
        </View>

        {/* Phases Accordions */}
        {roadmapData.map((phase, phaseIdx) => {
          const completedCount = getPhaseCompletedCount(phase);
          const totalCount = phase.items.length;

          return (
            <Accordion
              key={phase.id}
              title={phase.title.split('—')[0].trim()}
              subtitle={phase.subtitle}
              badge={phase.badge}
              completedCount={completedCount}
              totalCount={totalCount}
              isInitialOpen={phaseIdx === 0} // Open first accordion by default
            >
              {/* List of items inside Accordion */}
              {phase.items.map((item) => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <View
                    key={item.id}
                    style={[styles.itemCard, isChecked && styles.itemCardCompleted]}
                  >
                    {/* Checkbox Trigger */}
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={styles.checkboxContainer}
                      onPress={() => toggleItem(item.id)}
                    >
                      <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
                        {isChecked && <ThemedText style={styles.checkmark}>✓</ThemedText>}
                      </View>
                    </TouchableOpacity>

                    {/* Middle Info */}
                    <View style={styles.itemInfo}>
                      <ThemedText style={[styles.itemTitleText, isChecked && styles.itemTextCompleted]}>
                        {item.title}
                      </ThemedText>
                      <ThemedText style={styles.itemDescText}>{item.desc}</ThemedText>
                      
                      {/* Tags */}
                      {item.tags && item.tags.length > 0 ? (
                        <View style={styles.itemTags}>
                          {item.tags.map((tag, tIdx) => (
                            <View key={tIdx} style={[styles.itemTag, tag === 'Critical' || tag === 'Danger' ? styles.tagCritical : styles.tagDefault]}>
                              <ThemedText style={styles.itemTagText}>{tag}</ThemedText>
                            </View>
                          ))}
                        </View>
                      ) : null}
                    </View>

                    {/* How to Learn Action Link */}
                    {item.guide && Object.keys(item.guide).length > 0 ? (
                      <TouchableOpacity
                        activeOpacity={0.6}
                        style={styles.guideLink}
                        onPress={() => openGuide(item, phase)}
                      >
                        <ThemedText style={styles.guideLinkText}>📖 Guide</ThemedText>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                );
              })}
            </Accordion>
          );
        })}

        {/* Bottom Milestone Card */}
        <ThemedView style={styles.milestoneCard}>
          <ThemedText style={styles.milestoneMuted}>NEXT MILESTONE</ThemedText>
          <ThemedText style={styles.milestoneTitle}>System Design Interview Prep</ThemedText>
        </ThemedView>

      </ScrollView>

      {/* Guide sliding details Modal Sheet */}
      {selectedItem && selectedPhase ? (
        <GuideModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          badge={selectedPhase.badge}
          title={selectedItem.title}
          desc={selectedItem.desc}
          tags={selectedItem.tags}
          guide={selectedItem.guide}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19', // Deep dark theme background
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  logoAndTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1d4ed8', // Dark blue
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIconText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f3f4f6',
  },
  profileBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1f2937',
    borderWidth: 1.5,
    borderColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#3b82f6',
  },
  progressCard: {
    backgroundColor: '#161e2e',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressLeft: {
    justifyContent: 'center',
  },
  progressCardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 0.8,
  },
  progressFraction: {
    fontSize: 24,
    fontWeight: '800',
    color: '#f3f4f6',
    marginTop: 4,
  },
  progressFractionMuted: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  progressRight: {
    justifyContent: 'center',
  },
  insightCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.06)', // Ambient blue tint
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.15)',
    padding: 16,
    marginBottom: 24,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  insightIcon: {
    fontSize: 16,
  },
  insightTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#60a5fa',
    letterSpacing: 0.8,
  },
  insightQuote: {
    fontSize: 13,
    lineHeight: 18,
    color: '#d1d5db',
  },
  highlightText: {
    fontWeight: '700',
    color: '#60a5fa',
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f3f4f6',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161e2e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    marginBottom: 10,
  },
  itemCardCompleted: {
    borderColor: 'rgba(16, 185, 129, 0.2)',
    backgroundColor: '#0f172a',
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4b5563',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 8,
  },
  itemTitleText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f3f4f6',
  },
  itemTextCompleted: {
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  itemDescText: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 2,
  },
  itemTags: {
    flexDirection: 'row',
    marginTop: 6,
    flexWrap: 'wrap',
    gap: 6,
  },
  itemTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagCritical: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  tagDefault: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  itemTagText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#3b82f6',
  },
  guideLink: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
  },
  guideLinkText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3b82f6',
  },
  milestoneCard: {
    backgroundColor: '#161e2e',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderStyle: 'dashed',
  },
  milestoneMuted: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 1.5,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f3f4f6',
    marginTop: 8,
    textAlign: 'center',
  },
});
