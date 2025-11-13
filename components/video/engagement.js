import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Share, Platform, Animated, Modal, TextInput, KeyboardAvoidingView } from 'react-native';

export default function Engagement({ likes, comments, shares, isLiked, onLike, videoUrl }) {
  const [likeAnim] = useState(new Animated.Value(1));
  const [shareAnim] = useState(new Animated.Value(1));
  const [commentModalVisible, setCommentModalVisible] = useState(false);

  const handleShare = async () => {
    // Animate share button
    Animated.sequence([
      Animated.timing(shareAnim, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shareAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await Share.share({
        message: `Check out this video!${Platform.OS === 'ios' ? '' : ` ${videoUrl}`}`,
        url: Platform.OS === 'ios' ? videoUrl : undefined,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleLike = () => {
    // Animate like button
    Animated.sequence([
      Animated.timing(likeAnim, {
        toValue: 1.5,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(likeAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    onLike();
  };

  const handleComment = () => {
    setCommentModalVisible(true);
  };

  // Convert likes string to number for incrementing
  const likesNumber = typeof likes === 'string' ? parseFloat(likes.replace('k', '')) * 1000 : likes;
  const displayLikes = isLiked 
    ? formatNumber(likesNumber + 1)
    : likes;

  return (
    <>
      <View style={styles.container}>
        {/* Like Button */}
        <Pressable style={styles.item} onPress={handleLike}>
          <Animated.View style={{ transform: [{ scale: likeAnim }] }}>
            <View style={styles.iconContainer}>
              {isLiked ? (
                <Text style={styles.iconFilled}>❤️</Text>
              ) : (
                <View style={styles.heartOutline}>
                  <Text style={styles.heartOutlineText}>♡</Text>
                </View>
              )}
            </View>
          </Animated.View>
          <Text style={styles.count}>{displayLikes}</Text>
        </Pressable>
        
        {/* Comment Button */}
        <Pressable style={styles.item} onPress={handleComment}>
          <View style={styles.iconContainer}>
            <View style={styles.commentIcon}>
              <Text style={styles.commentIconText}>💬</Text>
            </View>
          </View>
          <Text style={styles.count}>{comments}</Text>
        </Pressable>
        
        {/* Share Button */}
        <Pressable style={styles.item} onPress={handleShare}>
          <Animated.View style={{ transform: [{ scale: shareAnim }] }}>
            <View style={styles.iconContainer}>
              <View style={styles.shareIcon}>
                <Text style={styles.shareIconText}>➤</Text>
              </View>
            </View>
          </Animated.View>
          <Text style={styles.count}>{shares}</Text>
        </Pressable>
      </View>

      {/* Comment Modal */}
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
          <Pressable 
            style={styles.modalOverlay} 
            onPress={() => setCommentModalVisible(false)}
          />
          <View style={styles.commentModal}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{comments} Comments</Text>
            
            <View style={styles.commentsList}>
              <Text style={styles.noComments}>No comments yet. Be the first!</Text>
            </View>

            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                placeholderTextColor="#888"
              />
              <Pressable style={styles.postButton}>
                <Text style={styles.postButtonText}>Post</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

function formatNumber(num) {
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
  },
  item: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartOutline: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartOutlineText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: '300',
  },
  iconFilled: {
    fontSize: 36,
  },
  commentIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ scaleX: -1 }],
  },
  commentIconText: {
    fontSize: 32,
    color: '#fff',
  },
  shareIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '45deg' }],
  },
  shareIconText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },
  count: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  commentModal: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 20,
    maxHeight: '80%',
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
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  noComments: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
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
  },
  postButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  postButtonText: {
    color: '#fe2c55',
    fontSize: 14,
    fontWeight: '600',
  },
});
