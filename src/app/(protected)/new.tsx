import { router, Stack } from "expo-router";
import { useState } from "react";
import { TextInput, View, Text, Button, Alert } from "react-native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPostRequest } from "@/services/postService";
import { useAuth } from "@/providers/AuthProvider";

export default function NewPost() {
  const [content, setContent] = useState("");
  const { session } = useAuth();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => createPostRequest({ content }, session?.accessToken!),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      setContent("");
      router.back();
    },
    onError: (error) => {
      Alert.alert("Failed to create post");
    },
  });

  return (
    <View className="flex-1 p-4">
      <Stack.Screen
        options={{
          headerLeft: () => (
            <Text className="text-lg" onPress={() => router.back()}>
              Cancel
            </Text>
          ),
          headerRight: () => (
            <Button
              title="Post"
              onPress={() => mutate()}
              disabled={content.trim().length === 0 || isPending}
            />
          ),
        }}
      />
      <TextInput
        value={content}
        onChangeText={setContent}
        className="text-lg min-h-40"
        multiline
        placeholder="What's happening?"
        autoFocus
      />
    </View>
  );
}
