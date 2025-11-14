import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Image } from 'react-native';
import { Video, ResizeMode, VideoThumbnails } from 'expo-av';
import * as VideoThumbnailsLib from 'expo-video-thumbnails';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Thumbnail cache to avoid regenerating
const thumbnailCache = {};

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
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  
  const progressBarRef = useRef(null);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [progressBarX, setProgressBarX] = useState(0);
  const thumbnailGenerationTimeout = useRef(null);

  // Preview animation
  const [previewScale] = useState(new Animated.Value(0));
  const [previewOpacity] = useState(new Animated.Value(0));

  // Generate thumbnail at scrub position (debounced)
  useEffect(() => {
    if (!isScrubbing || scrubPosition <= 0 || !videoUrl) return;

    // Clear previous timeout
    if (thumbnailGenerationTimeout.current) {
      clearTimeout(thumbnailGenerationTimeout.current);
    }

    // Debounce thumbnail generation (only generate after user pauses for 50ms)
    thumbnailGenerationTimeout.current = setTimeout(async () => {
      const cacheKey = `${videoUrl}_${Math.floor(scrubPosition / 1000)}`; // Cache per second
      
      // Check cache first
      if (thumbnailCache[cacheKey]) {
        setThumbnailUri(thumbnailCache[cacheKey]);
        return;
      }

      setIsGeneratingThumbnail(true);
      
      try {
        const { uri } = await VideoThumbnailsLib.getThumbnailAsync(videoUrl, {
          time: scrubPosition,
          quality: 0.5, // Lower quality for faster generation
        });
        
        thumbnailCache[cacheKey] = uri;
        setThumbnailUri(uri);
      } catch (error) {
        console.log('Thumbnail generation error:', error);
      } finally {
        setIsGeneratingThumbnail(false);
      }
    }, 50); // 50ms debounce

    return () => {
      if (thumbnailGenerationTimeout.current) {
        clearTimeout(thumbnailGenerationTimeout.current);
      }
    };
  }, [scrubPosition, isScrubbing, videoUrl]);

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
      (previewPosition * progressBarWidth) - (previewWidth / 2)
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
          {/* Preview Thumbnail */}
          <View style={styles.previewImageWrapper}>
            {thumbnailUri ? (
              <Image
                source={{ uri: thumbnailUri }}
                style={styles.previewImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.previewLoading}>
                <Text style={styles.previewLoadingText}>•••</Text>
              </View>
            )}
          </View>
          
          {/* Time Label */}
          <View style={styles.previewTimeLabel}>
            <Text style={styles.previewTimeText}>
              {formatTime(scrubPosition)}
            </Text>
          </View>

          {/* Triangle pointer */}
          <View style={styles.previewTriangle} />
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
                transform: [{ scale: isScrubbing ? 1.2 : 1 }],
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
  previewImageWrapper: {
    width: 100,
    height: 177, // 16:9 aspect ratio for vertical video
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewLoading: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  previewLoadingText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  previewTimeLabel: {
    marginTop: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  previewTimeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  previewTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'rgba(0, 0, 0, 0.8)',
    marginTop: -2,
  },
});
