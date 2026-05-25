import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProfileScreen() {
  const [userName, setUserName] = useState('Dev Khairpal');
  const [targetRole, setTargetRole] = useState('Future-Proof Engineer');
  const [techFocus, setTechFocus] = useState('AI & Backend Architecture');

  // Load profile configurations on mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const savedRole = await AsyncStorage.getItem('user_target_role');
        const savedFocus = await AsyncStorage.getItem('user_tech_focus');
        if (savedRole) setTargetRole(savedRole);
        if (savedFocus) setTechFocus(savedFocus);
      } catch (e) {
        console.error('Failed to load profile settings', e);
      }
    };
    loadProfile();
  }, []);

  // Handle resetting learning progress
  const resetProgress = () => {
    Alert.alert(
      'Reset Progress',
      'Are you sure you want to reset all checklist topic progress? This action is permanent.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('roadmap_progress_state');
              Alert.alert('Reset Successful', 'All topic checkmarks have been cleared.');
            } catch (e) {
              console.error('Failed to reset progress', e);
            }
          },
        },
      ]
    );
  };

  // Toggle roles
  const changeRole = async (roleName: string) => {
    setTargetRole(roleName);
    try {
      await AsyncStorage.setItem('user_target_role', roleName);
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle focus areas
  const changeFocus = async (focusName: string) => {
    setTechFocus(focusName);
    try {
      await AsyncStorage.setItem('user_tech_focus', focusName);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Card Header */}
        <ThemedView style={styles.profileHeaderCard}>
          <View style={styles.avatar}>
            <ThemedText style={styles.avatarText}>DK</ThemedText>
          </View>
          <ThemedText style={styles.profileName}>{userName}</ThemedText>
          <ThemedText style={styles.profileRole}>{targetRole}</ThemedText>
          <View style={styles.focusBadge}>
            <ThemedText style={styles.focusBadgeText}>{techFocus}</ThemedText>
          </View>
        </ThemedView>

        {/* Configurations Section */}
        <ThemedText style={styles.sectionHeader}>Target Role Configurations</ThemedText>
        <ThemedView style={styles.settingsGroup}>
          {[
            'Backend + AI + Cloud Native Architect',
            'Full-Stack AI Application Engineer',
            'Platform & Infrastructure Specialist'
          ].map((role) => (
            <TouchableOpacity
              key={role}
              activeOpacity={0.7}
              style={[styles.settingRow, targetRole === role && styles.settingRowActive]}
              onPress={() => changeRole(role)}
            >
              <ThemedText style={[styles.settingLabel, targetRole === role && styles.settingLabelActive]}>
                {role}
              </ThemedText>
              {targetRole === role && <ThemedText style={styles.activeCheck}>✓</ThemedText>}
            </TouchableOpacity>
          ))}
        </ThemedView>

        {/* Technical Focus Section */}
        <ThemedText style={styles.sectionHeader}>Focus Area Selection</ThemedText>
        <ThemedView style={styles.settingsGroup}>
          {[
            'AI & Backend Architecture',
            'Systems Engineering',
            'Platform Engineering'
          ].map((focus) => (
            <TouchableOpacity
              key={focus}
              activeOpacity={0.7}
              style={[styles.settingRow, techFocus === focus && styles.settingRowActive]}
              onPress={() => changeFocus(focus)}
            >
              <ThemedText style={[styles.settingLabel, techFocus === focus && styles.settingLabelActive]}>
                {focus}
              </ThemedText>
              {techFocus === focus && <ThemedText style={styles.activeCheck}>✓</ThemedText>}
            </TouchableOpacity>
          ))}
        </ThemedView>

        {/* Danger zone actions */}
        <ThemedText style={styles.sectionHeader}>Account & Storage Actions</ThemedText>
        <ThemedView style={styles.dangerGroup}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.resetButton}
            onPress={resetProgress}
          >
            <ThemedText style={styles.resetButtonText}>Reset All Learning Progress</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Footer specifications */}
        <View style={styles.specificationsFooter}>
          <ThemedText style={styles.footerSpecText}>Future-Proof Tracker v1.0.0</ThemedText>
          <ThemedText style={styles.footerSpecText}>SaaS standard theme: Slate & Blue</ThemedText>
        </View>

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
  profileHeaderCard: {
    backgroundColor: '#161e2e',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1f2937',
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#1d4ed8',
    borderWidth: 2,
    borderColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f3f4f6',
  },
  profileRole: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    textAlign: 'center',
  },
  focusBadge: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 12,
  },
  focusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#3b82f6',
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9ca3af',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  settingsGroup: {
    backgroundColor: '#161e2e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1f2937',
    overflow: 'hidden',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  settingRowActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.05)',
  },
  settingLabel: {
    fontSize: 13,
    color: '#d1d5db',
  },
  settingLabelActive: {
    color: '#3b82f6',
    fontWeight: '700',
  },
  activeCheck: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '700',
  },
  dangerGroup: {
    backgroundColor: '#161e2e',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef444433',
    overflow: 'hidden',
    marginBottom: 24,
  },
  resetButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ef4444',
  },
  specificationsFooter: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 10,
  },
  footerSpecText: {
    fontSize: 11,
    color: '#4b5563',
  },
});
