import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  Dimensions,
  FlatList,
} from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import EditProfile from '../../components/profile/EditProfile';
import Settings from './settings';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIDEO_SIZE = (SCREEN_WIDTH - 6) / 3;

// Grid/Videos Icon
const GridIcon = ({ active }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="7" height="7" rx="1" 
      stroke={active ? '#fff' : '#888'} 
      strokeWidth="2" 
      fill={active ? '#fff' : 'none'} 
    />
    <Rect x="13" y="3" width="8" height="7" rx="1" 
      stroke={active ? '#fff' : '#888'} 
      strokeWidth="2" 
      fill={active ? '#fff' : 'none'} 
    />
    <Rect x="3" y="13" width="7" height="8" rx="1" 
      stroke={active ? '#fff' : '#888'} 
      strokeWidth="2" 
      fill={active ? '#fff' : 'none'} 
    />
    <Rect x="13" y="13" width="8" height="8" rx="1" 
      stroke={active ? '#fff' : '#888'} 
      strokeWidth="2" 
      fill={active ? '#fff' : 'none'} 
    />
  </Svg>
);

// Heart Icon for Liked
const HeartIcon = ({ active }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="m12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53z"
      stroke={active ? '#fff' : '#888'}
      strokeWidth="2"
      fill={active ? '#fff' : 'none'}
    />
  </Svg>
);

// Bookmark Icon for Saved/Favorites
const BookmarkIcon = ({ active }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 21V5q0-.825.588-1.412T7 3h10q.825 0 1.413.588T19 5v16l-7-3z"
      stroke={active ? '#fff' : '#888'}
      strokeWidth="2"
      fill={active ? '#fff' : 'none'}
    />
  </Svg>
);

// Lock Icon for Private
const LockIcon = ({ active }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect x="5" y="11" width="14" height="10" rx="2" 
      stroke={active ? '#fff' : '#888'} 
      strokeWidth="2" 
      fill={active ? '#fff' : 'none'}
    />
    <Path
      d="M7 11V7a5 5 0 0110 0v4"
      stroke={active ? '#fff' : '#888'}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export default function Profile() {
  const [activeTab, setActiveTab] = useState('videos');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Mock user data
  const userData = {
    name: 'My Name',
    username: 'myusername',
    bio: '📚 Learning something new every day\n💡 60-second knowledge drops',
    following: 123,
    followers: '15.2K',
    likes: '84K',
  };

  // Mock videos data
  const mockVideos = Array.from({ length: 12 }, (_, i) => ({
    id: `video-${i + 1}`,
    views: `${Math.floor(Math.random() * 50 + 10)}K`,
    isPinned: i === 0,
  }));

  const mockLikedVideos = Array.from({ length: 8 }, (_, i) => ({
    id: `liked-${i + 1}`,
    views: `${Math.floor(Math.random() * 100 + 20)}K`,
  }));

  const mockSavedVideos = Array.from({ length: 6 }, (_, i) => ({
    id: `saved-${i + 1}`,
    views: `${Math.floor(Math.random() * 80 + 15)}K`,
  }));

  const mockPrivateVideos = Array.from({ length: 4 }, (_, i) => ({
    id: `private-${i + 1}`,
    views: `${Math.floor(Math.random() * 30 + 5)}K`,
  }));

  const getCurrentVideos = () => {
    switch (activeTab) {
      case 'videos': return mockVideos;
      case 'liked': return mockLikedVideos;
      case 'saved': return mockSavedVideos;
      case 'private': return mockPrivateVideos;
      default: return mockVideos;
    }
  };

  const renderVideoItem = ({ item, index }) => (
    <Pressable style={styles.videoItem}>
      <View style={styles.videoThumbnail}>
        {item.isPinned && (
          <View style={styles.pinnedBadge}>
            <Text style={styles.pinnedText}>Pinned</Text>
          </View>
        )}
        <View style={styles.videoInfo}>
          <Text style={styles.playIcon}>▶</Text>
          <Text style={styles.viewCount}>{item.views}</Text>
        </View>
      </View>
    </Pressable>
  );

  if (showSettings) {
    return <Settings onBack={() => setShowSettings(false)} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <Text style={styles.headerTitle}>{userData.name}</Text>
        <Pressable 
          style={styles.headerRight}
          onPress={() => setShowSettings(true)}
        >
          <Text style={styles.menuIcon}>⋯</Text>
        </Pressable>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Picture */}
        <View style={styles.profileSection}>
          <View style={styles.profilePicture}>
            <Text style={styles.profileInitial}>
              {userData.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Username */}
        <Text style={styles.username}>@{userData.username}</Text>

        {/* Stats */}
        <View style={styles.stats}>
          <Pressable style={styles.statItem}>
            <Text style={styles.statNumber}>{userData.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </Pressable>
          
          <View style={styles.statDivider} />
          
          <Pressable style={styles.statItem}>
            <Text style={styles.statNumber}>{userData.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </Pressable>
          
          <View style={styles.statDivider} />
          
          <Pressable style={styles.statItem}>
            <Text style={styles.statNumber}>{userData.likes}</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </Pressable>
        </View>

        {/* Edit Profile Button */}
        <Pressable 
          style={styles.editButton}
          onPress={() => setShowEditProfile(true)}
        >
          <Text style={styles.editButtonText}>Edit profile</Text>
        </Pressable>

        {/* Bio */}
        <Text style={styles.bio}>{userData.bio}</Text>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Pressable 
            style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
            onPress={() => setActiveTab('videos')}
          >
            <GridIcon active={activeTab === 'videos'} />
          </Pressable>
          
          <Pressable 
            style={[styles.tab, activeTab === 'liked' && styles.activeTab]}
            onPress={() => setActiveTab('liked')}
          >
            <HeartIcon active={activeTab === 'liked'} />
          </Pressable>
          
          <Pressable 
            style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
            onPress={() => setActiveTab('saved')}
          >
            <BookmarkIcon active={activeTab === 'saved'} />
          </Pressable>
          
          <Pressable 
            style={[styles.tab, activeTab === 'private' && styles.activeTab]}
            onPress={() => setActiveTab('private')}
          >
            <LockIcon active={activeTab === 'private'} />
          </Pressable>
        </View>

        {/* Video Grid */}
        <FlatList
          data={getCurrentVideos()}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          scrollEnabled={false}
          columnWrapperStyle={styles.videoRow}
          contentContainerStyle={styles.videoGrid}
        />

        {getCurrentVideos().length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📹</Text>
            <Text style={styles.emptyText}>No videos yet</Text>
          </View>
        )}
      </ScrollView>

      {/* Edit Profile Modal */}
      <EditProfile
        visible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        userData={userData}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    width: 40,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  menuIcon: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  profilePicture: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  profileInitial: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  username: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 40,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#333',
    marginHorizontal: 20,
  },
  editButton: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  bio: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 16,
    marginHorizontal: 24,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#fff',
  },
  videoGrid: {
    paddingTop: 2,
  },
  videoRow: {
    gap: 2,
  },
  videoItem: {
    width: VIDEO_SIZE,
    height: VIDEO_SIZE * 1.4,
    marginBottom: 2,
  },
  videoThumbnail: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'flex-end',
    borderRadius: 2,
  },
  pinnedBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(254, 44, 85, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  pinnedText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  videoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  playIcon: {
    color: '#fff',
    fontSize: 12,
    marginRight: 4,
  },
  viewCount: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
  },
});
