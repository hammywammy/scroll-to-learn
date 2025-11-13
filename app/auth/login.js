import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function Login({ onLogin }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ScrollToLearn</Text>
      <Text style={styles.tagline}>Learn in 60 seconds</Text>
      
      <Pressable style={styles.button} onPress={onLogin}>
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#888',
    marginBottom: 60,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 100,
    paddingVertical: 16,
    borderRadius: 30,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
});
