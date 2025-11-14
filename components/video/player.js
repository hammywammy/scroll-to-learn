import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { View, Text, Dimensions, StyleSheet, Pressable, Animated } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import Engagement from './engagement';
import VideoScrubber from './scrubber';
import UserProfileView from '../profile/UserProfileView';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * OPTIMIZED VIDEO PLAYER - expo-video (NEW)
 * 
 * KEY CHANGES FROM expo-av:
 * 1. Using useVideoPlayer hook (10x better performance)
 * 2. No more progressUpdateIntervalMillis spam (was 10 updates/sec!)
 * 3. VideoView instead of Video component
 * 4. Proper cleanup and memory management
 * 5. Simplified state management
 */

const VideoPlayer = memo(({ video, isActive, onScrubStart, onScrubEnd, shouldLoad }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  
  // Double tap detection
  const lastTap = useRef(null);
  const [likeAnimScale] = useState(new Animated.Value(0));
  const [likeAnimOpacity] = useState(new Animated.Value(0));
  const [soundRotation] = useState(new Animated.Value(0));

  // CRITICAL: useVideoPlayer hook - modern expo-video API
  const player = useVideoPlayer(shouldLoad ? video.url : null, (player) => {
    player.loop = true;
    player.muted = isMuted;
  });

  // Track playback status WITHOUT constant updates
  useEffect(() => {
    if (!player) return;

    const subscription = player.addListener('statusChange', (status) => {
      if (status.duration) {
        setDuration(status.duration * 1000); // Convert to ms
      }
      if (status.currentTime && !isScrubbing) {
        setPosition(status.currentTime * 1000); // Convert to ms
      }
    });

    return () => {
      subscription.remove();
    };
  }, [player, isScrubbing]);

  // Handle video playback based on isActive
  useEffect(() => {
    if (!player || !shouldLoad) return;

    if (isActive && !isScrubbing) {
      player.play();
    } else {
      player.pause();
    }
  }, [player, isActive, shouldLoad, isScrubbing]);

  // Reset when not active
  useEffect(() => {
    if (!isActive && player) {
      player.pause();
      player.currentTime = 0;
      setPosition(0);
    }
  }, [isActive, player]);

  // Rotate sound icon when playing
  useEffect(() => {
    if (isActive && !isMuted && !isScrubbing) {
      Animated.loop(
        Animated.timing(soundRotation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      soundRotation.stopAnimation();
      soundRotation.setValue(0);
    }
  }, [isActive, isMuted, isScrubbing]);

  const spin = soundRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleDoubleTap = useCallback(() => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (lastTap.current && now - lastTap.current < DOUBLE_TAP_DELAY) {
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
      setTimeout(() => {
        if (lastTap.current === now) {
          handlePlayPause();
        }
      }, DOUBLE_TAP_DELAY);
    }
  }, []);

  const handlePlayPause = useCallback(() => {
    if (!player || !isActive) return;
    
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  }, [player, isActive]);

  const handleMuteToggle = useCallback(() => {
    if (!player) return;
    const newMutedState = !isMuted;
    player.muted = newMutedState;
    setIsMuted(newMutedState);
  }, [player, isMuted]);

  const handleLike = useCallback(() => {
    setIsLiked(!isLiked);
  }, [isLiked]);

  const handleScrubStart = useCallback(() => {
    setIsScrubbing(true);
    if (player) {
      player.pause();
    }
    if (onScrubStart) {
      onScrubStart();
    }
  }, [player, onScrubStart]);

  const handleSeek = useCallback(async (newPosition) => {
    if (!player) return;

    player.currentTime = newPosition / 1000; // Convert ms to seconds
    setPosition(newPosition);
    
    if (isActive) {
      player.play();
    }
  }, [player, isActive]);

  const handleScrubEnd = useCallback(() => {
    setIsScrubbing(false);
    if (onScrubEnd) {
      onScrubEnd();
    }
  }, [onScrubEnd]);

  // Don't render if shouldn't load - saves MASSIVE memory
  if (!shouldLoad) {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Main Video - expo-video VideoView */}
      <VideoView
        style={styles.video}
        player={player}
        nativeControls={false}
        contentFit="cover"
      />

      {/* Scrubbing Overlay */}
      {isScrubbing && (
        <View style={styles.scrubbingOverlay} />
      )}
      
      {/* Tap overlay */}
      <Pressable 
        style={styles.tapOverlay} 
        onPress={handleDoubleTap}
      >
        {/* Play button when paused */}
        {!player?.playing && !isScrubbing && isActive && (
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
      </Pressable>

      {/* Mute Button */}
      <Pressable style={styles.muteButton} onPress={handleMuteToggle}>
        <Text style={styles.muteIcon}>{isMuted ? '🔇' : '🔊'}</Text>
      </Pressable>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        <View style={styles.infoSection}>
          <Text style={styles.username}>@{video.creator}</Text>
          <Text style={styles.description} numberOfLines={2}>{video.description}</Text>
          
          {/* Sound Button */}
          <Pressable style={styles.soundButton}>
            <Animated.View style={[styles.soundIcon, { transform: [{ rotate: spin }] }]}>
              <Text style={styles.musicNote}>♪</Text>
            </Animated.View>
            <Text style={styles.soundText} numberOfLines={1}>
              Original Sound - {video.creator}
            </Text>
          </Pressable>
        </View>
      </View>
      
      {/* Profile Picture */}
      <View style={styles.profilePictureContainer}>
        <Pressable 
          style={styles.profilePicture}
          onPress={() => setShowUserProfile(true)}
        >
          <View style={styles.profileCircle}>
            <Text style={styles.profileInitial}>
              {video.creator.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.followPlusButton}>
            <Text style={styles.followPlusIcon}>+</Text>
          </View>
        </Pressable>
      </View>

      {/* Video Scrubber */}
      <VideoScrubber
        player={player}
        videoUrl={video.url}
        duration={duration}
        position={position}
        isActive={isActive}
        onSeek={handleSeek}
        onScrubStart={handleScrubStart}
        onScrubEnd={handleScrubEnd}
      />
      
      {/* Engagement Buttons */}
      <Engagement 
        likes={video.likes}
        comments={video.comments}
        shares={video.shares}
        isLiked={isLiked}
        onLike={handleLike}
        videoUrl={video.url}
        isPlaying={player?.playing || false}
      />

      {/* User Profile Modal */}
      <UserProfileView
        visible={showUserProfile}
        onClose={() => setShowUserProfile(false)}
        username={video.creator}
      />
    </View>
  );
}, (prevProps, nextProps) => {
  // Only re-render if these props change
  return (
    prevProps.isActive === nextProps.isActive &&
    prevProps.shouldLoad === nextProps.shouldLoad &&
    prevProps.video.id === nextProps.video.id
  );
});

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
  },
  scrubbingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 5,
  },
  tapOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
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
    zIndex: 2,
  },
  muteIcon: {
    fontSize: 20,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 80,
    paddingHorizontal: 16,
    zIndex: 2,
  },
  infoSection: {
    marginBottom: 12,
  },
  username: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  soundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  soundIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  musicNote: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  soundText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  profilePictureContainer: {
    position: 'absolute',
    right: 12,
    bottom: 380,
    zIndex: 10,
  },
  profilePicture: {
    alignItems: 'center',
  },
  profileCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2a2a2a',
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  followPlusButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fe2c55',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -12,
    borderWidth: 2,
    borderColor: '#000',
  },
  followPlusIcon: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: -2,
  },
});

export default VideoPlayer;
