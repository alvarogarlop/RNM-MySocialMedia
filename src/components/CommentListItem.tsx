import { Comment } from "@/types/models";
import { View, Text, Image } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type CommentListItemProps = {
  comment: Comment;
};

export default function CommentListItem({ comment }: CommentListItemProps) {
  return (
    <View className="flex-row gap-3 p-4 border-b border-b-gray-200">
      <Image
        source={{ uri: comment.author.avatar }}
        className="w-12 h-12 rounded-full"
      />
      <View className="gap-2 flex-1">
        <View className="flex-row gap-1">
          <Text className="font-semibold">{comment.author.name}</Text>
          <Text className="text-gray-500">·</Text>
          <Text className="text-gray-500">
            {dayjs(comment.created_at).fromNow()}
          </Text>
        </View>

        <Text className="leading-5">{comment.content}</Text>
      </View>
    </View>
  );
}
