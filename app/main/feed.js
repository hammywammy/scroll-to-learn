import React, { useState, useRef, useCallback } from 'react';
import { View, FlatList, Dimensions, StyleSheet } from 'react-native';
import VideoPlayer from '../../components/video/player';
import { mockVideos } from '../../lib/constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Feed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Use ref to track which index is actually playing to avoid state-based re-renders
  const currentIndexRef = useRef(0);

  // Viewability configuration - video must be 50% visible to be considered "viewable"
  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
    minimumViewTime: 0,
  }).current;

  // Handle viewable items changed - critical for TikTok-like experience
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      const newIndex = viewableItems[0].index ?? 0;
      currentIndexRef.current = newIndex;
      setCurrentIndex(newIndex);
    }
  }).current;

  // Optimize FlatList rendering
  const renderItem = useCallback(({ item, index }) => {
    return (
      <VideoPlayer 
        video={item} 
        isActive={index === currentIndex} 
      />
    );
  }, [currentIndex]);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <FlatList
      data={mockVideos}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={SCREEN_HEIGHT}
      snapToAlignment="start"
      decelerationRate="fast"
      viewabilityConfig={viewabilityConfig}
      onViewableItemsChanged={onViewableItemsChanged}
      // Performance optimizations
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
  );
}
