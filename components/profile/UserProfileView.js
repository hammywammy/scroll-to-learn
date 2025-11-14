import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
  FlatList,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const VIDEO_SIZE = (SCREEN_WIDTH - 6) / 3;

export default function UserProfileView({ visible, onClose, username }) {
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock user data - this would come from API
  const userData = {
    name: username || 'educator1',
    username: username || 'educator1',
    bio: '🎓 Educational content creator\n💡 Teaching complex topics simply\n📚 New videos daily',
    following: 234,
    followers: '45.2K',
    likes: '892K',
  };

  // Mock videos
  const userVideos = Array.from({ length: 9 }, (_, i) => ({
    id: `user-video-${i + 1}`,
    views: `${Math.floor(Math.random() * 200 + 50)}K`,
  }));

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const renderVideoItem = ({ item }) => (
    <Pressable style={styles.videoItem}>
      <View style={styles.videoThumbnail}>
        <View style={styles.videoOverlay}>
          <Text style={styles.playIcon}>▶</Text>
          <Text style={styles.viewCount}>{item.views}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Dark overlay */}
        <Pressable style={styles.overlay} onPress={onClose} />

        {/* Bottom Sheet */}
        <View style={styles.bottomSheet}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Profile Info */}
            <View style={styles.profileSection}>
              <View style={styles.profilePicture}>
                <Text style={styles.profileInitial}>
                  {userData.name.charAt(0).toUpperCase()}
                </Text>
              </View>

              <Text style={styles.name}>{userData.name}</Text>
              <Text style={styles.username}>@{userData.username}</Text>

              {/* Stats */}
              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{userData.following}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
                
                <View style={styles.statDivider} />
                
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{userData.followers}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                
                <View style={styles.statDivider} />
                
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{userData.likes}</Text>
                  <Text style={styles.statLabel}>Likes</Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <Pressable 
                  style={[styles.followButton, isFollowing && styles.followingButton]}
                  onPress={handleFollow}
                >
                  <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </Pressable>

                <Pressable style={styles.messageButton}>
                  <Text style={styles.messageIcon}>💬</Text>
                </Pressable>

                <Pressable style={styles.moreButton}>
                  <Text style={styles.moreIcon}>▼</Text>
                </Pressable>
              </View>

              {/* Bio */}
              <Text style={styles.bio}>{userData.bio}</Text>
            </View>

            {/* Videos Section */}
            <View style={styles.videosSection}>
              <View style={styles.videosSectionHeader}>
                <Text style={styles.videosSectionTitle}>Videos</Text>
              </View>

              <FlatList
                data={userVideos}
                renderItem={renderVideoItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
                scrollEnabled={false}
                columnWrapperStyle={styles.videoRow}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  bottomSheet: {
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: SCREEN_HEIGHT * 0.85,
    paddingBottom: 34,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#555',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeButton: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#444',
    marginBottom: 16,
  },
  profileInitial: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    color: '#888',
    fontSize: 15,
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
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
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  followButton: {
    flex: 1,
    backgroundColor: '#fe2c55',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#333',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  followingButtonText: {
    color: '#fff',
  },
  messageButton: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageIcon: {
    fontSize: 20,
  },
  moreButton: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreIcon: {
    color: '#fff',
    fontSize: 12,
  },
  bio: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  videosSection: {
    paddingTop: 16,
  },
  videosSectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
    marginBottom: 2,
  },
  videosSectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
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
    padding: 8,
  },
  videoOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playIcon: {
    color: '#fff',
    fontSize: 10,
    marginRight: 4,
  },
  viewCount: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});
