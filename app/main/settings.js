import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Chevron Icon
const ChevronIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 18l6-6-6-6"
      stroke="#888"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default function Settings({ onBack }) {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [privateAccount, setPrivateAccount] = useState(false);

  const SettingsItem = ({ icon, title, subtitle, onPress, showChevron = true, rightElement }) => (
    <Pressable style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        {icon && <Text style={styles.settingsIcon}>{icon}</Text>}
        <View style={styles.settingsTextContainer}>
          <Text style={styles.settingsTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightElement || (showChevron && <ChevronIcon />)}
    </Pressable>
  );

  const SectionHeader = ({ title }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Settings and privacy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <SectionHeader title="Account" />
        
        <SettingsItem
          icon="👤"
          title="Manage account"
          subtitle="Control your account"
          onPress={() => console.log('Manage account')}
        />
        
        <SettingsItem
          icon="🔒"
          title="Privacy"
          subtitle="Manage who can see your content"
          onPress={() => console.log('Privacy')}
        />
        
        <SettingsItem
          icon="🔐"
          title="Security"
          subtitle="Password, 2FA, and more"
          onPress={() => console.log('Security')}
        />
        
        <SettingsItem
          icon="📱"
          title="Push notifications"
          subtitle="Manage notifications"
          showChevron={false}
          rightElement={
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#333', true: '#fe2c55' }}
              thumbColor="#fff"
            />
          }
        />

        <SettingsItem
          icon="🔕"
          title="Private account"
          subtitle="Only approved followers can see your videos"
          showChevron={false}
          rightElement={
            <Switch
              value={privateAccount}
              onValueChange={setPrivateAccount}
              trackColor={{ false: '#333', true: '#fe2c55' }}
              thumbColor="#fff"
            />
          }
        />

        {/* Content & Display Section */}
        <SectionHeader title="Content & Display" />
        
        <SettingsItem
          icon="🌐"
          title="Language"
          subtitle="English"
          onPress={() => console.log('Language')}
        />
        
        <SettingsItem
          icon="♿"
          title="Accessibility"
          subtitle="Captions, text size, and more"
          onPress={() => console.log('Accessibility')}
        />
        
        <SettingsItem
          icon="🎯"
          title="Content preferences"
          subtitle="Filter keywords and hashtags"
          onPress={() => console.log('Content preferences')}
        />
        
        <SettingsItem
          icon="✨"
          title="Clear mode"
          subtitle="Hide interface elements"
          onPress={() => console.log('Clear mode')}
        />

        {/* Cache & Data Section */}
        <SectionHeader title="Cache & Data" />
        
        <SettingsItem
          icon="🗑️"
          title="Free up space"
          subtitle="Clear cache"
          onPress={() => console.log('Clear cache')}
        />
        
        <SettingsItem
          icon="📊"
          title="Data usage"
          subtitle="Manage data consumption"
          onPress={() => console.log('Data usage')}
        />

        {/* Support Section */}
        <SectionHeader title="Support & About" />
        
        <SettingsItem
          icon="⚠️"
          title="Report a problem"
          onPress={() => console.log('Report problem')}
        />
        
        <SettingsItem
          icon="❓"
          title="Help Center"
          onPress={() => console.log('Help Center')}
        />
        
        <SettingsItem
          icon="📄"
          title="Terms of Service"
          onPress={() => console.log('Terms')}
        />
        
        <SettingsItem
          icon="🔒"
          title="Privacy Policy"
          onPress={() => console.log('Privacy Policy')}
        />
        
        <SettingsItem
          icon="ℹ️"
          title="About"
          subtitle="Version 1.0.0"
          onPress={() => console.log('About')}
        />

        {/* Log Out */}
        <View style={styles.logoutSection}>
          <Pressable style={styles.logoutButton}>
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

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
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backIcon: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionTitle: {
    color: '#888',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIcon: {
    fontSize: 22,
    marginRight: 16,
  },
  settingsTextContainer: {
    flex: 1,
  },
  settingsTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  settingsSubtitle: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  logoutSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  logoutButton: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fe2c55',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 100,
  },
});
