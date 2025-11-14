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
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubPosition, setScrubPosition] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  
  // Double tap detection
  const lastTap = useRef(null);
  const [likeAnimScale] = useState(new Animated.Value(0));
  const [likeAnimOpacity] = useState(new Animated.Value(0));

  // Handle video playback based on isActive prop - CRITICAL for TikTok behavior
  useEffect(() => {
    const handlePlayback = async () => {
      if (!videoRef.current) return;

      try {
        if (isActive) {
          // Only play if video is ready
          if (isVideoReady) {
            await videoRef.current.playAsync();
            setIsPlaying(true);
          }
        } else {
          // Pause and reset non-active videos
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
  }, [isActive, isVideoReady]);

  // Pan responder for progress bar scrubbing - FIXED version
  const progressPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: async (evt) => {
        if (!isVideoReady || duration === 0) return;
        
        setIsScrubbing(true);
        
        // Calculate initial scrub position from tap location
        const touchX = evt.nativeEvent.locationX;
        const percentage = Math.max(0, Math.min(1, touchX / SCREEN_WIDTH));
        const newPosition = percentage * duration;
        setScrubPosition(newPosition);
        
        try {
          if (videoRef.current) {
            await videoRef.current.pauseAsync();
          }
        } catch (error) {
          console.log('Pause error:', error);
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!isVideoReady || duration === 0) return;
        
        // Use the absolute X position on screen
        const touchX = gestureState.moveX;
        const percentage = Math.max(0, Math.min(1, touchX / SCREEN_WIDTH));
        const newPosition = percentage * duration;
        setScrubPosition(newPosition);
      },
      onPanResponderRelease: async () => {
        if (!isVideoReady || !isScrubbing) return;
        
        try {
          if (videoRef.current) {
            // Seek to the scrubbed position
            await videoRef.current.setPositionAsync(scrubPosition);
            // Resume playing if video was active
            if (isActive) {
              await videoRef.current.playAsync();
              setIsPlaying(true);
            }
          }
        } catch (error) {
          console.log('Scrub release error:', error);
        } finally {
          setIsScrubbing(false);
        }
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
      // Mark video as ready when first loaded
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

  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;
  const scrubPercentage = duration > 0 ? (scrubPosition / duration) * 100 : 0;

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
        shouldPlay={false} // Control via ref instead
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        progressUpdateIntervalMillis={100}
      />

      {/* Scrubbing Overlay - Dims video when scrubbing */}
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
        {/* Profile and Video Info */}
        <View style={styles.infoSection}>
          <Text style={styles.username}>@{video.creator}</Text>
          <Text style={styles.description}>{video.description}</Text>
        </View>
      </View>

      {/* Progress Bar - Full Width at Bottom */}
      <View style={styles.progressSection} {...progressPanResponder.panHandlers}>
        {/* Time Display - Shows when scrubbing */}
        {isScrubbing && (
          <View style={styles.timeDisplay}>
            <Text style={styles.timeText}>{formatTime(scrubPosition)}</Text>
          </View>
        )}

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${isScrubbing ? scrubPercentage : progressPercentage}%` }
              ]} 
            />
          </View>
          {/* Progress Circle/Thumb */}
          <View 
            style={[
              styles.progressThumb, 
              { left: `${isScrubbing ? scrubPercentage : progressPercentage}%` }
            ]} 
          />
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
  },
  description: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
  },
  progressSection: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  timeDisplay: {
    position: 'absolute',
    top: -30,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 20,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: '100%',
  },
  progressFill: {
    height: 3,
    backgroundColor: '#fff',
  },
  progressThumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginLeft: -6,
    top: 4,
  },
});
