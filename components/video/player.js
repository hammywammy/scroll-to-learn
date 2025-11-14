import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, Pressable, Animated } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import Engagement from './engagement';
import VideoScrubber from './scrubber';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function VideoPlayer({ video, isActive, onScrubStart, onScrubEnd }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  
  // Double tap detection
  const lastTap = useRef(null);
  const [likeAnimScale] = useState(new Animated.Value(0));
  const [likeAnimOpacity] = useState(new Animated.Value(0));

  // Sound icon rotation animation
  const [soundRotation] = useState(new Animated.Value(0));

  // Rotate sound icon continuously when video is playing
  useEffect(() => {
    if (isPlaying && !isMuted) {
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
  }, [isPlaying, isMuted]);

  const spin = soundRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Handle video playback based on isActive prop
  useEffect(() => {
    const handlePlayback = async () => {
      if (!videoRef.current) return;

      try {
        if (isActive) {
          if (isVideoReady && !isScrubbing) {
            await videoRef.current.playAsync();
            setIsPlaying(true);
          }
        } else {
          await videoRef.current.pauseAsync();
          await videoRef.current.setPositionAsync(0);
          setIsPlaying(false);
          setPosition(0);
        }
      } catch (error) {
        console.log('Playback control error:', error);
      }
    };
    
    handlePlayback();
  }, [isActive, isVideoReady, isScrubbing]);

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
    if (!videoRef.current || !isActive) return;
    
    try {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        await videoRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Play/pause error:', error);
    }
  };

  const handleMuteToggle = async () => {
    if (!videoRef.current) return;
    
    try {
      await videoRef.current.setIsMutedAsync(!isMuted);
      setIsMuted(!isMuted);
    } catch (error) {
      console.log('Mute toggle error:', error);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      if (!isVideoReady) {
        setIsVideoReady(true);
      }
      
      setDuration(status.durationMillis || 0);
      
      // Only update position if not scrubbing
      if (!isScrubbing) {
        setPosition(status.positionMillis || 0);
      }
      
      setIsPlaying(status.isPlaying);
    } else if (status.error) {
      console.log('Video error:', status.error);
      setIsVideoReady(false);
    }
  };

  // Handle scrub start - pause video and notify parent to disable scroll
  const handleScrubStart = async () => {
    setIsScrubbing(true);
    
    if (videoRef.current) {
      try {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      } catch (error) {
        console.log('Pause error during scrub:', error);
      }
    }
    
    // Notify parent Feed component to disable scrolling
    if (onScrubStart) {
      onScrubStart();
    }
  };

  // Handle seek - update video position
  const handleSeek = async (newPosition) => {
    if (!videoRef.current || !isVideoReady) return;

    try {
      await videoRef.current.setPositionAsync(newPosition);
      setPosition(newPosition);
      
      // Resume playing if video is active
      if (isActive) {
        await videoRef.current.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Seek error:', error);
    }
  };

  // Handle scrub end - notify parent to enable scroll
  const handleScrubEnd = () => {
    setIsScrubbing(false);
    
    // Notify parent Feed component to enable scrolling
    if (onScrubEnd) {
      onScrubEnd();
    }
  };

  return (
    <View style={styles.container}>
      {/* Main Video */}
      <Video
        ref={videoRef}
        source={{ uri: video.url }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping
        isMuted={isMuted}
        shouldPlay={false}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        progressUpdateIntervalMillis={100}
      />

      {/* Scrubbing Overlay - dims video slightly */}
      {isScrubbing && (
        <View style={styles.scrubbingOverlay} />
      )}
      
      {/* Tap overlay for play/pause and double-tap */}
      <Pressable 
        style={styles.tapOverlay} 
        onPress={handleDoubleTap}
      >
        {/* Play button when paused */}
        {!isPlaying && !isScrubbing && isActive && (
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

      {/* Bottom Section - TikTok Style */}
      <View style={styles.bottomSection}>
        <View style={styles.infoSection}>
          <Text style={styles.username}>@{video.creator}</Text>
          <Text style={styles.description} numberOfLines={2}>{video.description}</Text>
          
          {/* Sound/Music Button */}
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
      
      {/* Profile Picture - Bottom Right (Above Engagement Buttons) */}
      <View style={styles.profilePictureContainer}>
        <Pressable style={styles.profilePicture}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileInitial}>
              {video.creator.charAt(0).toUpperCase()}
            </Text>
          </View>
          {/* Follow Plus Button */}
          <View style={styles.followPlusButton}>
            <Text style={styles.followPlusIcon}>+</Text>
          </View>
        </Pressable>
      </View>

      {/* TikTok-Style Video Scrubber with Mini Preview */}
      <VideoScrubber
        videoRef={videoRef}
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
    bottom: 260,
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
