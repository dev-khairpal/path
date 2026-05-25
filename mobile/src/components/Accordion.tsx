import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  title: string;
  subtitle: string;
  badge: string;
  completedCount: number;
  totalCount: number;
  isInitialOpen?: boolean;
  children: React.ReactNode;
}

export function Accordion({
  title,
  subtitle,
  badge,
  completedCount,
  totalCount,
  isInitialOpen = false,
  children,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(isInitialOpen);

  const toggleOpen = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <ThemedView style={styles.accordionContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={toggleOpen}
        style={styles.header}
      >
        <View style={styles.leftContainer}>
          {/* Badge Icon */}
          <View style={styles.badgeContainer}>
            <ThemedText style={styles.badgeText}>{badge}</ThemedText>
          </View>
          {/* Titles */}
          <View style={styles.titleContainer}>
            <ThemedText style={styles.titleText}>{title}</ThemedText>
            {subtitle ? (
              <ThemedText style={styles.subtitleText}>{subtitle}</ThemedText>
            ) : null}
          </View>
        </View>

        {/* Progress & Chevron */}
        <View style={styles.rightContainer}>
          <View style={styles.progressFractionContainer}>
            <ThemedText style={styles.fractionText}>
              {completedCount} / {totalCount}
            </ThemedText>
            {/* Horizontal Mini Progress Bar */}
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${progressPercent}%` },
                ]}
              />
            </View>
          </View>

          {/* Custom Chevron Rotation */}
          <View style={[styles.chevron, isOpen && styles.chevronRotated]}>
            <ThemedText style={styles.chevronText}>▼</ThemedText>
          </View>
        </View>
      </TouchableOpacity>

      {/* Accordion Content Body */}
      {isOpen && <View style={styles.contentBody}>{children}</View>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  accordionContainer: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937', // Slate outline
    backgroundColor: '#111827', // Dark card background
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#161e2e', // Elevated header background
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  badgeContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#0b0f19',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#3b82f6', // Glowing blue border
  },
  badgeText: {
    fontSize: 18,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f3f4f6',
  },
  subtitleText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressFractionContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  fractionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10b981', // Highlight emerald progress
    marginBottom: 4,
  },
  progressBarBg: {
    width: 60,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1f2937',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10b981', // Emerald filled progress
    borderRadius: 2,
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  chevronText: {
    fontSize: 10,
    color: '#9ca3af',
  },
  contentBody: {
    padding: 12,
    backgroundColor: '#0b0f19',
  },
});
