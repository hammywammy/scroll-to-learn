import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Camera Icon
const CameraIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <Path
      d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="13" r="4" stroke="#fff" strokeWidth="2" />
  </Svg>
);

// Gallery Icon
const GalleryIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="18" height="18" rx="2" stroke="#fff" strokeWidth="2" />
    <Path d="M9 9h.01M21 15l-5-5L5 21" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

// Templates Icon
const TemplatesIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="3" width="7" height="7" rx="1" stroke="#fff" strokeWidth="2" />
    <Rect x="14" y="3" width="7" height="7" rx="1" stroke="#fff" strokeWidth="2" />
    <Rect x="3" y="14" width="7" height="7" rx="1" stroke="#fff" strokeWidth="2" />
    <Rect x="14" y="14" width="7" height="7" rx="1" stroke="#fff" strokeWidth="2" />
  </Svg>
);

// Live Icon
const LiveIcon = () => (
  <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" fill="#fe2c55" />
    <Path
      d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
      stroke="#fe2c55"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export default function Upload({ onClose }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const uploadOptions = [
    {
      id: 'camera',
      icon: CameraIcon,
      title: 'Camera',
      subtitle: 'Record a video',
      color: '#fe2c55',
    },
    {
      id: 'gallery',
      icon: GalleryIcon,
      title: 'Upload',
      subtitle: 'Select from gallery',
      color: '#00f2ea',
    },
    {
      id: 'templates',
      icon: TemplatesIcon,
      title: 'Templates',
      subtitle: 'Use a template',
      color: '#9d4edd',
    },
    {
      id: 'live',
      icon: LiveIcon,
      title: 'LIVE',
      subtitle: 'Go live now',
      color: '#fe2c55',
    },
  ];

  const handleOptionPress = (option) => {
    setSelectedOption(option.id);
    
    // Simulate action
    setTimeout(() => {
      alert(`${option.title} feature coming soon!`);
      setSelectedOption(null);
    }, 200);
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Create</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Main Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          {/* Hero Text */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>What do you want to create?</Text>
            <Text style={styles.heroSubtitle}>
              Choose how you'd like to share your content
            </Text>
          </View>

          {/* Upload Options Grid */}
          <View style={styles.optionsGrid}>
            {uploadOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = selectedOption === option.id;
              
              return (
                <Pressable
                  key={option.id}
                  style={[
                    styles.optionCard,
                    isSelected && styles.optionCardSelected,
                  ]}
                  onPress={() => handleOptionPress(option)}
                >
                  <View style={[styles.iconWrapper, { borderColor: option.color }]}>
                    <IconComponent />
                  </View>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Quick Tips */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>💡 Quick Tips</Text>
            <View style={styles.tipsList}>
              <TipItem text="Record in good lighting for better quality" />
              <TipItem text="Keep videos under 60 seconds for maximum engagement" />
              <TipItem text="Add trending sounds to boost visibility" />
              <TipItem text="Use hashtags to reach more people" />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Info */}
        <View style={styles.bottomInfo}>
          <Text style={styles.bottomInfoText}>
            By uploading, you agree to our Terms of Service
          </Text>
        </View>
      </View>
    </Modal>
  );
}

// Tip Item Component
const TipItem = ({ text }) => (
  <View style={styles.tipItem}>
    <View style={styles.tipBullet} />
    <Text style={styles.tipText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '300',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 32,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  heroSubtitle: {
    color: '#888',
    fontSize: 16,
    lineHeight: 24,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 12,
  },
  optionCard: {
    width: (SCREEN_WIDTH - 48) / 2,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    backgroundColor: '#2a2a2a',
    borderColor: '#fe2c55',
    transform: [{ scale: 0.98 }],
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
  },
  optionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionSubtitle: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  tipsSection: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  tipsTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fe2c55',
    marginTop: 7,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    color: '#aaa',
    fontSize: 14,
    lineHeight: 20,
  },
  bottomInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: '#000',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  bottomInfoText: {
    color: '#666',
    fontSize: 11,
    textAlign: 'center',
  },
});
