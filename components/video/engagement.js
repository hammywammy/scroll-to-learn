import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function Engagement({ likes, comments, shares }) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.item}>
        <Text style={styles.icon}>❤️</Text>
        <Text style={styles.count}>{likes}</Text>
      </Pressable>
      
      <Pressable style={styles.item}>
        <Text style={styles.icon}>💬</Text>
        <Text style={styles.count}>{comments}</Text>
      </Pressable>
      
      <Pressable style={styles.item}>
        <Text style={styles.icon}>↗️</Text>
        <Text style={styles.count}>{shares}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 15,
    bottom: 100,
  },
  item: {
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 28,
  },
  count: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});
