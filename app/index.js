import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Feed from './main/feed';
import Profile from './main/profile';
import Discover from './main/discover';
import Inbox from './main/inbox';
import Upload from './main/upload';
import TabBar from '../components/common/tabbar';

export default function MainApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [showUpload, setShowUpload] = useState(false);

  const handleTabPress = (tab) => {
    if (tab === 'upload') {
      setShowUpload(true);
    } else {
      setActiveTab(tab);
      setShowUpload(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Main Content */}
      {activeTab === 'home' && <Feed />}
      {activeTab === 'discover' && <Discover />}
      {activeTab === 'inbox' && <Inbox />}
      {activeTab === 'profile' && <Profile />}
      
      {/* Upload Modal */}
      {showUpload && (
        <Upload onClose={() => {
          setShowUpload(false);
          setActiveTab('home');
        }} />
      )}
      
      {/* Tab Bar */}
      <TabBar activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
