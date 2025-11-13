import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

export default function Login() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black items-center justify-center">
      <Pressable
        onPress={() => router.replace('/(tabs)')}
        className="bg-white px-8 py-4 rounded-full"
      >
        <Text className="text-black text-lg font-semibold">
          Enter App
        </Text>
      </Pressable>
    </View>
  );
}
