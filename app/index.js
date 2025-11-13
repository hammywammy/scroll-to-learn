import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Feed from './main/feed';
import Profile from './main/profile';
import TabBar from '../components/common/tabbar';

export default function MainApp() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <View style={styles.container}>
      {activeTab === 'home' && <Feed />}
      {activeTab === 'profile' && <Profile />}
      <TabBar activeTab={activeTab} onTabPress={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
