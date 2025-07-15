import {
  createContext,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import * as Notifications from "expo-notifications";
import { Alert, Platform } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { useMutation } from "@tanstack/react-query";
import { updateUserRequest } from "@/services/userService";
import { useAuth } from "./AuthProvider";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

type NotificationsContextType = {};
const NotificationsContext = createContext<NotificationsContextType>({});

export default function NotificationsProvider({ children }: PropsWithChildren) {
  const [permissions, setPermissions] =
    useState<Notifications.PermissionStatus | null>(null);
  const [pushToken, setPushToken] = useState<string>();

  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

  const lastNotification = Notifications.useLastNotificationResponse();

  const { session } = useAuth();
  const { mutate: updateUser } = useMutation({
    mutationFn: () =>
      updateUserRequest({ push_token: pushToken }, session?.accessToken!),
  });

  useEffect(() => {
    ensurePermissions();
  }, []);

  useEffect(() => {
    registerForPushNotificationsAsync().then(setPushToken);
  }, [permissions]);

  useEffect(() => {
    if (pushToken && session?.accessToken) {
      updateUser();
    }
  }, [pushToken, session?.accessToken]);

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:  ", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Response received", response);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  const ensurePermissions = async () => {
    // on Android, we first have to create a channel then ask for permissions
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    const existingPermissions = await Notifications.getPermissionsAsync();
    if (existingPermissions.status === "granted") {
      // user already gave permissions
      setPermissions(existingPermissions.status);
      return;
    }

    if (!existingPermissions.canAskAgain) {
      console.log("no permission, but we cannot request again.");
      Alert.alert(
        "Enable permission",
        "Please go to settings and enable push notification permission"
      );
    }

    const newPermission = await Notifications.requestPermissionsAsync();
    setPermissions(newPermission.status);
  };

  const registerForPushNotificationsAsync = async () => {
    if (permissions !== "granted") {
      return;
    }

    if (!Device.isDevice) {
      return;
    }

    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;

    try {
      const { data: pushToken } = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      return pushToken;
    } catch (e) {
      console.log("Failed to get the token");
    }
  };

  const scheduleNotification = (
    title: string,
    body: string,
    trigger: Notifications.NotificationTriggerInput
  ) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
      },
      trigger,
    });
  };

  console.log("Push token: ", pushToken);

  return (
    <NotificationsContext.Provider value={{ scheduleNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
}
