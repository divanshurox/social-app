import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../types";

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, "Chat">;
type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;
interface Props {
  navigation: ChatScreenNavigationProp;
  route: ChatScreenRouteProp;
}

const Chat = ({}: Props) => {
  return (
    <View style={styles.container}>
      <Text>Chat</Text>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
