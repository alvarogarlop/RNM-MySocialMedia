// NewCommentInput.tsx
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // O usa tu icon library preferida

type NewCommentInputProps = {
  onSend?: (comment: string) => void;
};

export default function NewCommentInput({ onSend }: NewCommentInputProps) {
  const [comment, setComment] = useState("");

  const handleSend = () => {
    if (comment.trim()) {
      onSend?.(comment.trim());
      setComment("");
    }
  };

  return (
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

        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
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
});
