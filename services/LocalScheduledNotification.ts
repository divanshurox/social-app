import PushNotification from "react-native-push-notification";
import { CHANNEL_ID } from "../config";

export const LocalScheduledNotification = () => {
  PushNotification.localNotificationSchedule({
    channelId: CHANNEL_ID,
    message: "This is a scheduled notification",
    date: new Date(Date.now() + 10 * 1000), // after 10 seconds
    bigText:
      "This is local notification demo in React Native app. Only shown, when expanded.",
    subText: "Local Notification Demo",
    title: "Local Notification Title",
  });
};
