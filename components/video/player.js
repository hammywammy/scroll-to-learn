import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, Pressable } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import Engagement from './engagement';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function VideoPlayer({ video, isActive }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Handle video playback based on isActive prop
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.playAsync();
        setIsPlaying(true);
      } else {
        videoRef.current.pauseAsync();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await videoRef.current.playAsync();
        setIsPlaying(true);
      }
    }
  };

  const handleMuteToggle = async () => {
    if (videoRef.current) {
      await videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
      setIsPlaying(status.isPlaying);
    }
  };

  const handleSeek = async (locationX, width) => {
    if (videoRef.current && duration > 0) {
      const percentage = locationX / width;
      const seekPosition = percentage * duration;
      await videoRef.current.setPositionAsync(seekPosition);
    }
  };

  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={{ uri: video.url }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted={isMuted}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        progressUpdateIntervalMillis={100}
      />
      
      {/* Play/Pause Overlay */}
      <Pressable style={styles.playPauseOverlay} onPress={handlePlayPause}>
        {!isPlaying && (
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        )}
      </Pressable>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        {/* Progress Bar */}
        <Pressable 
          style={styles.progressContainer}
          onPress={(e) => {
            const { locationX } = e.nativeEvent;
            handleSeek(locationX, SCREEN_WIDTH - 40);
          }}
        >
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
        </Pressable>

        {/* Time Display */}
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>
            {formatTime(position)} / {formatTime(duration)}
          </Text>
        </View>

        {/* Video Info */}
        <View style={styles.bottomInfo}>
          <Text style={styles.username}>@{video.creator}</Text>
          <Text style={styles.description}>{video.description}</Text>
        </View>
      </View>

      {/* Mute Button */}
      <Pressable style={styles.muteButton} onPress={handleMuteToggle}>
        <Text style={styles.muteIcon}>{isMuted ? '🔇' : '🔊'}</Text>
      </Pressable>
      
      {/* Engagement Buttons */}
      <Engagement 
        likes={video.likes}
        comments={video.comments}
        shares={video.shares}
        isLiked={isLiked}
        onLike={() => setIsLiked(!isLiked)}
        videoUrl={video.url}
      />
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
  playPauseOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 32,
    color: '#fff',
    marginLeft: 5,
  },
  muteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  muteIcon: {
    fontSize: 20,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 80,
    paddingBottom: 100,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
    paddingVertical: 8,
  },
  progressBar: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  timeContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  timeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '500',
  },
  bottomInfo: {
    paddingHorizontal: 20,
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
