import React from 'react';
import { View, Text, Pressable, StyleSheet, Share, Platform } from 'react-native';

export default function Engagement({ likes, comments, shares, isLiked, onLike, videoUrl }) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this video!${Platform.OS === 'ios' ? '' : ` ${videoUrl}`}`,
        url: Platform.OS === 'ios' ? videoUrl : undefined,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleComment = () => {
    // TODO: Implement comment functionality
    console.log('Comment clicked');
  };

  // Convert likes string to number for incrementing
  const likesNumber = typeof likes === 'string' ? parseFloat(likes.replace('k', '')) * 1000 : likes;
  const displayLikes = isLiked 
    ? formatNumber(likesNumber + 1)
    : likes;

  return (
    <View style={styles.container}>
      <Pressable style={styles.item} onPress={onLike}>
        <Text style={styles.icon}>{isLiked ? '❤️' : '🤍'}</Text>
        <Text style={styles.count}>{displayLikes}</Text>
      </Pressable>
      
      <Pressable style={styles.item} onPress={handleComment}>
        <Text style={styles.icon}>💬</Text>
        <Text style={styles.count}>{comments}</Text>
      </Pressable>
      
      <Pressable style={styles.item} onPress={handleShare}>
        <Text style={styles.icon}>↗️</Text>
        <Text style={styles.count}>{shares}</Text>
      </Pressable>
    </View>
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
    right: 15,
    bottom: 100,
  },
  item: {
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 28,
  },
  count: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
});
