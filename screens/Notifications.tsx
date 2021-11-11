import React, { useEffect } from "react";
import { StyleSheet, View, Button } from "react-native";
import { LocalNotification } from "./services/LocalNotification";
import { LocalScheduledNotification } from "./services/LocalScheduledNotification";
import messaging from "@react-native-firebase/messaging";
import { CHANNEL_ID } from "./config";

export default function App() {
  useEffect(() => {
    const message = messaging().onMessage(async (remoteMessage) => {
      console.log(remoteMessage);
      LocalNotification({
        ...remoteMessage,
        channelId: CHANNEL_ID,
        message: "FCM Token",
      });
    });
    return () => message();
  }, []);
  useEffect(() => {
    (async () => {
      const token = await messaging().getToken();
      console.log(token);
    })();
  }, []);
  return (
    <View style={styles.container}>
      {/* <Button onPress={() => LocalNotification()} title="Local Notification" /> */}
      <Button
        onPress={() => LocalScheduledNotification()}
        title="Local Scheduled Notification"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
