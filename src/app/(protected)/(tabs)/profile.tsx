import { useAuth } from "@/providers/AuthProvider";
import { Text, View, Button } from "react-native";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  return (
    <View>
      <Text className="p-10 text-center text-xl">Profile Screen</Text>
      <Button onPress={signOut} title="Sign out" />
    </View>
  );
}
