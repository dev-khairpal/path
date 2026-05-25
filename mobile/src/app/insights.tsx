import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

interface InsightItem {
  id: string;
  category: string;
  badge: string;
  title: string;
  bullets: string[];
  borderColor: string;
  bgColor: string;
}

const insightsData: InsightItem[] = [
  {
    id: 'ins-1',
    category: 'AI FLUENCY',
    badge: '🤖',
    title: 'Vibe Coding Strategy',
    bullets: [
      'Define a rigorous system specification before prompting. Never vibe code blindly.',
      'AI should write 80% of boilerplate; you focus on architecture, API design, and review.',
      'Always audit every line of AI-generated code for security, logic errors, and scalability.',
      'Use tools like Claude Code or Copilot Agent Mode for terminal-based codebase refactors.'
    ],
    borderColor: 'rgba(59, 130, 246, 0.3)',
    bgColor: 'rgba(59, 130, 246, 0.05)',
  },
  {
    id: 'ins-2',
    category: 'BACKEND SYSTEMS',
    badge: '☕',
    title: 'Systems & Language Mastery',
    bullets: [
      'Don\'t spend months on syntax. Spend 2-3 weeks on core concepts, then start building.',
      'Understand JVM memory allocation, thread contention, and garbage collection mechanisms.',
      'Master SQL queries, CTEs, and execution plan optimization (EXPLAIN ANALYZE).',
      'Deploy caching layers (Redis) and reverse proxies (Nginx) to shield your backend.'
    ],
    borderColor: 'rgba(16, 185, 129, 0.3)',
    bgColor: 'rgba(16, 185, 129, 0.05)',
  },
  {
    id: 'ins-3',
    category: 'AI ENGINEERING',
    badge: '🧩',
    title: 'LLM & Agent Pipelines',
    bullets: [
      'Simple API calls are commodities. Moats are built in advanced RAG, routing, and tool agents.',
      'Implement multi-query expansion, reranking, and self-evaluation to reduce hallucinations.',
      'Build multi-agent state machines with LangGraph to orchestrate complex multi-step tasks.',
      'Run open-source models locally (Ollama/vLLM) to secure private datasets and reduce API costs.'
    ],
    borderColor: 'rgba(236, 72, 153, 0.3)',
    bgColor: 'rgba(236, 72, 153, 0.05)',
  },
  {
    id: 'ins-4',
    category: 'CLOUD NATIVE',
    badge: '☁️',
    title: 'Resilient Infrastructure',
    bullets: [
      'Define everything as code (IaC with Terraform/Pulumi) to ensure repeatable environments.',
      'Master Kubernetes networking, namespaces, and dynamic persistent volume storage.',
      'Setup automated CI/CD pipelines (GitHub Actions) for linting, testing, and ECS deployment.',
      'Implement GitOps (ArgoCD/Flux) to automatically sync Git repositories with live clusters.'
    ],
    borderColor: 'rgba(245, 158, 11, 0.3)',
    bgColor: 'rgba(245, 158, 11, 0.05)',
  },
  {
    id: 'ins-5',
    category: 'READING STRATEGY',
    badge: '📚',
    title: 'Professional Learning Loop',
    bullets: [
      'Read "Designing Data-Intensive Applications" first. It will reshape your system architectural thinking.',
      'Apply Josh Bloch\'s "Effective Java" paradigms directly to your microservice patterns.',
      'Do not just read books passively — implement the design patterns actively in your portfolio apps.',
      'Solve one system design scenario weekly (Alex Xu volumes), mapping tradeoffs on a whiteboard.'
    ],
    borderColor: 'rgba(139, 92, 246, 0.3)',
    bgColor: 'rgba(139, 92, 246, 0.05)',
  }
];

export default function InsightsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Strategic Insights</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            High-leverage engineering paradigms for 2026
          </ThemedText>
        </View>

        {/* List of Insights */}
        {insightsData.map((item) => (
          <ThemedView
            key={item.id}
            style={[
              styles.insightCard,
              { borderColor: item.borderColor, backgroundColor: item.bgColor },
            ]}
          >
            {/* Card Header */}
            <View style={styles.cardHeader}>
              <View style={styles.badgeContainer}>
                <ThemedText style={styles.badgeText}>{item.badge}</ThemedText>
              </View>
              <View style={styles.categoryContainer}>
                <ThemedText style={styles.categoryText}>{item.category}</ThemedText>
                <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
              </View>
            </View>

            {/* Bullets */}
            <View style={styles.bulletsList}>
              {item.bullets.map((bullet, idx) => (
                <View key={idx} style={styles.bulletRow}>
                  <ThemedText style={styles.bulletPoint}>💡</ThemedText>
                  <ThemedText style={styles.bulletText}>{bullet}</ThemedText>
                </View>
              ))}
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
    marginBottom: 24,
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
  insightCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#161e2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  badgeText: {
    fontSize: 18,
  },
  categoryContainer: {
    flex: 1,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f3f4f6',
    marginTop: 2,
  },
  bulletsList: {
    gap: 12,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: 12,
    marginRight: 10,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#d1d5db',
    flex: 1,
  },
});
