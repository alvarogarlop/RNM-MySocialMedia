import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator } from "react-native";

export default function AuthLayout() {
  const { isLoading, session } = useAuth();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (session) {
    // already authenticated
    return <Redirect href={"/"} />;
  }

  return <Slot />;
}
