import { Expo, ExpoPushMessage } from "expo-server-sdk";

const expo = new Expo({
  // accessToken: process.env.EXPO_ACCESS_TOKEN,
});

export async function sendNotification(data: ExpoPushMessage) {
  const message: ExpoPushMessage = {
    sound: "default",
    ...data,
  };

  await expo.sendPushNotificationsAsync([message]);
}
