import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { Video, ResizeMode } from 'expo-video';
import Engagement from './engagement';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function VideoPlayer({ video, isActive }) {
  return (
    <View style={styles.container}>
      <Video
        source={{ uri: video.url }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay={isActive}
        isLooping
        isMuted
      />
      
      <View style={styles.overlay}>
        <View style={styles.bottomInfo}>
          <Text style={styles.username}>@{video.creator}</Text>
          <Text style={styles.description}>{video.description}</Text>
        </View>
        
        <Engagement 
          likes={video.likes}
          comments={video.comments}
          shares={video.shares}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  overlay: {
    flex: 1,
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 80,
  },
  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#fff',
    fontSize: 14,
  },
});
