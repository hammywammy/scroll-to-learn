import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1); // 1: Welcome, 2: Birthday, 3: Nickname
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [year, setYear] = useState('');
  const [nickname, setNickname] = useState('');

  // Welcome Screen
  if (step === 1) {
    return (
      <View style={styles.container}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Text style={styles.logo}>ScrollToLearn</Text>
          <Text style={styles.tagline}>Learn in 60 seconds</Text>
        </View>
        
        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Pressable 
            style={styles.continueButton} 
            onPress={() => setStep(2)}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </Pressable>
          
          <Text style={styles.disclaimer}>
            By continuing, you agree to our{'\n'}
            <Text style={styles.link}>Terms of Service</Text> and{' '}
            <Text style={styles.link}>Privacy Policy</Text>
          </Text>
        </View>
      </View>
    );
  }

  // Birthday Screen
  if (step === 2) {
    const isValidDate = month && day && year && 
                       month.length <= 2 && 
                       day.length <= 2 && 
                       year.length === 4;

    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => setStep(1)}>
              <Text style={styles.backButton}>←</Text>
            </Pressable>
          </View>

          {/* Content */}
          <View style={styles.formContent}>
            <Text style={styles.title}>When's your birthday?</Text>
            <Text style={styles.subtitle}>
              Your birthday won't be shown publicly
            </Text>

            {/* Birthday Inputs */}
            <View style={styles.birthdayContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Month"
                  placeholderTextColor="#666"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={month}
                  onChangeText={setMonth}
                />
                <Text style={styles.inputLabel}>Month</Text>
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Day"
                  placeholderTextColor="#666"
                  keyboardType="number-pad"
                  maxLength={2}
                  value={day}
                  onChangeText={setDay}
                />
                <Text style={styles.inputLabel}>Day</Text>
              </View>

              <View style={[styles.inputWrapper, styles.yearInput]}>
                <TextInput
                  style={styles.input}
                  placeholder="Year"
                  placeholderTextColor="#666"
                  keyboardType="number-pad"
                  maxLength={4}
                  value={year}
                  onChangeText={setYear}
                />
                <Text style={styles.inputLabel}>Year</Text>
              </View>
            </View>

            <Text style={styles.helpText}>
              You need to enter the date you were born
            </Text>
            <Text style={styles.helpText}>
              Use your own birthday, even if this account is for a business, a pet, or something else
            </Text>
          </View>

          {/* Next Button */}
          <View style={styles.bottomSection}>
            <Pressable 
              style={[
                styles.nextButton,
                !isValidDate && styles.nextButtonDisabled
              ]}
              onPress={() => isValidDate && setStep(3)}
              disabled={!isValidDate}
            >
              <Text style={[
                styles.nextButtonText,
                !isValidDate && styles.nextButtonTextDisabled
              ]}>
                Next
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Nickname Screen
  if (step === 3) {
    const isValidNickname = nickname.trim().length >= 2;

    return (
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => setStep(2)}>
              <Text style={styles.backButton}>←</Text>
            </Pressable>
          </View>

          {/* Content */}
          <View style={styles.formContent}>
            <Text style={styles.title}>Create a nickname</Text>
            <Text style={styles.subtitle}>
              You can always change this later
            </Text>

            {/* Nickname Input */}
            <View style={styles.nicknameInputContainer}>
              <TextInput
                style={styles.nicknameInput}
                placeholder="Nickname"
                placeholderTextColor="#666"
                value={nickname}
                onChangeText={setNickname}
                autoFocus
                maxLength={30}
              />
              {nickname.length > 0 && (
                <Pressable 
                  style={styles.clearButton}
                  onPress={() => setNickname('')}
                >
                  <Text style={styles.clearButtonText}>✕</Text>
                </Pressable>
              )}
            </View>

            <Text style={styles.characterCount}>
              {nickname.length}/30
            </Text>
          </View>

          {/* Sign Up Button */}
          <View style={styles.bottomSection}>
            <Pressable 
              style={[
                styles.nextButton,
                !isValidNickname && styles.nextButtonDisabled
              ]}
              onPress={() => isValidNickname && onComplete({ month, day, year, nickname })}
              disabled={!isValidNickname}
            >
              <Text style={[
                styles.nextButtonText,
                !isValidNickname && styles.nextButtonTextDisabled
              ]}>
                Sign up
              </Text>
            </Pressable>

            <Text style={styles.skipText}>
              or{' '}
              <Text 
                style={styles.skipLink}
                onPress={() => onComplete({ month, day, year, nickname: 'User' })}
              >
                skip for now
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flex: 1,
  },
  // Welcome Screen
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 18,
    color: '#888',
    fontWeight: '500',
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  continueButton: {
    backgroundColor: '#fe2c55',
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 20,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disclaimer: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: '#fff',
    fontWeight: '600',
  },
  // Birthday & Nickname Screens
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '300',
  },
  formContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    color: '#888',
    fontSize: 15,
    marginBottom: 32,
  },
  // Birthday Inputs
  birthdayContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  inputWrapper: {
    flex: 1,
  },
  yearInput: {
    flex: 1.2,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  inputLabel: {
    color: '#666',
    fontSize: 12,
    marginTop: 8,
  },
  helpText: {
    color: '#666',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  // Nickname Input
  nicknameInputContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  nicknameInput: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 50,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  clearButton: {
    position: 'absolute',
    right: 16,
    top: 14,
    width: 24,
    height: 24,
    backgroundColor: '#333',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  characterCount: {
    color: '#666',
    fontSize: 12,
    textAlign: 'right',
  },
  // Bottom Section
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: '#fe2c55',
    paddingVertical: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#2a2a2a',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonTextDisabled: {
    color: '#666',
  },
  skipText: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  skipLink: {
    color: '#fff',
    fontWeight: '600',
  },
});
