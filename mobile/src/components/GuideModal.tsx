import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { GuideData } from '../data/roadmapData';

interface GuideModalProps {
  visible: boolean;
  onClose: () => void;
  badge: string;
  title: string;
  desc: string;
  tags: string[];
  guide: GuideData;
}

export function GuideModal({
  visible,
  onClose,
  badge,
  title,
  desc,
  tags,
  guide,
}: GuideModalProps) {
  if (!guide) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        {/* Clickable Backdrop to close */}
        <TouchableOpacity
          style={styles.backdropClickable}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Modal Sheet Content */}
        <ThemedView style={styles.sheetContent}>
          {/* Draggable Indicator Handle bar */}
          <View style={styles.handleBar} />

          {/* Modal Header */}
          <View style={styles.header}>
            <View style={styles.badgeAndTitle}>
              <View style={styles.badgeContainer}>
                <ThemedText style={styles.badgeText}>{badge}</ThemedText>
              </View>
              <View style={styles.titleContainer}>
                <ThemedText style={styles.title}>{title}</ThemedText>
                {desc ? <ThemedText style={styles.desc}>{desc}</ThemedText> : null}
              </View>
            </View>
            
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <ThemedText style={styles.closeButtonText}>✕</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Tags */}
          {tags && tags.length > 0 ? (
            <View style={styles.tagsContainer}>
              {tags.map((tag, idx) => (
                <View key={idx} style={[styles.tag, tag === 'Critical' || tag === 'Danger' ? styles.tagCritical : styles.tagDefault]}>
                  <ThemedText style={styles.tagText}>{tag}</ThemedText>
                </View>
              ))}
            </View>
          ) : null}

          {/* Scrollable Body Content */}
          <ScrollView style={styles.scrollBody} contentContainerStyle={styles.scrollContent}>
            {/* GOAL */}
            {guide.goal ? (
              <View style={styles.section}>
                <ThemedText style={styles.sectionLabel}>🎯 Goal</ThemedText>
                <ThemedText style={styles.sectionText}>{guide.goal}</ThemedText>
              </View>
            ) : null}

            {/* BUILD THIS */}
            {guide['build this'] ? (
              <View style={styles.section}>
                <ThemedText style={styles.sectionLabel}>🛠️ Build This</ThemedText>
                <ThemedText style={styles.sectionText}>{guide['build this']}</ThemedText>
              </View>
            ) : null}

            {/* KEY CONCEPTS */}
            {guide['key concepts'] && guide['key concepts'].length > 0 ? (
              <View style={styles.section}>
                <ThemedText style={styles.sectionLabel}>🔑 Key Concepts</ThemedText>
                {guide['key concepts'].map((concept, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <ThemedText style={styles.listBullet}>•</ThemedText>
                    <ThemedText style={styles.listItemText}>{concept}</ThemedText>
                  </View>
                ))}
              </View>
            ) : null}

            {/* RESOURCES */}
            {guide.resources && guide.resources.length > 0 ? (
              <View style={styles.section}>
                <ThemedText style={styles.sectionLabel}>📚 Curated Resources</ThemedText>
                {guide.resources.map((resource, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <ThemedText style={styles.listBullet}>•</ThemedText>
                    <ThemedText style={[styles.listItemText, styles.linkText]}>{resource}</ThemedText>
                  </View>
                ))}
              </View>
            ) : null}

            {/* CHECKLIST */}
            {guide.checklist && guide.checklist.length > 0 ? (
              <View style={styles.section}>
                <ThemedText style={styles.sectionLabel}>✅ Verification Checklist</ThemedText>
                {guide.checklist.map((check, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <ThemedText style={styles.listBullet}>✓</ThemedText>
                    <ThemedText style={styles.listItemText}>{check}</ThemedText>
                  </View>
                ))}
              </View>
            ) : null}
          </ScrollView>
        </ThemedView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  backdropClickable: {
    flex: 1,
  },
  sheetContent: {
    maxHeight: '85%',
    minHeight: '40%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: '#0b0f19',
    borderTopWidth: 1,
    borderTopColor: '#1f2937',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  handleBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#374151',
    alignSelf: 'center',
    marginVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  badgeAndTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 10,
  },
  badgeContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#161e2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  badgeText: {
    fontSize: 18,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f3f4f6',
  },
  desc: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1f2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '700',
  },
  tagsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
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
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#3b82f6',
  },
  scrollBody: {
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3b82f6',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#d1d5db',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
    paddingLeft: 4,
  },
  listBullet: {
    fontSize: 13,
    color: '#10b981',
    marginRight: 8,
    fontWeight: '700',
  },
  listItemText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#d1d5db',
    flex: 1,
  },
  linkText: {
    color: '#60a5fa',
    textDecorationLine: 'underline',
  },
});
