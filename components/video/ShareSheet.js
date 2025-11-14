import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Share as RNShare,
  Platform,
  Dimensions,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Social Media Icons
const InstagramIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="2" width="20" height="20" rx="5" stroke="#E4405F" strokeWidth="2" />
    <Circle cx="12" cy="12" r="4" stroke="#E4405F" strokeWidth="2" />
    <Circle cx="18" cy="6" r="1.5" fill="#E4405F" />
  </Svg>
);

const WhatsAppIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <Path d="M12 2C6.48 2 2 6.48 2 12c0 1.77.46 3.43 1.27 4.87L2 22l5.26-1.38C8.63 21.46 10.26 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" stroke="#25D366" strokeWidth="2" />
    <Path d="M8.5 9.5c0 3.5 2.5 6 6 6" stroke="#25D366" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const MessagesIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <Path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const EmailIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="5" width="18" height="14" rx="2" stroke="#888" strokeWidth="2" />
    <Path d="M3 7l9 6 9-6" stroke="#888" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const CopyLinkIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <Path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#888" strokeWidth="2" strokeLinecap="round" />
    <Path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#888" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const SaveIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <Path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" stroke="#888" strokeWidth="2" />
  </Svg>
);

const QRIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="7" height="7" stroke="#888" strokeWidth="2" />
    <Rect x="14" y="3" width="7" height="7" stroke="#888" strokeWidth="2" />
    <Rect x="3" y="14" width="7" height="7" stroke="#888" strokeWidth="2" />
    <Path d="M14 14h7v7h-7z" stroke="#888" strokeWidth="2" />
  </Svg>
);

export default function ShareSheet({ visible, onClose, videoUrl }) {
  const handleNativeShare = async () => {
    try {
      await RNShare.share({
        message: `Check out this video!${Platform.OS === 'ios' ? '' : ` ${videoUrl}`}`,
        url: Platform.OS === 'ios' ? videoUrl : undefined,
      });
      onClose();
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const ShareOption = ({ icon: Icon, title, onPress }) => (
    <Pressable style={styles.shareOption} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Icon />
      </View>
      <Text style={styles.shareTitle}>{title}</Text>
    </Pressable>
  );

  const Action = ({ icon: Icon, title, subtitle, onPress }) => (
    <Pressable style={styles.actionItem} onPress={onPress}>
      <View style={styles.actionIcon}>
        <Icon />
      </View>
      <View style={styles.actionTextContainer}>
        <Text style={styles.actionTitle}>{title}</Text>
        {subtitle && <Text style={styles.actionSubtitle}>{subtitle}</Text>}
      </View>
    </Pressable>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Overlay */}
        <Pressable style={styles.overlay} onPress={onClose} />

        {/* Bottom Sheet */}
        <View style={styles.bottomSheet}>
          {/* Handle */}
          <View style={styles.handle} />

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.headerTitle}>Share to</Text>

            {/* Quick Share Options */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.quickShare}
              contentContainerStyle={styles.quickShareContent}
            >
              <ShareOption
                icon={InstagramIcon}
                title="Instagram"
                onPress={() => {
                  console.log('Share to Instagram');
                  onClose();
                }}
              />
              <ShareOption
                icon={WhatsAppIcon}
                title="WhatsApp"
                onPress={() => {
                  console.log('Share to WhatsApp');
                  onClose();
                }}
              />
              <ShareOption
                icon={MessagesIcon}
                title="Messages"
                onPress={() => {
                  console.log('Share to Messages');
                  onClose();
                }}
              />
              <ShareOption
                icon={EmailIcon}
                title="Email"
                onPress={() => {
                  console.log('Share via Email');
                  onClose();
                }}
              />
            </ScrollView>

            {/* Additional Actions */}
            <View style={styles.actionsSection}>
              <Action
                icon={CopyLinkIcon}
                title="Copy link"
                subtitle="Share link to this video"
                onPress={() => {
                  console.log('Copy link');
                  onClose();
                }}
              />
              
              <Action
                icon={SaveIcon}
                title="Save video"
                subtitle="Download to your device"
                onPress={() => {
                  console.log('Save video');
                  onClose();
                }}
              />
              
              <Action
                icon={QRIcon}
                title="QR code"
                subtitle="Let others scan to view"
                onPress={() => {
                  console.log('Show QR code');
                  onClose();
                }}
              />
            </View>

            {/* More Options */}
            <Pressable style={styles.moreButton} onPress={handleNativeShare}>
              <Text style={styles.moreButtonText}>More options</Text>
            </Pressable>

            {/* Cancel Button */}
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34,
    maxHeight: SCREEN_HEIGHT * 0.75,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#555',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  quickShare: {
    paddingLeft: 20,
  },
  quickShareContent: {
    paddingRight: 20,
  },
  shareOption: {
    alignItems: 'center',
    marginRight: 20,
    width: 70,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  shareTitle: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  actionsSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionIcon: {
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  actionSubtitle: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  moreButton: {
    marginTop: 16,
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
  },
  moreButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 8,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#888',
    fontSize: 15,
    fontWeight: '600',
  },
});
