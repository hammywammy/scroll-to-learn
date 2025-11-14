import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Onboarding from './app/auth/onboarding';
import MainApp from './app/index';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleOnboardingComplete = (data) => {
    setUserData(data);
    setIsAuthenticated(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {!isAuthenticated ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <MainApp userData={userData} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
