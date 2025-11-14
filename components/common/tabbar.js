import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

// Home Icon
const HomeIcon = ({ active }) => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      stroke={active ? '#fff' : '#888'}
      strokeWidth="2"
      fill={active ? '#fff' : 'none'}
    />
  </Svg>
);

// Discover/Search Icon
const DiscoverIcon = ({ active }) => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      stroke={active ? '#fff' : '#888'}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Plus/Upload Icon (TikTok style with gradient border)
const PlusIcon = () => (
  <View style={styles.plusIconContainer}>
    <View style={styles.plusIconBackground}>
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path
          d="M12 5v14M5 12h14"
          stroke="#000"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  </View>
);

// Inbox/Notifications Icon
const InboxIcon = ({ active }) => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
      stroke={active ? '#fff' : '#888'}
      strokeWidth="2"
      fill={active ? '#fff' : 'none'}
    />
    <Path
      d="M22 6l-10 7L2 6"
      stroke={active ? '#000' : '#888'}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

// Profile Icon
const ProfileIcon = ({ active }) => (
  <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
      stroke={active ? '#fff' : '#888'}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M12 11a4 4 0 100-8 4 4 0 000 8z"
      stroke={active ? '#fff' : '#888'}
      strokeWidth="2"
      fill={active ? '#fff' : 'none'}
    />
  </Svg>
);

export default function TabBar({ activeTab, onTabPress }) {
  return (
    <View style={styles.container}>
      {/* Home */}
      <Pressable 
        style={styles.tab} 
        onPress={() => onTabPress('home')}
      >
        <HomeIcon active={activeTab === 'home'} />
        <Text style={[styles.label, activeTab === 'home' && styles.activeLabel]}>
          Home
        </Text>
      </Pressable>

      {/* Discover */}
      <Pressable 
        style={styles.tab} 
        onPress={() => onTabPress('discover')}
      >
        <DiscoverIcon active={activeTab === 'discover'} />
        <Text style={[styles.label, activeTab === 'discover' && styles.activeLabel]}>
          Discover
        </Text>
      </Pressable>
      
      {/* Upload/Plus Button (Center) */}
      <Pressable 
        style={styles.plusTab} 
        onPress={() => onTabPress('upload')}
      >
        <PlusIcon />
      </Pressable>

      {/* Inbox */}
      <Pressable 
        style={styles.tab} 
        onPress={() => onTabPress('inbox')}
      >
        <InboxIcon active={activeTab === 'inbox'} />
        <Text style={[styles.label, activeTab === 'inbox' && styles.activeLabel]}>
          Inbox
        </Text>
      </Pressable>

      {/* Profile */}
      <Pressable 
        style={styles.tab} 
        onPress={() => onTabPress('profile')}
      >
        <ProfileIcon active={activeTab === 'profile'} />
        <Text style={[styles.label, activeTab === 'profile' && styles.activeLabel]}>
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
    alignItems: 'flex-end',
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingBottom: 20,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  plusTab: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  label: {
    color: '#888',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
  },
  activeLabel: {
    color: '#fff',
  },
  plusIconContainer: {
    width: 48,
    height: 32,
    position: 'relative',
  },
  plusIconBackground: {
    width: 48,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    // TikTok-style gradient effect simulation
    shadowColor: '#fe2c55',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 0,
    elevation: 0,
  },
});
