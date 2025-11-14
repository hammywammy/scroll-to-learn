import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Discover() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.comingSoon}>🔍</Text>
        <Text style={styles.comingSoonText}>Discover Coming Soon</Text>
        <Text style={styles.subtitle}>
          Search and explore trending content
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  comingSoon: {
    fontSize: 80,
    textAlign: 'center',
    marginTop: 100,
  },
  comingSoonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
