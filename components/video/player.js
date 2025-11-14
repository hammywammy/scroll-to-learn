import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, Pressable, Animated } from 'react-native';
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
  
  // Progress bar interaction state
  const progressBarRef = useRef(null);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [progressBarX, setProgressBarX] = useState(0);
  
  // Double tap detection
  const lastTap = useRef(null);
  const [likeAnimScale] = useState(new Animated.Value(0));
  const [likeAnimOpacity] = useState(new Animated.Value(0));

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

  // Handle progress bar tap - CRITICAL: Simple tap-to-seek
  const handleProgressBarPress = async (event) => {
    if (!isVideoReady || duration === 0 || !progressBarWidth) return;

    const touchX = event.nativeEvent.locationX;
    const percentage = Math.max(0, Math.min(1, touchX / progressBarWidth));
    const newPosition = percentage * duration;

    try {
      if (videoRef.current) {
        await videoRef.current.pauseAsync();
        await videoRef.current.setPositionAsync(newPosition);
        setPosition(newPosition);
        
        // Resume playing if active
        if (isActive) {
          await videoRef.current.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.log('Seek error:', error);
    }
  };

  // Handle scrubbing start
  const handleScrubStart = async (event) => {
    if (!isVideoReady || duration === 0 || !progressBarWidth) return;

    setIsScrubbing(true);
    
    const touchX = event.nativeEvent.locationX;
    const percentage = Math.max(0, Math.min(1, touchX / progressBarWidth));
    const newPosition = percentage * duration;
    setScrubPosition(newPosition);

    try {
      if (videoRef.current) {
        await videoRef.current.pauseAsync();
        setIsPlaying(false);
      }
    } catch (error) {
      console.log('Scrub start error:', error);
    }
  };

  // Handle scrubbing move
  const handleScrubMove = (event) => {
    if (!isScrubbing || duration === 0 || !progressBarWidth) return;

    const touchX = event.nativeEvent.pageX - progressBarX;
    const percentage = Math.max(0, Math.min(1, touchX / progressBarWidth));
    const newPosition = percentage * duration;
    setScrubPosition(newPosition);
  };

  // Handle scrubbing end
  const handleScrubEnd = async () => {
    if (!isScrubbing || !isVideoReady) return;

    try {
      if (videoRef.current) {
        await videoRef.current.setPositionAsync(scrubPosition);
        setPosition(scrubPosition);
        
        // Resume playing if video is active
        if (isActive) {
          await videoRef.current.playAsync();
          setIsPlaying(true);
        }
      }
    } catch (error) {
      console.log('Scrub end error:', error);
    } finally {
      setIsScrubbing(false);
    }
  };

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

  // Measure progress bar layout
  const onProgressBarLayout = (event) => {
    const { width, x } = event.nativeEvent.layout;
    setProgressBarWidth(width);
    
    // Get absolute position
    progressBarRef.current?.measureInWindow((x, y, width, height) => {
      setProgressBarX(x);
    });
  };

  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;
  const scrubPercentage = duration > 0 ? (scrubPosition / duration) * 100 : 0;
  const displayedPercentage = isScrubbing ? scrubPercentage : progressPercentage;

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

      {/* Scrubbing Overlay */}
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
          <Text style={styles.description}>{video.description}</Text>
        </View>
      </View>

      {/* TikTok-Style Progress Bar - FIXED VERSION */}
      <View style={styles.progressSection}>
        {/* Time Display - Shows when scrubbing */}
        {isScrubbing && (
          <View 
            style={[
              styles.timeDisplay,
              { left: `${scrubPercentage}%` }
            ]}
          >
            <Text style={styles.timeText}>{formatTime(scrubPosition)}</Text>
          </View>
        )}

        {/* Progress Bar Container with Touch Handlers */}
        <View
          ref={progressBarRef}
          style={styles.progressBarContainer}
          onLayout={onProgressBarLayout}
          onStartShouldSetResponder={() => true}
          onResponderGrant={handleScrubStart}
          onResponderMove={handleScrubMove}
          onResponderRelease={handleScrubEnd}
          onResponderTerminate={handleScrubEnd}
        >
          {/* Background Bar */}
          <View style={styles.progressBar}>
            {/* Filled Progress */}
            <View 
              style={[
                styles.progressFill, 
                { width: `${displayedPercentage}%` }
              ]} 
            />
          </View>
          
          {/* Progress Thumb/Dot - Only visible when scrubbing or hovering */}
          {(isScrubbing || displayedPercentage > 0) && (
            <View 
              style={[
                styles.progressThumb, 
                { 
                  left: `${displayedPercentage}%`,
                  opacity: isScrubbing ? 1 : 0.8
                }
              ]} 
            />
          )}
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
    top: -35,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: -30, // Center above thumb
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 30, // Larger touch target
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  progressBar: {
    height: 3, // Thin like TikTok
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: '100%',
    borderRadius: 1.5,
  },
  progressFill: {
    height: 3,
    backgroundColor: '#fff',
    borderRadius: 1.5,
  },
  progressThumb: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginLeft: -6, // Center on position
    top: 9, // Center vertically in 30px container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});
