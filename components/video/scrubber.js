import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Image, Platform } from 'react-native';
import * as VideoThumbnails from 'expo-video-thumbnails';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Cache thumbnails to avoid regenerating
const thumbnailCache = new Map();

export default function VideoScrubber({ 
  videoRef, 
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
  const [thumbnailUri, setThumbnailUri] = useState(null);
  const [isLoadingThumbnail, setIsLoadingThumbnail] = useState(false);
  
  const progressBarRef = useRef(null);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [progressBarX, setProgressBarX] = useState(0);
  const thumbnailTimeout = useRef(null);
  const lastGeneratedTime = useRef(-1);

  // Preview animation
  const [previewScale] = useState(new Animated.Value(0));
  const [previewOpacity] = useState(new Animated.Value(0));

  // Generate thumbnail at scrub position (optimized)
  useEffect(() => {
    if (!isScrubbing || !videoUrl || scrubPosition <= 0 || duration <= 0) {
      return;
    }

    // Clear previous timeout
    if (thumbnailTimeout.current) {
      clearTimeout(thumbnailTimeout.current);
    }

    // Debounce - only generate after 100ms of no movement
    thumbnailTimeout.current = setTimeout(async () => {
      // Round to nearest second for caching
      const timeInSeconds = Math.floor(scrubPosition / 1000);
      
      // Don't regenerate if we just generated this second
      if (timeInSeconds === lastGeneratedTime.current) {
        return;
      }

      const cacheKey = `${videoUrl}_${timeInSeconds}`;
      
      // Check cache first
      if (thumbnailCache.has(cacheKey)) {
        setThumbnailUri(thumbnailCache.get(cacheKey));
        lastGeneratedTime.current = timeInSeconds;
        return;
      }

      setIsLoadingThumbnail(true);

      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(
          videoUrl,
          {
            time: scrubPosition,
            quality: 0.75, // TikTok-like quality
          }
        );
        
        // Cache the thumbnail
        thumbnailCache.set(cacheKey, uri);
        setThumbnailUri(uri);
        lastGeneratedTime.current = timeInSeconds;
      } catch (error) {
        console.log('Thumbnail generation error:', error);
      } finally {
        setIsLoadingThumbnail(false);
      }
    }, 100); // 100ms debounce

    return () => {
      if (thumbnailTimeout.current) {
        clearTimeout(thumbnailTimeout.current);
      }
    };
  }, [scrubPosition, isScrubbing, videoUrl, duration]);

  // Show preview with animation
  const showPreviewWithAnimation = () => {
    setShowPreview(true);
    Animated.parallel([
      Animated.spring(previewScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(previewOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Hide preview with animation
  const hidePreviewWithAnimation = () => {
    Animated.parallel([
      Animated.spring(previewScale, {
        toValue: 0.8,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(previewOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowPreview(false);
      setThumbnailUri(null);
      lastGeneratedTime.current = -1;
    });
  };

  // Handle scrubbing start
  const handleScrubStart = (event) => {
    if (!progressBarWidth || duration === 0) return;

    const touchX = event.nativeEvent.locationX;
    const percentage = Math.max(0, Math.min(1, touchX / progressBarWidth));
    const newPosition = percentage * duration;
    
    setScrubPosition(newPosition);
    setPreviewPosition(percentage);
    setIsScrubbing(true);
    showPreviewWithAnimation();
    
    // Notify parent to pause video and prevent scrolling
    if (onScrubStart) {
      onScrubStart();
    }
  };

  // Handle scrubbing move
  const handleScrubMove = (event) => {
    if (!isScrubbing || duration === 0 || !progressBarWidth) return;

    const touchX = event.nativeEvent.pageX - progressBarX;
    const percentage = Math.max(0, Math.min(1, touchX / progressBarWidth));
    const newPosition = percentage * duration;
    
    setScrubPosition(newPosition);
    setPreviewPosition(percentage);
  };

  // Handle scrubbing end
  const handleScrubEnd = async () => {
    if (!isScrubbing) return;

    hidePreviewWithAnimation();
    setIsScrubbing(false);
    
    // Notify parent to seek to position and resume
    if (onSeek) {
      await onSeek(scrubPosition);
    }
    
    if (onScrubEnd) {
      onScrubEnd();
    }
  };

  // Measure progress bar layout
  const onProgressBarLayout = (event) => {
    const { width } = event.nativeEvent.layout;
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

  // Calculate preview position (centered above thumb, with screen edge protection)
  const previewWidth = 100;
  const previewLeft = Math.max(
    10, // Min distance from left edge
    Math.min(
      SCREEN_WIDTH - previewWidth - 10, // Max distance from right edge
      (previewPosition * SCREEN_WIDTH) - (previewWidth / 2)
    )
  );

  return (
    <View style={styles.container}>
      {/* TikTok-Style Thumbnail Preview */}
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
          {/* Thumbnail Preview Window */}
          <View style={styles.thumbnailWrapper}>
            {thumbnailUri ? (
              <Image
                source={{ uri: thumbnailUri }}
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.thumbnailLoading}>
                <Text style={styles.loadingDots}>•••</Text>
              </View>
            )}
          </View>
          
          {/* Time Label */}
          <View style={styles.timeLabel}>
            <Text style={styles.timeText}>
              {formatTime(scrubPosition)}
            </Text>
          </View>

          {/* Triangle pointer */}
          <View style={styles.triangle} />
        </Animated.View>
      )}

      {/* Progress Bar Container with Touch Handlers */}
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
        onResponderTerminationRequest={() => false} // CRITICAL: Don't allow parent to steal responder
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
        
        {/* Progress Thumb/Dot */}
        {displayedPercentage > 0 && (
          <View 
            style={[
              styles.progressThumb, 
              { 
                left: `${displayedPercentage}%`,
                opacity: isScrubbing ? 1 : 0.8,
                transform: [{ scale: isScrubbing ? 1.3 : 1 }],
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
  previewContainer: {
    position: 'absolute',
    bottom: 45, // Above progress bar
    width: 100,
    alignItems: 'center',
  },
  thumbnailWrapper: {
    width: 100,
    height: 177, // 16:9 vertical aspect ratio (100 * 1.77)
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 15,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailLoading: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingDots: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    opacity: 0.5,
  },
  timeLabel: {
    marginTop: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(0, 0, 0, 0.95)',
    marginTop: -1,
  },
});
