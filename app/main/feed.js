import React, { useState, useRef, useCallback, useMemo } from 'react';
import { View, FlatList, Dimensions, StyleSheet, Pressable, Text } from 'react-native';
import VideoPlayer from '../../components/video/player';
import { mockVideos } from '../../lib/constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * TikTok-LEVEL FEED OPTIMIZATION
 * Based on production TikTok clones and performance research:
 * - windowSize=3 (TikTok standard: current + 1 above + 1 below)
 * - maxToRenderPerBatch=1 (render one video at a time)
 * - Preload only immediate neighbors (not 2+ away)
 * - getItemLayout for instant layout calculations
 * - removeClippedSubviews for memory management
 */

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

  // Memoize data - prevents re-renders
  const memoizedData = useMemo(() => currentVideos, [currentVideos]);

  // TikTok uses 50% threshold
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

  // TikTok loads: current + 1 ahead + 1 behind (windowSize=3)
  const shouldLoadVideo = useCallback((itemIndex) => {
    const distance = Math.abs(itemIndex - currentIndex);
    return distance <= 1; // Only load immediate neighbors
  }, [currentIndex]);

  // Memoized render - CRITICAL: no inline functions
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

  // Stable key extractor
  const keyExtractor = useCallback((item) => item.id, []);

  // Pre-calculated layout - MASSIVE performance gain
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

      {/* OPTIMIZED Video Feed - TikTok Level */}
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
        
        // Visibility tracking
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        
        // Scrolling
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        
        // TIKTOK-LEVEL OPTIMIZATIONS
        removeClippedSubviews={true}      // Unmount off-screen = huge memory save
        maxToRenderPerBatch={1}           // Render 1 at a time (TikTok standard)
        windowSize={3}                    // Keep 3 screens (1 above, current, 1 below)
        initialNumToRender={1}            // Only render first video
        updateCellsBatchingPeriod={50}    // Faster updates (was 100ms)
        
        // Memory & scroll optimizations
        disableIntervalMomentum={true}
        disableScrollViewPanResponder={false}
        
        // Re-render control
        extraData={currentIndex}
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
