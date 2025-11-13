import { View, FlatList, Dimensions } from 'react-native';
import VideoPlayer from '../../components/VideoPlayer';
import { mockVideos } from '../../constants/Videos';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function Feed() {
  return (
    <View className="flex-1 bg-black">
      <FlatList
        data={mockVideos}
        renderItem={({ item }) => <VideoPlayer video={item} />}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
}
