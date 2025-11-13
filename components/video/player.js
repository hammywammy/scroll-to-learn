import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, Pressable, Animated, PanResponder } from 'react-native';
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
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekPosition, setSeekPosition] = useState(0);
  
  // Double tap detection
  const lastTap = useRef(null);
  const [likeAnimScale] = useState(new Animated.Value(0));
  const [likeAnimOpacity] = useState(new Animated.Value(0));

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

  // Pan responder for hold and drag seeking
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only start seeking if moved more than 10px vertically
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderGrant: () => {
        setIsSeeking(true);
        if (videoRef.current) {
          videoRef.current.pauseAsync();
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (duration > 0) {
          // Calculate seek position based on vertical drag
          const dragPercentage = Math.max(0, Math.min(1, -gestureState.dy / 300));
          const newPosition = position + (dragPercentage * duration * 0.1);
          const clampedPosition = Math.max(0, Math.min(duration, newPosition));
          setSeekPosition(clampedPosition);
        }
      },
      onPanResponderRelease: async (evt, gestureState) => {
        if (isSeeking && videoRef.current) {
          await videoRef.current.setPositionAsync(seekPosition);
          if (isPlaying) {
            videoRef.current.playAsync();
          }
        }
        setIsSeeking(false);
      },
    })
  ).current;

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (lastTap.current && now - lastTap.current < DOUBLE_TAP_DELAY) {
      // Double tap detected - trigger like
      handleLike();
      
      // Animate heart
      likeAnimScale.setValue(0);
      likeAnimOpacity.setValue(1);
      
      Animated.parallel([
        Animated.spring(likeAnimScale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(likeAnimOpacity, {
          toValue: 0,
          duration: 800,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start();
      
      lastTap.current = null;
    } else {
      lastTap.current = now;
      // Single tap - toggle play/pause
      setTimeout(() => {
        if (lastTap.current === now) {
          handlePlayPause();
        }
      }, DOUBLE_TAP_DELAY);
    }
  };

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

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      if (!isSeeking) {
        setPosition(status.positionMillis || 0);
      }
      setIsPlaying(status.isPlaying);
    }
  };

  const handleSeek = async (locationX, width) => {
    if (videoRef.current && duration > 0) {
      const percentage = locationX / width;
      const newPosition = percentage * duration;
      await videoRef.current.setPositionAsync(newPosition);
    }
  };

  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;
  const seekPercentage = duration > 0 ? (seekPosition / duration) * 100 : 0;

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
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
      
      {/* Tap overlay for play/pause and double-tap */}
      <Pressable 
        style={styles.tapOverlay} 
        onPress={handleDoubleTap}
      >
        {/* Play button when paused */}
        {!isPlaying && !isSeeking && (
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        )}

        {/* Double-tap heart animation */}
        <Animated.View 
          style={[
            styles.doubleTapHeart,
            {
              opacity: likeAnimOpacity,
              transform: [{ scale: likeAnimScale }],
            },
          ]}
        >
          <Text style={styles.doubleTapHeartIcon}>❤️</Text>
        </Animated.View>

        {/* Seeking indicator with white circle */}
        {isSeeking && (
          <View style={styles.seekingIndicator}>
            <View style={styles.seekingCircle} />
            <Text style={styles.seekingText}>{formatTime(seekPosition)}</Text>
          </View>
        )}
      </Pressable>

      {/* Mute Button */}
      <Pressable style={styles.muteButton} onPress={handleMuteToggle}>
        <Text style={styles.muteIcon}>{isMuted ? '🔇' : '🔊'}</Text>
      </Pressable>

      {/* Bottom Section - TikTok Style */}
      <View style={styles.bottomSection}>
        {/* Profile and Video Info */}
        <View style={styles.infoSection}>
          <Text style={styles.username}>@{video.creator}</Text>
          <Text style={styles.description}>{video.description}</Text>
        </View>

        {/* Progress Bar - Below info */}
        <Pressable 
          style={styles.progressContainer}
          onPress={(e) => {
            const { locationX } = e.nativeEvent;
            handleSeek(locationX, SCREEN_WIDTH - 100);
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
      </View>
      
      {/* Engagement Buttons */}
      <Engagement 
        likes={video.likes}
        comments={video.comments}
        shares={video.shares}
        isLiked={isLiked}
        onLike={handleLike}
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
  tapOverlay: {
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
  doubleTapHeart: {
    position: 'absolute',
  },
  doubleTapHeartIcon: {
    fontSize: 120,
  },
  seekingIndicator: {
    alignItems: 'center',
  },
  seekingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  seekingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  muteButton: {
    position: 'absolute',
    top: 50,
    right: 16,
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
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 80,
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
  infoSection: {
    marginBottom: 12,
  },
  username: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
  },
  progressContainer: {
    paddingVertical: 8,
    marginBottom: 4,
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
    marginBottom: 8,
  },
  timeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 11,
    fontWeight: '500',
  },
});
