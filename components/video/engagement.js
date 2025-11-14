import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Modal, TextInput, KeyboardAvoidingView, ScrollView, Dimensions, Platform } from 'react-native';
import { HeartIcon, CommentIcon, BookmarkIcon, ShareIcon } from '../common/icons';
import ShareSheet from './ShareSheet';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Engagement({ likes, comments, shares, isLiked, onLike, videoUrl, isPlaying }) {
  const [likeAnim] = useState(new Animated.Value(1));
  const [shareAnim] = useState(new Animated.Value(1));
  const [saveAnim] = useState(new Animated.Value(1));
  const [commentAnim] = useState(new Animated.Value(1));
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [commentText, setCommentText] = useState('');

  // Heart pop animation that appears on double-tap
  const [heartPopAnim] = useState(new Animated.Value(0));
  const [heartPopOpacity] = useState(new Animated.Value(0));

  // Audio disc rotation animation
  const [discRotation] = useState(new Animated.Value(0));

  // Rotate disc continuously when video is playing
  useEffect(() => {
    if (isPlaying) {
      Animated.loop(
        Animated.timing(discRotation, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      discRotation.stopAnimation();
    }
  }, [isPlaying]);

  const spin = discRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const handleShare = async () => {
    // Animate share button with bounce
    Animated.sequence([
      Animated.spring(shareAnim, {
        toValue: 1.3,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(shareAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Show share modal
    setShareModalVisible(true);
  };

  const handleLike = () => {
    // SATISFYING Heart animation - pops and bounces
    Animated.parallel([
      Animated.sequence([
        Animated.spring(likeAnim, {
          toValue: 1.5,
          friction: 2,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(likeAnim, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Show big heart pop (like TikTok double-tap)
    if (!isLiked) {
      heartPopOpacity.setValue(1);
      heartPopAnim.setValue(0);
      
      Animated.parallel([
        Animated.spring(heartPopAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(heartPopOpacity, {
          toValue: 0,
          duration: 800,
          delay: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }

    onLike();
  };

  const handleSave = () => {
    // SATISFYING Bookmark animation - smooth scale with slight rotation
    Animated.sequence([
      Animated.parallel([
        Animated.spring(saveAnim, {
          toValue: 1.3,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(saveAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    setIsSaved(!isSaved);
  };

  const handleComment = () => {
    // SATISFYING Comment animation - bouncy
    Animated.sequence([
      Animated.spring(commentAnim, {
        toValue: 1.3,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(commentAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Open modal - video will shrink in parent component
    setCommentModalVisible(true);
  };

  const handlePostComment = () => {
    if (commentText.trim()) {
      console.log('Posting comment:', commentText);
      setCommentText('');
      // Don't close modal - let user keep commenting (TikTok behavior)
    }
  };

  // Convert likes string to number for incrementing
  const likesNumber = typeof likes === 'string' ? parseFloat(likes.replace('k', '')) * 1000 : likes;
  const displayLikes = isLiked 
    ? formatNumber(likesNumber + 1)
    : likes;

  return (
    <>
      <View style={styles.container}>
        {/* Like Button with satisfying animation */}
        <Pressable style={styles.item} onPress={handleLike}>
          <Animated.View style={{ transform: [{ scale: likeAnim }] }}>
            <View style={styles.iconContainer}>
              <HeartIcon filled={isLiked} size={34} />
            </View>
          </Animated.View>
          <Text style={styles.count}>{displayLikes}</Text>
        </Pressable>
        
        {/* Comment Button */}
        <Pressable style={styles.item} onPress={handleComment}>
          <Animated.View style={{ transform: [{ scale: commentAnim }] }}>
            <View style={styles.iconContainer}>
              <CommentIcon size={34} />
            </View>
          </Animated.View>
          <Text style={styles.count}>{comments}</Text>
        </Pressable>

        {/* Bookmark Button with satisfying animation */}
        <Pressable style={styles.item} onPress={handleSave}>
          <Animated.View style={{ transform: [{ scale: saveAnim }] }}>
            <View style={styles.iconContainer}>
              <BookmarkIcon saved={isSaved} size={32} />
            </View>
          </Animated.View>
          <Text style={styles.count}>Save</Text>
        </Pressable>
        
        {/* Share Button */}
        <Pressable style={styles.item} onPress={handleShare}>
          <Animated.View style={{ transform: [{ scale: shareAnim }] }}>
            <View style={styles.iconContainer}>
              <ShareIcon size={32} />
            </View>
          </Animated.View>
          <Text style={styles.count}>{shares}</Text>
        </Pressable>

        {/* Audio Disc Button - TikTok Style */}
        <Pressable style={styles.item}>
          <Animated.View style={[styles.audioDisc, { transform: [{ rotate: spin }] }]}>
            <View style={styles.audioDiscInner}>
              <Text style={styles.audioNote}>♪</Text>
            </View>
          </Animated.View>
        </Pressable>
      </View>

      {/* Big Heart Pop Animation (like TikTok double-tap) */}
      <Animated.View 
        style={[
          styles.heartPop,
          {
            opacity: heartPopOpacity,
            transform: [{ scale: heartPopAnim }],
          },
        ]}
        pointerEvents="none"
      >
        <HeartIcon filled={true} size={120} />
      </Animated.View>

      {/* TikTok-Style Comment Modal - Slides up from bottom */}
      <Modal
        visible={commentModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCommentModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          {/* Pressable overlay to close */}
          <Pressable 
            style={styles.modalOverlay} 
            onPress={() => setCommentModalVisible(false)}
          />
          
          {/* Comment Section */}
          <View style={styles.commentModal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{comments} Comments</Text>
            
            <ScrollView style={styles.commentsList} contentContainerStyle={styles.commentsListContent}>
              <Text style={styles.noComments}>No comments yet. Be the first!</Text>
            </ScrollView>

            {/* Fixed Comment Input at Bottom */}
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                placeholderTextColor="#888"
                value={commentText}
                onChangeText={setCommentText}
                multiline
                maxLength={500}
              />
              <Pressable 
                style={[styles.postButton, !commentText.trim() && styles.postButtonDisabled]} 
                onPress={handlePostComment}
                disabled={!commentText.trim()}
              >
                <Text style={[styles.postButtonText, !commentText.trim() && styles.postButtonTextDisabled]}>
                  Post
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Share Modal */}
      <ShareSheet
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        videoUrl={videoUrl}
      />
    </>
  );
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 12,
    bottom: 120,
    zIndex: 10,
  },
  item: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heartPop: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -60,
    marginTop: -60,
    zIndex: 100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  commentModal: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    height: SCREEN_HEIGHT * 0.7,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#555',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  commentsListContent: {
    paddingVertical: 20,
    flexGrow: 1,
  },
  noComments: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 40,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: '#1a1a1a',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 14,
    marginRight: 10,
    maxHeight: 100,
  },
  postButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    color: '#fe2c55',
    fontSize: 14,
    fontWeight: '600',
  },
  postButtonTextDisabled: {
    color: '#666',
  },
  audioDisc: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  audioDiscInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioNote: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
