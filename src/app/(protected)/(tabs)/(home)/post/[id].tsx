import FeedPostItem from "@/components/FeedPostItem";
import dummyPosts from "@/dummyPosts";
import { useAuth } from "@/providers/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, TextInput, View } from "react-native";
import { getPost } from "@/services/postService";
import Head from "expo-router/head";
import NewCommentInput from "@/components/NewCommentInput";

export default function PostDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPost(id, session?.accessToken!),
    staleTime: 10 * 1000,
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Post Not found</Text>;
  }

  return (
    <>
      <Head>
        <title>Tweet from {data.author.name}</title>
        <meta name="description" content={data.content} />
      </Head>

      <FeedPostItem post={data} />

      <View
        style={{
          position: "absolute",
          bottom: 5,
          left: 0,
          right: 0,
        }}
      >
        <NewCommentInput postId={Number(id)} />
      </View>
    </>
  );
}
