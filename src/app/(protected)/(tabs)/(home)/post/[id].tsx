import FeedPostItem from "@/components/FeedPostItem";
import { useAuth } from "@/providers/AuthProvider";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { getPost } from "@/services/postService";
import Head from "expo-router/head";
import NewCommentInput from "@/components/NewCommentInput";
import { getComments } from "@/services/commentsService";
import CommentListItem from "@/components/CommentListItem";

export default function PostDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();

  const post = useQuery({
    queryKey: ["posts", id],
    queryFn: () => getPost(id, session?.accessToken!),
    staleTime: 10 * 1000,
  });

  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["comments", Number(id)],
    queryFn: ({ pageParam }) =>
      getComments({ ...pageParam, post_id: Number(id) }, session?.accessToken!),
    initialPageParam: { limit: 20, cursor: undefined },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length === 0) {
        return undefined;
      }
      return {
        limit: 5,
        cursor: lastPage[lastPage.length - 1].id,
      };
    },
  });

  if (post.isLoading) {
    return <ActivityIndicator />;
  }

  if (post.error) {
    return <Text>Post Not found</Text>;
  }

  const comments = data?.pages.flat() || [];

  return (
    <>
      <Head>
        <title>Tweet from {post.data.author.name}</title>
        <meta name="description" content={post.data.content} />
      </Head>

      <FeedPostItem post={post.data} />

      <View style={{ gap: 10, marginTop: 5, marginLeft: 5 }}>
        <Text>Comments</Text>
        <FlatList
          data={comments}
          contentContainerClassName="w-full max-w-lg mx-auto"
          renderItem={({ item }) => <CommentListItem comment={item} />}
          onRefresh={refetch}
          refreshing={isRefetching}
          onEndReachedThreshold={2}
          onEndReached={() =>
            !isFetchingNextPage && hasNextPage && fetchNextPage()
          }
          ListFooterComponent={() =>
            isFetchingNextPage && <ActivityIndicator />
          }
        />
      </View>
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
