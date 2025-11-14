import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, FlatList, Dimensions, StyleSheet, Pressable, Text } from 'react-native';
import VideoPlayer from '../../components/video/player';
import { mockVideos } from '../../lib/constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// TikTok-style optimization constants
const PRELOAD_RANGE = 2; // Preload 2 videos ahead and behind
const RENDER_AHEAD = 1;  // How many items ahead to render

export default function Feed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('foryou');
  
  const currentIndexRef = useRef(0);
  const flatListRef = useRef(null);

  // Mock following feed
  const followingVideos = mockVideos.slice(0, 10);
  
  // Get current videos based on tab
  const currentVideos = activeTab === 'foryou' ? mockVideos : followingVideos;

  // Memoize the data to prevent unnecessary re-renders
  const memoizedData = useMemo(() => currentVideos, [currentVideos]);

  // Viewability configuration - CRITICAL for performance
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
    minimumViewTime: 0,
    waitForInteraction: false,
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      const newIndex = viewableItems[0].index ?? 0;
      currentIndexRef.current = newIndex;
      setCurrentIndex(newIndex);
    }
  }).current;

  // Determine which videos should be loaded based on current index
  // TikTok loads: current, next 2, previous 2
  const shouldLoadVideo = useCallback((itemIndex) => {
    const distance = Math.abs(itemIndex - currentIndex);
    return distance <= PRELOAD_RANGE;
  }, [currentIndex]);

  // Memoized render function - CRITICAL for performance
  const renderItem = useCallback(({ item, index }) => {
    const isActive = index === currentIndex;
    const shouldLoad = shouldLoadVideo(index);

    return (
      <VideoPlayer 
        video={item} 
        isActive={isActive}
        shouldLoad={shouldLoad}
        onScrubStart={() => setScrollEnabled(false)}
        onScrubEnd={() => setScrollEnabled(true)}
      />
    );
  }, [currentIndex, shouldLoadVideo]);

  // Key extractor - must be stable
  const keyExtractor = useCallback((item) => item.id, []);

  // Get item layout - CRITICAL for performance
  const getItemLayout = useCallback((data, index) => ({
    length: SCREEN_HEIGHT,
    offset: SCREEN_HEIGHT * index,
    index,
  }), []);

  return (
    <View style={styles.container}>
      {/* Top Tabs */}
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

      {/* Optimized Video Feed */}
      <FlatList
        ref={flatListRef}
        data={memoizedData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        
        // Paging
        pagingEnabled
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        
        // Visibility
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        
        // Scrolling
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        
        // CRITICAL OPTIMIZATIONS - TikTok Level
        removeClippedSubviews={true}        // Unmount off-screen views
        maxToRenderPerBatch={3}              // Render 3 at a time
        windowSize={5}                       // Keep 5 screens in memory (2 above, current, 2 below)
        initialNumToRender={2}               // Only render 2 initially
        updateCellsBatchingPeriod={100}      // Batch updates every 100ms
        
        // Memory optimizations
        disableIntervalMomentum={true}       // Better snap behavior
        disableScrollViewPanResponder={false}
        
        // Prevent unnecessary re-renders
        extraData={currentIndex}             // Only re-render when index changes
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
