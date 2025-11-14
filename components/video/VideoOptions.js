import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function VideoOptions({ visible, onClose, video }) {
  const Option = ({ icon, title, subtitle, onPress, destructive = false }) => (
    <Pressable 
      style={styles.optionItem} 
      onPress={() => {
        onPress();
        onClose();
      }}
    >
      <Text style={styles.optionIcon}>{icon}</Text>
      <View style={styles.optionTextContainer}>
        <Text style={[styles.optionTitle, destructive && styles.destructiveText]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
      </View>
    </Pressable>
  );

  const Divider = () => <View style={styles.divider} />;

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
            <Option
              icon="🚫"
              title="Not interested"
              subtitle="See fewer videos like this"
              onPress={() => console.log('Not interested')}
            />

            <Option
              icon="⭐"
              title="Add to Favorites"
              subtitle="Save to your favorites collection"
              onPress={() => console.log('Add to favorites')}
            />

            <Option
              icon="💾"
              title="Save video"
              subtitle="Save to watch later"
              onPress={() => console.log('Save video')}
            />

            <Divider />

            <Option
              icon="🔗"
              title="Copy link"
              subtitle="Share link to video"
              onPress={() => console.log('Copy link')}
            />

            <Option
              icon="📤"
              title="Share to..."
              subtitle="Share via other apps"
              onPress={() => console.log('Share')}
            />

            <Divider />

            <Option
              icon="🎭"
              title="Duet"
              subtitle="Create a side-by-side video"
              onPress={() => console.log('Duet')}
            />

            <Option
              icon="✂️"
              title="Stitch"
              subtitle="Use part of this video"
              onPress={() => console.log('Stitch')}
            />

            <Divider />

            <Option
              icon="⚠️"
              title="Report"
              subtitle="Report inappropriate content"
              onPress={() => console.log('Report')}
              destructive={true}
            />

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
    maxHeight: SCREEN_HEIGHT * 0.7,
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
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
    width: 30,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  optionSubtitle: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  destructiveText: {
    color: '#ff4444',
  },
  divider: {
    height: 8,
    backgroundColor: '#0a0a0a',
    marginVertical: 8,
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
