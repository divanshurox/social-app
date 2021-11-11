import PushNotification, {
  PushNotificationObject,
} from "react-native-push-notification";

export const LocalNotification = (props: PushNotificationObject) => {
  PushNotification.localNotification({
    ...props,
  });
};
