import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Image } from 'react-native';
import * as VideoThumbnails from 'expo-video-thumbnails';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Global cache - persists across component remounts
const thumbnailCache = new Map();
const generationQueue = new Map();

// Pre-generate thumbnails in background
const preGenerateThumbnails = async (videoUrl, durationMs) => {
  if (!videoUrl || !durationMs || durationMs <= 0) return;
  
  // Generate every 3 seconds for smooth scrubbing
  const interval = 3000;
  const positions = [];
  
  for (let time = 0; time < durationMs; time += interval) {
    positions.push(time);
  }
  
  // Add end position
  if (positions[positions.length - 1] !== durationMs) {
    positions.push(durationMs - 1000); // 1 second before end
  }
  
  // Generate in parallel batches of 3 to avoid overwhelming the system
  for (let i = 0; i < positions.length; i += 3) {
    const batch = positions.slice(i, i + 3);
    
    await Promise.all(
      batch.map(async (time) => {
        const timeKey = Math.floor(time / 1000);
        const cacheKey = `${videoUrl}_${timeKey}`;
        
        // Skip if already cached or being generated
        if (thumbnailCache.has(cacheKey) || generationQueue.has(cacheKey)) {
          return;
        }
        
        generationQueue.set(cacheKey, true);
        
        try {
          const { uri } = await VideoThumbnails.getThumbnailAsync(videoUrl, {
            time,
            quality: 0.85, // Slightly higher quality
          });
          
          thumbnailCache.set(cacheKey, uri);
        } catch (error) {
          // Silently fail for background generation
          console.log(`Pre-gen failed for ${timeKey}s`);
        } finally {
          generationQueue.delete(cacheKey);
        }
      })
    );
  }
};

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
  
  const progressBarRef = useRef(null);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [progressBarX, setProgressBarX] = useState(0);
  const thumbnailTimeout = useRef(null);
  const lastRequestedTime = useRef(-1);
  const preGenerationStarted = useRef(false);

  // Animations
  const [previewScale] = useState(new Animated.Value(0));
  const [previewOpacity] = useState(new Animated.Value(0));
  const [thumbScale] = useState(new Animated.Value(1));

  // Start pre-generation when video becomes active
  useEffect(() => {
    if (isActive && videoUrl && duration > 0 && !preGenerationStarted.current) {
      preGenerationStarted.current = true;
      
      // Start pre-generation after a short delay to not interfere with video loading
      setTimeout(() => {
        preGenerateThumbnails(videoUrl, duration);
      }, 1000);
    }
    
    if (!isActive) {
      preGenerationStarted.current = false;
    }
  }, [isActive, videoUrl, duration]);

  // Get thumbnail for current scrub position
  const loadThumbnail = useCallback(async (scrubPos) => {
    if (!videoUrl || scrubPos <= 0) return;

    const timeInSeconds = Math.floor(scrubPos / 1000);
    
    // Don't re-request same second
    if (timeInSeconds === lastRequestedTime.current) {
      return;
    }
    
    lastRequestedTime.current = timeInSeconds;
    const cacheKey = `${videoUrl}_${timeInSeconds}`;
    
    // Check cache first - instant display
    if (thumbnailCache.has(cacheKey)) {
      setThumbnailUri(thumbnailCache.get(cacheKey));
      return;
    }

    // If already being generated, wait
    if (generationQueue.has(cacheKey)) {
      return;
    }

    // Generate on-demand
    generationQueue.set(cacheKey, true);
    
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUrl, {
        time: scrubPos,
        quality: 0.85,
      });
      
      thumbnailCache.set(cacheKey, uri);
      setThumbnailUri(uri);
    } catch (error) {
      console.log('Thumbnail generation error:', error);
    } finally {
      generationQueue.delete(cacheKey);
    }
  }, [videoUrl]);

  // Update thumbnail when scrub position changes
  useEffect(() => {
    if (!isScrubbing || scrubPosition <= 0) {
      return;
    }

    // Clear previous timeout
    if (thumbnailTimeout.current) {
      clearTimeout(thumbnailTimeout.current);
    }

    // Immediate check for cached thumbnails
    const timeInSeconds = Math.floor(scrubPosition / 1000);
    const cacheKey = `${videoUrl}_${timeInSeconds}`;
    
    if (thumbnailCache.has(cacheKey)) {
      setThumbnailUri(thumbnailCache.get(cacheKey));
      lastRequestedTime.current = timeInSeconds;
      return;
    }

    // Debounce for non-cached
    thumbnailTimeout.current = setTimeout(() => {
      loadThumbnail(scrubPosition);
    }, 80); // Short debounce for responsive feel

    return () => {
      if (thumbnailTimeout.current) {
        clearTimeout(thumbnailTimeout.current);
      }
    };
  }, [scrubPosition, isScrubbing, videoUrl, loadThumbnail]);

  // Show preview with smooth animation
  const showPreviewWithAnimation = () => {
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
  };

  // Hide preview with smooth animation
  const hidePreviewWithAnimation = () => {
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
      lastRequestedTime.current = -1;
    });
  };

  // Handle scrub start
  const handleScrubStart = (event) => {
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
  };

  // Handle scrub move
  const handleScrubMove = (event) => {
    if (!isScrubbing || duration === 0 || !progressBarWidth) return;

    const touchX = event.nativeEvent.pageX - progressBarX;
    const percentage = Math.max(0, Math.min(1, touchX / progressBarWidth));
    const newPosition = percentage * duration;
    
    setScrubPosition(newPosition);
    setPreviewPosition(percentage);
  };

  // Handle scrub end
  const handleScrubEnd = async () => {
    if (!isScrubbing) return;

    hidePreviewWithAnimation();
    setIsScrubbing(false);
    
    if (onSeek) {
      await onSeek(scrubPosition);
    }
    
    if (onScrubEnd) {
      onScrubEnd();
    }
  };

  // Measure progress bar
  const onProgressBarLayout = (event) => {
    const { width } = event.nativeEvent.layout;
    setProgressBarWidth(width);
    
    progressBarRef.current?.measureInWindow((x) => {
      setProgressBarX(x);
    });
  };

  // Format time display
  const formatTime = (millis) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentages
  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;
  const scrubPercentage = duration > 0 ? (scrubPosition / duration) * 100 : 0;
  const displayedPercentage = isScrubbing ? scrubPercentage : progressPercentage;

  // Calculate preview position with edge protection
  const previewWidth = 100;
  const previewLeft = Math.max(
    10,
    Math.min(
      SCREEN_WIDTH - previewWidth - 10,
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
          {/* Thumbnail Window */}
          <View style={styles.thumbnailWrapper}>
            {thumbnailUri ? (
              <Image
                source={{ uri: thumbnailUri }}
                style={styles.thumbnailImage}
                resizeMode="cover"
                fadeDuration={0}
              />
            ) : (
              <View style={styles.thumbnailLoading}>
                <View style={styles.loadingPulse}>
                  <Text style={styles.loadingText}>⚡</Text>
                </View>
              </View>
            )}
          </View>
          
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
  thumbnailWrapper: {
    width: 100,
    height: 177,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 25,
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
    backgroundColor: '#0a0a0a',
  },
  loadingPulse: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 40,
    opacity: 0.7,
  },
  timeLabel: {
    marginTop: 8,
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
