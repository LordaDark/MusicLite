import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSettingsStore } from '@/stores/settingsStore';
import { useAnalyticsStore } from '@/stores/analyticsStore';
import { theme } from '@/constants/theme';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');

type TimeRange = 'daily' | 'weekly' | 'monthly';

export default function AnalyticsScreen() {
  const { theme: appTheme } = useSettingsStore();
  const { data, clearAnalytics } = useAnalyticsStore();
  const themeColors = appTheme === 'dark' ? colors.dark : colors.light;
  
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  
  const renderBarChart = (data: number[], labels: string[]) => {
    const maxValue = Math.max(...data, 1); // Ensure we don't divide by zero
    
    return (
      <View style={styles.chartContainer}>
        <View style={styles.barsContainer}>
          {data.map((value, index) => (
            <View key={index} style={styles.barWrapper}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    height: `${(value / maxValue) * 100}%`,
                    backgroundColor: themeColors.primary 
                  }
                ]} 
              />
              <Text style={[styles.barLabel, { color: themeColors.subtext }]}>
                {labels[index]}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };
  
  const getChartData = () => {
    switch (timeRange) {
      case 'daily':
        return {
          data: data.listeningTime.daily,
          labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        };
      case 'weekly':
        return {
          data: data.listeningTime.weekly,
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        };
      case 'monthly':
        return {
          data: data.listeningTime.monthly,
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        };
      default:
        return { data: [], labels: [] };
    }
  };
  
  const { data: chartData, labels } = getChartData();
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: themeColors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: themeColors.text }]}>
        Your Listening Stats
      </Text>
      
      <View style={styles.timeRangeSelector}>
        <TouchableOpacity
          style={[
            styles.timeRangeButton,
            timeRange === 'daily' && styles.activeTimeRange,
            timeRange === 'daily' && { backgroundColor: themeColors.primary }
          ]}
          onPress={() => setTimeRange('daily')}
        >
          <Text 
            style={[
              styles.timeRangeText,
              timeRange === 'daily' && { color: '#000' }
            ]}
          >
            Daily
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.timeRangeButton,
            timeRange === 'weekly' && styles.activeTimeRange,
            timeRange === 'weekly' && { backgroundColor: themeColors.primary }
          ]}
          onPress={() => setTimeRange('weekly')}
        >
          <Text 
            style={[
              styles.timeRangeText,
              timeRange === 'weekly' && { color: '#000' }
            ]}
          >
            Weekly
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.timeRangeButton,
            timeRange === 'monthly' && styles.activeTimeRange,
            timeRange === 'monthly' && { backgroundColor: themeColors.primary }
          ]}
          onPress={() => setTimeRange('monthly')}
        >
          <Text 
            style={[
              styles.timeRangeText,
              timeRange === 'monthly' && { color: '#000' }
            ]}
          >
            Monthly
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={[styles.card, { backgroundColor: themeColors.card }]}>
        <Text style={[styles.cardTitle, { color: themeColors.text }]}>
          Listening Time (hours)
        </Text>
        {renderBarChart(chartData, labels)}
      </View>
      
      <View style={[styles.card, { backgroundColor: themeColors.card }]}>
        <Text style={[styles.cardTitle, { color: themeColors.text }]}>
          Top Artists
        </Text>
        {data.topArtists.slice(0, 5).map((artist, index) => (
          <View key={index} style={styles.statRow}>
            <Text style={[styles.statLabel, { color: themeColors.text }]}>
              {index + 1}. {artist.name}
            </Text>
            <Text style={[styles.statValue, { color: themeColors.primary }]}>
              {artist.count} plays
            </Text>
          </View>
        ))}
      </View>
      
      <View style={[styles.card, { backgroundColor: themeColors.card }]}>
        <Text style={[styles.cardTitle, { color: themeColors.text }]}>
          Top Genres
        </Text>
        {data.topGenres.slice(0, 5).map((genre, index) => (
          <View key={index} style={styles.statRow}>
            <Text style={[styles.statLabel, { color: themeColors.text }]}>
              {index + 1}. {genre.name}
            </Text>
            <Text style={[styles.statValue, { color: themeColors.primary }]}>
              {genre.count} plays
            </Text>
          </View>
        ))}
      </View>
      
      <View style={[styles.card, { backgroundColor: themeColors.card }]}>
        <Text style={[styles.cardTitle, { color: themeColors.text }]}>
          Downloads
        </Text>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: themeColors.text }]}>
            Total Downloads
          </Text>
          <Text style={[styles.statValue, { color: themeColors.primary }]}>
            {data.downloads.count} songs
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: themeColors.text }]}>
            Storage Used
          </Text>
          <Text style={[styles.statValue, { color: themeColors.primary }]}>
            {data.downloads.size} MB
          </Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.clearButton, { backgroundColor: themeColors.error }]}
        onPress={clearAnalytics}
      >
        <Text style={styles.clearButtonText}>
          Clear Analytics Data
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: theme.typography.fontSizes.xxl,
    fontWeight: '700',
    marginBottom: 16,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeRangeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  activeTimeRange: {
    backgroundColor: theme.colors.dark.primary,
  },
  timeRangeText: {
    color: theme.colors.dark.text,
    fontWeight: '500',
  },
  card: {
    borderRadius: theme.radius.md,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: '700',
    marginBottom: 16,
  },
  chartContainer: {
    height: 200,
    marginTop: 8,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
  },
  barWrapper: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 24,
    minHeight: 4,
    borderRadius: theme.radius.sm,
  },
  barLabel: {
    marginTop: 8,
    fontSize: theme.typography.fontSizes.xs,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  statLabel: {
    fontSize: theme.typography.fontSizes.md,
  },
  statValue: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '500',
  },
  clearButton: {
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    marginTop: 16,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: theme.typography.fontSizes.md,
    fontWeight: '500',
  },
});