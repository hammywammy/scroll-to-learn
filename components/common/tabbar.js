import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function TabBar({ activeTab, onTabPress }) {
  return (
    <View style={styles.container}>
      <Pressable onPress={() => onTabPress('home')}>
        <Text style={[styles.tab, activeTab === 'home' && styles.activeTab]}>
          Home
        </Text>
      </Pressable>
      
      <Pressable onPress={() => onTabPress('profile')}>
        <Text style={[styles.tab, activeTab === 'profile' && styles.activeTab]}>
          Profile
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.9)',
    paddingVertical: 15,
    paddingBottom: 30,
  },
  tab: {
    color: '#888',
    fontSize: 14,
  },
  activeTab: {
    color: '#fff',
  },
});
