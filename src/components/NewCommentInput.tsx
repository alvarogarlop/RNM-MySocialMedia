import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // O usa tu icon library preferida
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { createCommentRequest } from "@/services/commentsService";

type NewCommentInputProps = {
  postId: number;
};

export default function NewCommentInput({ postId }: NewCommentInputProps) {
  const [comment, setComment] = useState("");
  const { session } = useAuth();

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () =>
      createCommentRequest({ content: comment }, postId, session?.accessToken!),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
      setComment("");
    },
    onError: (error) => {
      Alert.alert("Failed to create comment");
    },
  });

  const handleSend = () => {
    if (comment.trim()) {
      mutate();
    }
  };

  return (
    <KeyboardAvoidingView>
      <View style={styles.container}>
        <View style={styles.row}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Add a comment..."
              placeholderTextColor="#888"
              value={comment}
              onChangeText={setComment}
            />
          </View>

          <TouchableOpacity
            onPress={handleSend}
            style={[
              styles.sendButton,
              comment === "" && styles.disabledSendButton,
            ]}
            disabled={comment == ""}
          >
            <Ionicons name="send" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#e5e6ea",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    fontSize: 14,
    color: "#000",
  },
  sendButton: {
    marginLeft: 8,
  },
  disabledSendButton: {
    opacity: 0.4,
  },
});
