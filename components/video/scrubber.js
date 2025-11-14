import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * OPTIMIZED VIDEO SCRUBBER
 * 
 * CRITICAL CHANGES:
 * 1. NO thumbnail generation (was blocking UI thread)
 * 2. Simple time display only
 * 3. Smooth animations
 * 4. Works with expo-video player
 */

export default function VideoScrubber({ 
  player,
  videoUrl,
  duration, 
  position, 
  isActive,
  onSeek,
  onScrubStart,
  onScrubEnd,
}) {
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubPosition, setScrubPosition] = useState(0);
  const [previewPosition, setPreviewPosition] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  
  const progressBarRef = useRef(null);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [progressBarX, setProgressBarX] = useState(0);

  // Animations
  const [previewScale] = useState(new Animated.Value(0));
  const [previewOpacity] = useState(new Animated.Value(0));
  const [thumbScale] = useState(new Animated.Value(1));

  // Show preview animation
  const showPreviewWithAnimation = useCallback(() => {
    setShowPreview(true);
    
    Animated.parallel([
      Animated.spring(previewScale, {
        toValue: 1,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(previewOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(thumbScale, {
        toValue: 1.5,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Hide preview animation
  const hidePreviewWithAnimation = useCallback(() => {
    Animated.parallel([
      Animated.spring(previewScale, {
        toValue: 0.8,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(previewOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(thumbScale, {
        toValue: 1,
        friction: 6,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowPreview(false);
    });
  }, []);

  // Handle scrub start
  const handleScrubStart = useCallback((event) => {
    if (!progressBarWidth || duration === 0) return;

    const touchX = event.nativeEvent.locationX;
    const percentage = Math.max(0, Math.min(1, touchX / progressBarWidth));
    const newPosition = percentage * duration;
    
    setScrubPosition(newPosition);
    setPreviewPosition(percentage);
    setIsScrubbing(true);
    showPreviewWithAnimation();
    
    if (onScrubStart) {
      onScrubStart();
    }
  }, [progressBarWidth, duration, onScrubStart, showPreviewWithAnimation]);

  // Handle scrub move
  const handleScrubMove = useCallback((event) => {
    if (!isScrubbing || duration === 0 || !progressBarWidth) return;

    const touchX = event.nativeEvent.pageX - progressBarX;
    const percentage = Math.max(0, Math.min(1, touchX / progressBarWidth));
    const newPosition = percentage * duration;
    
    setScrubPosition(newPosition);
    setPreviewPosition(percentage);
  }, [isScrubbing, duration, progressBarWidth, progressBarX]);

  // Handle scrub end
  const handleScrubEnd = useCallback(async () => {
    if (!isScrubbing) return;

    hidePreviewWithAnimation();
    setIsScrubbing(false);
    
    if (onSeek) {
      await onSeek(scrubPosition);
    }
    
    if (onScrubEnd) {
      onScrubEnd();
    }
  }, [isScrubbing, scrubPosition, onSeek, onScrubEnd, hidePreviewWithAnimation]);

  // Measure progress bar
  const onProgressBarLayout = useCallback((event) => {
    const { width } = event.nativeEvent.layout;
    setProgressBarWidth(width);
    
    progressBarRef.current?.measureInWindow((x) => {
      setProgressBarX(x);
    });
  }, []);

  // Format time display
  const formatTime = useCallback((millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Calculate progress percentages
  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;
  const scrubPercentage = duration > 0 ? (scrubPosition / duration) * 100 : 0;
  const displayedPercentage = isScrubbing ? scrubPercentage : progressPercentage;

  // Calculate preview position with edge protection
  const previewLeft = Math.max(
    10,
    Math.min(
      SCREEN_WIDTH - 110,
      (previewPosition * SCREEN_WIDTH) - 50
    )
  );

  return (
    <View style={styles.container}>
      {/* Simple Time Preview (NO thumbnails - they kill performance) */}
      {showPreview && (
        <Animated.View 
          style={[
            styles.previewContainer,
            {
              left: previewLeft,
              opacity: previewOpacity,
              transform: [{ scale: previewScale }],
            },
          ]}
        >
          {/* Time Label */}
          <View style={styles.timeLabel}>
            <Text style={styles.timeText}>
              {formatTime(scrubPosition)}
            </Text>
          </View>

          {/* Pointer Triangle */}
          <View style={styles.triangle} />
        </Animated.View>
      )}

      {/* Progress Bar with Touch Handlers */}
      <View
        ref={progressBarRef}
        style={styles.progressBarContainer}
        onLayout={onProgressBarLayout}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handleScrubStart}
        onResponderMove={handleScrubMove}
        onResponderRelease={handleScrubEnd}
        onResponderTerminate={handleScrubEnd}
        onResponderTerminationRequest={() => false}
      >
        {/* Progress Bar Background */}
        <View style={styles.progressBar}>
          {/* Filled Progress */}
          <View 
            style={[
              styles.progressFill, 
              { width: `${displayedPercentage}%` }
            ]} 
          />
        </View>
        
        {/* Progress Thumb */}
        {displayedPercentage > 0 && (
          <Animated.View 
            style={[
              styles.progressThumb, 
              { 
                left: `${displayedPercentage}%`,
                transform: [{ scale: thumbScale }],
              }
            ]} 
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  progressBarContainer: {
    height: 32,
    justifyContent: 'center',
  },
  progressBar: {
    height: 3,
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
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#fff',
    marginLeft: -7,
    top: 9,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
  },
  previewContainer: {
    position: 'absolute',
    bottom: 48,
    width: 100,
    alignItems: 'center',
  },
  timeLabel: {
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  timeText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  triangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(0, 0, 0, 0.95)',
    marginTop: -1,
  },
});
