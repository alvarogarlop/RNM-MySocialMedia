import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  useWindowDimensions,
} from "react-native";
import FeedPostItem from "@/components/FeedPostItem";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { getPosts } from "@/services/postService";
import { useRefreshOnFocus } from "@/hooks/tanstack";

export default function FeedScreen() {
  const { session } = useAuth();

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
    queryKey: ["posts"],
    queryFn: ({ pageParam }) => getPosts(pageParam, session?.accessToken!),
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

  // useRefreshOnFocus(refetch);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error fetching the posts</Text>;
  }

  const posts = data?.pages.flat() || [];

  return (
    <>
      <FlatList
        data={posts}
        contentContainerClassName="w-full max-w-lg mx-auto"
        renderItem={({ item }) => (
          <Link href={`/post/${item.id}`} asChild>
            <Pressable className="flex-1">
              <FeedPostItem post={item} />
            </Pressable>
          </Link>
        )}
        onRefresh={refetch}
        refreshing={isRefetching}
        onEndReachedThreshold={2}
        onEndReached={() =>
          !isFetchingNextPage && hasNextPage && fetchNextPage()
        }
        ListFooterComponent={() => isFetchingNextPage && <ActivityIndicator />}
      />
      <Link href="/new" asChild>
        <Pressable className="absolute right-5 bottom-5 bg-[#007AFF] rounded-full w-[60px] h-[60px] items-center justify-center shadow-lg">
          <AntDesign name="plus" size={24} color="white" />
        </Pressable>
      </Link>
    </>
  );
}
