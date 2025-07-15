import { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useAuth } from "@/providers/AuthProvider";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const { signIn } = useAuth();

  const handleSignIn = () => {
    signIn(username);
  };

  return (
    <View className="flex-1 bg-white items-center justify-center w-full max-w-md mx-auto">
      <Text className="text-2xl mb-5">Sign in</Text>
      <TextInput
        className="w-4/5 h-10 border border-gray-300 rounded px-2.5 mb-4"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <Button title="Sign in" onPress={handleSignIn} />
    </View>
  );
}
