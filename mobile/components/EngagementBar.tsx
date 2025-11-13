import { View, Text, Pressable } from 'react-native';

export default function EngagementBar() {
  return (
    <View className="absolute right-4 bottom-32 items-center">
      {/* Like */}
      <Pressable className="mb-6">
        <View className="w-12 h-12 bg-gray-800 rounded-full" />
        <Text className="text-white text-xs mt-1">1.2k</Text>
      </Pressable>
      
      {/* Comment */}
      <Pressable className="mb-6">
        <View className="w-12 h-12 bg-gray-800 rounded-full" />
        <Text className="text-white text-xs mt-1">89</Text>
      </Pressable>
      
      {/* Share */}
      <Pressable>
        <View className="w-12 h-12 bg-gray-800 rounded-full" />
        <Text className="text-white text-xs mt-1">234</Text>
      </Pressable>
    </View>
  );
}
