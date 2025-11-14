import React, { useState, useRef, useCallback } from 'react';
import { View, FlatList, Dimensions, StyleSheet, Pressable, Text } from 'react-native';
import VideoPlayer from '../../components/video/player';
import { mockVideos } from '../../lib/constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Feed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('foryou'); // 'foryou' or 'following'
  
  const currentIndexRef = useRef(0);

  // Mock following feed (subset of videos)
  const followingVideos = mockVideos.slice(0, 10);
  
  // Get current videos based on tab
  const currentVideos = activeTab === 'foryou' ? mockVideos : followingVideos;

  // Viewability configuration
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
    minimumViewTime: 0,
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      const newIndex = viewableItems[0].index ?? 0;
      currentIndexRef.current = newIndex;
      setCurrentIndex(newIndex);
    }
  }).current;

  const renderItem = useCallback(({ item, index }) => {
    return (
      <VideoPlayer 
        video={item} 
        isActive={index === currentIndex}
        onScrubStart={() => setScrollEnabled(false)}
        onScrubEnd={() => setScrollEnabled(true)}
      />
    );
  }, [currentIndex]);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <View style={styles.container}>
      {/* Top Tabs - For You / Following */}
      <View style={styles.topTabs}>
        <Pressable 
          style={styles.tabButton}
          onPress={() => setActiveTab('following')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'following' && styles.activeTabText
          ]}>
            Following
          </Text>
          {activeTab === 'following' && <View style={styles.tabIndicator} />}
        </Pressable>

        <Pressable 
          style={styles.tabButton}
          onPress={() => setActiveTab('foryou')}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'foryou' && styles.activeTabText
          ]}>
            For You
          </Text>
          {activeTab === 'foryou' && <View style={styles.tabIndicator} />}
        </Pressable>
      </View>

      {/* Video Feed */}
      <FlatList
        data={currentVideos}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        scrollEnabled={scrollEnabled}
        removeClippedSubviews={true}
        maxToRenderPerBatch={2}
        windowSize={3}
        initialNumToRender={1}
        getItemLayout={(data, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topTabs: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    paddingVertical: 12,
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    position: 'relative',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 17,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  activeTabText: {
    color: '#fff',
    fontSize: 18,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#fff',
  },
});
