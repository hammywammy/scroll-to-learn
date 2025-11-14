import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable,
  FlatList,
} from 'react-native';

export default function Inbox() {
  const [activeTab, setActiveTab] = useState('all');

  // Mock notifications
  const mockNotifications = [
    {
      id: '1',
      type: 'like',
      user: 'educator1',
      action: 'liked your video',
      time: '2m ago',
      avatar: 'E',
    },
    {
      id: '2',
      type: 'comment',
      user: 'teacher2',
      action: 'commented: "Great content!"',
      time: '5m ago',
      avatar: 'T',
    },
    {
      id: '3',
      type: 'follow',
      user: 'coach3',
      action: 'started following you',
      time: '10m ago',
      avatar: 'C',
    },
    {
      id: '4',
      type: 'like',
      user: 'learner99',
      action: 'liked your video',
      time: '15m ago',
      avatar: 'L',
    },
    {
      id: '5',
      type: 'mention',
      user: 'educator1',
      action: 'mentioned you in a comment',
      time: '1h ago',
      avatar: 'E',
    },
    {
      id: '6',
      type: 'comment',
      user: 'student_22',
      action: 'commented: "This helped me so much!"',
      time: '2h ago',
      avatar: 'S',
    },
    {
      id: '7',
      type: 'follow',
      user: 'knowledge_seeker',
      action: 'started following you',
      time: '3h ago',
      avatar: 'K',
    },
    {
      id: '8',
      type: 'like',
      user: 'teacher2',
      action: 'liked your video',
      time: '5h ago',
      avatar: 'T',
    },
  ];

  const getFilteredNotifications = () => {
    if (activeTab === 'all') return mockNotifications;
    return mockNotifications.filter(n => n.type === activeTab);
  };

  const getIconForType = (type) => {
    switch(type) {
      case 'like': return '❤️';
      case 'comment': return '💬';
      case 'follow': return '👤';
      case 'mention': return '@';
      default: return '🔔';
    }
  };

  const Tab = ({ id, label, isActive, onPress }) => (
    <Pressable 
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={onPress}
    >
      <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
        {label}
      </Text>
    </Pressable>
  );

  const NotificationItem = ({ item }) => (
    <Pressable style={styles.notificationItem}>
      <View style={styles.notificationLeft}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.avatar}</Text>
        </View>
        <View style={styles.notificationIcon}>
          <Text style={styles.notificationIconText}>
            {getIconForType(item.type)}
          </Text>
        </View>
      </View>

      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>
          <Text style={styles.username}>{item.user}</Text>
          {' '}
          <Text style={styles.action}>{item.action}</Text>
        </Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>

      {item.type === 'follow' && (
        <Pressable style={styles.followBackButton}>
          <Text style={styles.followBackText}>Follow</Text>
        </Pressable>
      )}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          <Tab
            id="all"
            label="All activity"
            isActive={activeTab === 'all'}
            onPress={() => setActiveTab('all')}
          />
          <Tab
            id="like"
            label="Likes"
            isActive={activeTab === 'like'}
            onPress={() => setActiveTab('like')}
          />
          <Tab
            id="comment"
            label="Comments"
            isActive={activeTab === 'comment'}
            onPress={() => setActiveTab('comment')}
          />
          <Tab
            id="mention"
            label="Mentions"
            isActive={activeTab === 'mention'}
            onPress={() => setActiveTab('mention')}
          />
          <Tab
            id="follow"
            label="Followers"
            isActive={activeTab === 'follow'}
            onPress={() => setActiveTab('follow')}
          />
        </ScrollView>
      </View>
      
      {/* Notifications List */}
      <FlatList
        data={getFilteredNotifications()}
        renderItem={({ item }) => <NotificationItem item={item} />}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  tabs: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabsContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#1a1a1a',
  },
  activeTab: {
    backgroundColor: '#fe2c55',
  },
  tabLabel: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabLabel: {
    color: '#fff',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 100,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  notificationLeft: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  notificationIconText: {
    fontSize: 10,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  username: {
    color: '#fff',
    fontWeight: '600',
  },
  action: {
    color: '#aaa',
  },
  time: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  followBackButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#fe2c55',
  },
  followBackText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
