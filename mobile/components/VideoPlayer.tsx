import { View, Text, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-video';
import EngagementBar from './EngagementBar';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoPlayerProps {
  video: {
    id: string;
    url: string;
    creator: string;
    description: string;
  };
}

export default function VideoPlayer({ video }: VideoPlayerProps) {
  return (
    <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
      {/* Video */}
      <Video
        source={{ uri: video.url }}
        style={{ flex: 1 }}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted // Start muted for autoplay
      />
      
      {/* Overlay UI */}
      <View className="absolute bottom-20 left-4 right-16">
        <Text className="text-white font-bold text-lg">
          @{video.creator}
        </Text>
        <Text className="text-white mt-2">
          {video.description}
        </Text>
      </View>
      
      {/* Engagement Bar */}
      <EngagementBar />
    </View>
  );
}
