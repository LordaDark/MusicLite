import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';
import { generateSimpleChart } from '@/services/chartService';
import { Image } from 'expo-image';

// Dati di esempio per i grafici
const mockListeningData = [
  { day: 'Lun', hours: 1.2 },
  { day: 'Mar', hours: 0.8 },
  { day: 'Mer', hours: 2.1 },
  { day: 'Gio', hours: 1.5 },
  { day: 'Ven', hours: 2.8 },
  { day: 'Sab', hours: 3.2 },
  { day: 'Dom', hours: 2.4 },
];

const mockGenreData = [
  { genre: 'Pop', percentage: 35 },
  { genre: 'Rock', percentage: 25 },
  { genre: 'Hip-Hop', percentage: 20 },
  { genre: 'Elettronica', percentage: 15 },
  { genre: 'Altro', percentage: 5 },
];

const mockArtistData = [
  { name: 'The Weeknd', count: 42 },
  { name: 'Dua Lipa', count: 38 },
  { name: 'Post Malone', count: 27 },
  { name: 'Billie Eilish', count: 23 },
  { name: 'Harry Styles', count: 19 },
];

export default function AnalyticsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [barChartImage, setBarChartImage] = useState<string | null>(null);
  const [pieChartImage, setPieChartImage] = useState<string | null>(null);
  
  useEffect(() => {
    // Genera il grafico a barre per le ore di ascolto
    const generateBarChart = async () => {
      const chartData = mockListeningData.map(item => ({
        label: item.day,
        value: item.hours
      }));
      
      const chartImage = await generateSimpleChart({
        type: 'bar',
        data: chartData,
        width: Dimensions.get('window').width - 40,
        height: 200,
        colors: [colors.primary],
        backgroundColor: colors.card,
        textColor: colors.text,
      });
      
      setBarChartImage(chartImage);
    };
    
    // Genera il grafico a torta per i generi
    const generatePieChart = async () => {
      const chartData = mockGenreData.map(item => ({
        label: item.genre,
        value: item.percentage
      }));
      
      const chartImage = await generateSimpleChart({
        type: 'pie',
        data: chartData,
        width: Dimensions.get('window').width - 40,
        height: 200,
        colors: [colors.primary, colors.secondary, '#FF9800', '#4CAF50', '#9E9E9E'],
        backgroundColor: colors.card,
        textColor: colors.text,
      });
      
      setPieChartImage(chartImage);
    };
    
    generateBarChart();
    generatePieChart();
  }, [colors]);
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: "Analisi ascolti",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.infoBox}>
          <Text style={[styles.infoText, { color: colors.text }]}>
            Questi dati sono basati sulle tue abitudini di ascolto. Più musica ascolti, più accurati saranno i dati.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Ore di ascolto settimanali</Text>
          
          <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
            {barChartImage ? (
              <Image
                source={{ uri: barChartImage }}
                style={styles.chartImage}
                contentFit="contain"
              />
            ) : (
              <View style={styles.loadingContainer}>
                <Text style={[styles.loadingText, { color: colors.subtext }]}>
                  Generazione grafico...
                </Text>
              </View>
            )}
          </View>
          
          <Text style={[styles.chartDescription, { color: colors.subtext }]}>
            Hai ascoltato in media 2 ore di musica al giorno questa settimana.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Generi più ascoltati</Text>
          
          <View style={[styles.chartContainer, { backgroundColor: colors.card }]}>
            {pieChartImage ? (
              <Image
                source={{ uri: pieChartImage }}
                style={styles.chartImage}
                contentFit="contain"
              />
            ) : (
              <View style={styles.loadingContainer}>
                <Text style={[styles.loadingText, { color: colors.subtext }]}>
                  Generazione grafico...
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Artisti più ascoltati</Text>
          
          {mockArtistData.map((artist, index) => (
            <View 
              key={index}
              style={[styles.artistItem, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.artistRank, { color: colors.primary }]}>
                #{index + 1}
              </Text>
              <Text style={[styles.artistName, { color: colors.text }]}>
                {artist.name}
              </Text>
              <Text style={[styles.artistCount, { color: colors.subtext }]}>
                {artist.count} brani
              </Text>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Suggerimenti</Text>
          
          <View style={[styles.suggestionContainer, { backgroundColor: colors.card }]}>
            <Text style={[styles.suggestionTitle, { color: colors.text }]}>
              Basato sui tuoi ascolti
            </Text>
            <Text style={[styles.suggestionText, { color: colors.subtext }]}>
              Ti piace la musica Pop e Rock. Prova ad ascoltare più artisti indie per scoprire nuova musica.
            </Text>
          </View>
        </View>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  infoBox: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  chartContainer: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartImage: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  chartDescription: {
    fontSize: 14,
    marginTop: 8,
  },
  artistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  artistRank: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 40,
  },
  artistName: {
    flex: 1,
    fontSize: 16,
  },
  artistCount: {
    fontSize: 14,
  },
  suggestionContainer: {
    padding: 16,
    borderRadius: 8,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
