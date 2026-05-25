import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, StatusBar, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Rect, G, Text as SvgText } from 'react-native-svg';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { roadmapData, RoadmapPhase } from '../data/roadmapData';

const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth - 32 - 24; // Padding margins offset

export default function ProgressScreen() {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  // Reload progress data every time the screen mounts
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

  // Compute metrics
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

  const remainingTopics = totalTopics - completedTopics;
  const overallPercentage = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  // Gather stats per phase
  const phaseStats = roadmapData.map((phase) => {
    let phaseTotal = phase.items.length;
    let phaseCompleted = 0;
    phase.items.forEach((item) => {
      if (checkedItems[item.id]) phaseCompleted++;
    });
    const percentage = phaseTotal > 0 ? (phaseCompleted / phaseTotal) * 100 : 0;
    return {
      id: phase.id,
      title: phase.title.split('—')[0].trim(),
      badge: phase.badge,
      completed: phaseCompleted,
      total: phaseTotal,
      percentage: percentage,
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Progress Analytics</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Detailed breakdown of your future-proof career path
          </ThemedText>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <ThemedView style={styles.statCard}>
            <ThemedText style={styles.statLabel}>Total Topics</ThemedText>
            <ThemedText style={styles.statValue}>{totalTopics}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statCard}>
            <ThemedText style={[styles.statLabel, { color: '#10b981' }]}>Completed</ThemedText>
            <ThemedText style={[styles.statValue, { color: '#10b981' }]}>{completedTopics}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statCard}>
            <ThemedText style={[styles.statLabel, { color: '#3b82f6' }]}>Remaining</ThemedText>
            <ThemedText style={[styles.statValue, { color: '#3b82f6' }]}>{remainingTopics}</ThemedText>
          </ThemedView>
        </View>

        {/* SVG Chart Visualizer */}
        <ThemedView style={styles.chartCard}>
          <ThemedText style={styles.chartTitle}>PHASE SUMMARY CHART</ThemedText>
          
          <View style={styles.chartContainer}>
            <Svg width={chartWidth} height={200}>
              <G>
                {phaseStats.map((p, idx) => {
                  const barHeight = 16;
                  const gap = 11;
                  const y = idx * (barHeight + gap) + 12;
                  
                  // Label width spacing offset
                  const labelOffset = 30;
                  const maxBarWidth = chartWidth - labelOffset - 50;
                  const currentBarWidth = maxBarWidth * (p.percentage / 100);

                  return (
                    <G key={p.id}>
                      {/* Badge / Label */}
                      <SvgText
                        x={0}
                        y={y + 12}
                        fill="#9ca3af"
                        fontSize="12"
                        fontWeight="bold"
                      >
                        {p.badge}
                      </SvgText>

                      {/* Gray Track Bar */}
                      <Rect
                        x={labelOffset}
                        y={y}
                        width={maxBarWidth}
                        height={barHeight}
                        rx={4}
                        fill="#1f2937"
                      />

                      {/* Filled Progress Bar */}
                      <Rect
                        x={labelOffset}
                        y={y}
                        width={Math.max(currentBarWidth, 4)} // Show at least a tiny sliver for 0% visual reference
                        height={barHeight}
                        rx={4}
                        fill={p.percentage > 0 ? '#10b981' : '#3b82f6'}
                      />

                      {/* Percent Value */}
                      <SvgText
                        x={labelOffset + maxBarWidth + 8}
                        y={y + 12}
                        fill={p.percentage > 0 ? '#10b981' : '#9ca3af'}
                        fontSize="11"
                        fontWeight="600"
                      >
                        {Math.round(p.percentage)}%
                      </SvgText>
                    </G>
                  );
                })}
              </G>
            </Svg>
          </View>
        </ThemedView>

        {/* Phase Breakdown List */}
        <ThemedText style={styles.breakdownHeader}>Module Breakdown</ThemedText>
        
        {phaseStats.map((p) => (
          <ThemedView key={p.id} style={styles.breakdownCard}>
            <View style={styles.breakdownHeaderRow}>
              <View style={styles.breakdownLeft}>
                <View style={styles.miniBadge}>
                  <ThemedText style={styles.miniBadgeText}>{p.badge}</ThemedText>
                </View>
                <ThemedText style={styles.breakdownTitle}>{p.title}</ThemedText>
              </View>
              <ThemedText style={styles.breakdownFraction}>
                {p.completed} <ThemedText style={styles.fractionMuted}>/ {p.total}</ThemedText>
              </ThemedText>
            </View>

            {/* Progress Bar Container */}
            <View style={styles.cardProgressBarBg}>
              <View
                style={[
                  styles.cardProgressBarFill,
                  {
                    width: `${p.percentage}%`,
                    backgroundColor: p.percentage === 100 ? '#10b981' : '#3b82f6',
                  },
                ]}
              />
            </View>
          </ThemedView>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#f3f4f6',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#161e2e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 0.8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f3f4f6',
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: '#161e2e',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 16,
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdownHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: '#f3f4f6',
    marginBottom: 12,
  },
  breakdownCard: {
    backgroundColor: '#161e2e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 14,
    marginBottom: 12,
  },
  breakdownHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
    paddingRight: 8,
  },
  miniBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#0b0f19',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  miniBadgeText: {
    fontSize: 11,
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f3f4f6',
    flex: 1,
  },
  breakdownFraction: {
    fontSize: 12,
    fontWeight: '600',
    color: '#f3f4f6',
  },
  fractionMuted: {
    color: '#9ca3af',
    fontWeight: '400',
  },
  cardProgressBarBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1f2937',
    overflow: 'hidden',
  },
  cardProgressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
