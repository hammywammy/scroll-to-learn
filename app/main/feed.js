import React, { useState } from 'react';
import { View, FlatList, Dimensions, StyleSheet } from 'react-native';
import VideoPlayer from '../../components/video/player';
import { mockVideos } from '../../lib/constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Feed() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <FlatList
      data={mockVideos}
      renderItem={({ item, index }) => (
        <VideoPlayer video={item} isActive={index === currentIndex} />
      )}
      keyExtractor={item => item.id}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      snapToInterval={SCREEN_HEIGHT}
      decelerationRate="fast"
      onScroll={(e) => {
        const index = Math.round(e.nativeEvent.contentOffset.y / SCREEN_HEIGHT);
        setCurrentIndex(index);
      }}
    />
  );
}
