import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

// Your Worker URL
const API_URL = 'https://scroll-api-dev.hamzawilliamsbusiness.workers.dev';

export default function App() {
  const [status, setStatus] = useState('loading...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/test`)
      .then(res => res.json())
      .then(data => {
        setStatus('✅ All loaded correctly!');
        setLoading(false);
      })
      .catch(err => {
        setStatus('❌ Error: ' + err.message);
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
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    padding: 30,
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  text: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});
