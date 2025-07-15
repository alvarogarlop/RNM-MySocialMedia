import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";
import { User } from "@/types/models";
import * as SecureStore from "expo-secure-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signInRequest } from "@/services/authService";

type Session = {
  user: User;
  accessToken: string;
};

const AuthContext = createContext<{
  signIn: (handle: string) => void;
  signOut: () => void;
  session?: Session | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

const avatar =
  "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim.png";

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>();
  const [isLoading, setIsLoading] = useState(true); // Change it to true after adding the session load

  const queryClient = useQueryClient();

  const { mutate: signIn } = useMutation({
    mutationFn: (handle: string) => signInRequest(handle),
    onSuccess: (data) => {
      setSession(data);
      saveSession(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  useEffect(() => {
    loadSession();
  }, []);

  const signOut = () => {
    queryClient.clear();
    setSession(null);
    saveSession(null);
  };

  const saveSession = async (value: Session | null) => {
    if (Platform.OS === "web") {
      // use localStorage
      if (value) {
        localStorage.setItem("session", JSON.stringify(value));
      } else {
        localStorage.removeItem("session");
      }
    } else {
      if (value) {
        await SecureStore.setItemAsync("session", JSON.stringify(value));
      } else {
        await SecureStore.deleteItemAsync("session");
      }
    }
  };

  const loadSession = async () => {
    if (Platform.OS === "web") {
      // localStorage
      const sessionData = localStorage.getItem("session");
      if (sessionData) {
        setSession(JSON.parse(sessionData));
      } else {
        setSession(null);
      }
    } else {
      const sessionData = await SecureStore.getItemAsync("session");
      if (sessionData) {
        setSession(JSON.parse(sessionData));
      } else {
        setSession(null);
      }
    }

    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
