import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Dimensions,
  FlatList,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_SIZE = (SCREEN_WIDTH - 6) / 3;

// Search Icon
const SearchIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke="#888" strokeWidth="2" />
    <Path d="M21 21l-4.35-4.35" stroke="#888" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// Clear Icon
const ClearIcon = () => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Path d="M18 6L6 18M6 6l12 12" stroke="#888" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Mock trending data
  const trendingHashtags = [
    { id: '1', tag: 'learn', views: '1.2B', color: '#ff6b6b' },
    { id: '2', tag: 'fyp', views: '850M', color: '#4ecdc4' },
    { id: '3', tag: 'productivity', views: '654M', color: '#45b7d1' },
    { id: '4', tag: 'tutorial', views: '432M', color: '#f7b731' },
    { id: '5', tag: 'education', views: '389M', color: '#5f27cd' },
    { id: '6', tag: 'tips', views: '298M', color: '#00d2d3' },
  ];

  const trendingCreators = [
    { id: '1', username: 'educator1', followers: '1.2M' },
    { id: '2', username: 'teacher2', followers: '890K' },
    { id: '3', username: 'coach3', followers: '765K' },
  ];

  const categories = [
    { id: '1', name: 'Education', icon: '📚' },
    { id: '2', name: 'Technology', icon: '💻' },
    { id: '3', name: 'Science', icon: '🔬' },
    { id: '4', name: 'Business', icon: '💼' },
    { id: '5', name: 'Languages', icon: '🌍' },
    { id: '6', name: 'Art', icon: '🎨' },
  ];

  const trendingVideos = Array.from({ length: 12 }, (_, i) => ({
    id: `video-${i}`,
    views: `${Math.floor(Math.random() * 500 + 100)}K`,
  }));

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
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
    <View style={styles.container}>
      {/* Header with Search */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <SearchIcon />
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={clearSearch} style={styles.clearButton}>
              <ClearIcon />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!isSearching ? (
          <>
            {/* Trending Hashtags */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trending Hashtags</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {trendingHashtags.map((item) => (
                  <Pressable key={item.id} style={[styles.hashtagCard, { borderColor: item.color }]}>
                    <View style={[styles.hashtagDot, { backgroundColor: item.color }]} />
                    <Text style={styles.hashtagText}>#{item.tag}</Text>
                    <Text style={styles.hashtagViews}>{item.views} views</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <View style={styles.categoriesGrid}>
                {categories.map((category) => (
                  <Pressable key={category.id} style={styles.categoryCard}>
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Trending Creators */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trending Creators</Text>
              {trendingCreators.map((creator) => (
                <Pressable key={creator.id} style={styles.creatorItem}>
                  <View style={styles.creatorAvatar}>
                    <Text style={styles.creatorInitial}>
                      {creator.username.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.creatorInfo}>
                    <Text style={styles.creatorUsername}>@{creator.username}</Text>
                    <Text style={styles.creatorFollowers}>{creator.followers} followers</Text>
                  </View>
                  <Pressable style={styles.followButton}>
                    <Text style={styles.followButtonText}>Follow</Text>
                  </Pressable>
                </Pressable>
              ))}
            </View>

            {/* Trending Videos */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trending Videos</Text>
              <FlatList
                data={trendingVideos}
                renderItem={renderVideoItem}
                keyExtractor={(item) => item.id}
                numColumns={3}
                scrollEnabled={false}
                columnWrapperStyle={styles.videoRow}
              />
            </View>
          </>
        ) : (
          <View style={styles.searchResults}>
            <Text style={styles.searchResultsTitle}>
              Results for "{searchQuery}"
            </Text>
            <FlatList
              data={trendingVideos}
              renderItem={renderVideoItem}
              keyExtractor={(item) => item.id}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={styles.videoRow}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingVertical: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  // Trending Hashtags
  hashtagCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginLeft: 16,
    minWidth: 140,
    borderWidth: 2,
  },
  hashtagDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  hashtagText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  hashtagViews: {
    color: '#888',
    fontSize: 12,
  },
  // Categories
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    width: (SCREEN_WIDTH - 48) / 2,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Trending Creators
  creatorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  creatorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  creatorInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  creatorInfo: {
    flex: 1,
  },
  creatorUsername: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  creatorFollowers: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  followButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#fe2c55',
  },
  followButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // Videos Grid
  videoRow: {
    gap: 2,
    paddingHorizontal: 16,
  },
  videoItem: {
    width: (SCREEN_WIDTH - 34) / 3,
    height: ((SCREEN_WIDTH - 34) / 3) * 1.4,
    marginBottom: 2,
  },
  videoThumbnail: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
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
  // Search Results
  searchResults: {
    paddingTop: 20,
  },
  searchResultsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
});
