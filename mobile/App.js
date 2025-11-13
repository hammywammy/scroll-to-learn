import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

// CHANGE THIS to your deployed Worker URL
const API_URL = 'https://scroll-api-dev.YOUR-USERNAME.workers.dev';

export default function App() {
  const [status, setStatus] = useState('loading...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/test`)
      .then(res => res.json())
      .then(data => {
        setStatus(data.message || 'Connected!');
        setLoading(false);
      })
      .catch(err => {
        setStatus('Error: ' + err.message);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <Text style={styles.text}>{status}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});
