import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function EditProfile({ visible, onClose, userData }) {
  const [name, setName] = useState(userData?.name || '');
  const [username, setUsername] = useState(userData?.username || '');
  const [bio, setBio] = useState(userData?.bio || '');
  const [website, setWebsite] = useState('');

  const handleSave = () => {
    // Save logic would go here
    console.log('Saving profile:', { name, username, bio, website });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Dark overlay */}
        <Pressable style={styles.overlay} onPress={onClose} />

        {/* Bottom Sheet */}
        <View style={styles.bottomSheet}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={onClose}>
              <Text style={styles.cancelButton}>Cancel</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Edit profile</Text>
            <Pressable onPress={handleSave}>
              <Text style={styles.saveButton}>Save</Text>
            </Pressable>
          </View>

          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Profile Picture */}
            <View style={styles.profileSection}>
              <View style={styles.profilePicture}>
                <Text style={styles.profileInitial}>
                  {name.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <Pressable style={styles.changePhotoButton}>
                <Text style={styles.changePhotoText}>Change photo</Text>
              </Pressable>
            </View>

            {/* Name Field */}
            <View style={styles.field}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Name"
                placeholderTextColor="#666"
                maxLength={30}
              />
              <Text style={styles.helperText}>
                {name.length}/30
              </Text>
            </View>

            {/* Username Field */}
            <View style={styles.field}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.atSymbol}>@</Text>
                <TextInput
                  style={[styles.input, styles.usernameInput]}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="username"
                  placeholderTextColor="#666"
                  autoCapitalize="none"
                  maxLength={24}
                />
              </View>
              <Text style={styles.helperText}>
                Usernames can only contain letters, numbers, underscores, and periods
              </Text>
            </View>

            {/* Bio Field */}
            <View style={styles.field}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                placeholder="Add a bio to your profile"
                placeholderTextColor="#666"
                multiline
                maxLength={80}
              />
              <Text style={styles.helperText}>
                {bio.length}/80
              </Text>
            </View>

            {/* Website Field */}
            <View style={styles.field}>
              <Text style={styles.label}>Website</Text>
              <TextInput
                style={styles.input}
                value={website}
                onChangeText={setWebsite}
                placeholder="Add a website link"
                placeholderTextColor="#666"
                autoCapitalize="none"
                keyboardType="url"
              />
              <Text style={styles.helperText}>
                Requires 1,000 followers to add a clickable link
              </Text>
            </View>

            {/* Social Links */}
            <View style={styles.socialSection}>
              <Text style={styles.sectionTitle}>Social</Text>
              
              <Pressable style={styles.socialItem}>
                <Text style={styles.socialIcon}>📷</Text>
                <View style={styles.socialInfo}>
                  <Text style={styles.socialName}>Instagram</Text>
                  <Text style={styles.socialLink}>Add Instagram</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>

              <Pressable style={styles.socialItem}>
                <Text style={styles.socialIcon}>▶️</Text>
                <View style={styles.socialInfo}>
                  <Text style={styles.socialName}>YouTube</Text>
                  <Text style={styles.socialLink}>Add YouTube</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>

              <Pressable style={styles.socialItem}>
                <Text style={styles.socialIcon}>🐦</Text>
                <View style={styles.socialInfo}>
                  <Text style={styles.socialName}>Twitter</Text>
                  <Text style={styles.socialLink}>Add Twitter</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
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
    height: SCREEN_HEIGHT * 0.85,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#555',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButton: {
    color: '#888',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    color: '#fe2c55',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  profilePicture: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#444',
  },
  profileInitial: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  changePhotoButton: {
    marginTop: 12,
  },
  changePhotoText: {
    color: '#fe2c55',
    fontSize: 14,
    fontWeight: '600',
  },
  field: {
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  label: {
    color: '#888',
    fontSize: 13,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#fff',
    fontSize: 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
  },
  atSymbol: {
    color: '#888',
    fontSize: 15,
    paddingLeft: 16,
  },
  usernameInput: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingLeft: 4,
  },
  bioInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  helperText: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
  },
  socialSection: {
    paddingVertical: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 16,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  socialIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  socialInfo: {
    flex: 1,
  },
  socialName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  socialLink: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  chevron: {
    color: '#888',
    fontSize: 24,
  },
});
