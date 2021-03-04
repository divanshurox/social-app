import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import MessageCard from "../components/MessageCard";
import { RootStackParamList } from "../types";

type MessagesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Messages"
>;
type MessagesScreenRouteProp = RouteProp<RootStackParamList, "Messages">;
interface Props {
  navigation: MessagesScreenNavigationProp;
  route: MessagesScreenRouteProp;
}

const MessagesArr = [
  {
    id: "1",
    userName: "Jenny Doe",
    userImg: "https://randomuser.me/api/portraits/men/96.jpg",
    messageTime: "4 mins ago",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "2",
    userName: "John Doe",
    userImg: "https://randomuser.me/api/portraits/women/3.jpg",
    messageTime: "2 hours ago",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "3",
    userName: "Ken William",
    userImg: "https://randomuser.me/api/portraits/women/0.jpg",
    messageTime: "1 hours ago",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "4",
    userName: "Selina Paul",
    userImg: "https://randomuser.me/api/portraits/men/89.jpg",
    messageTime: "1 day ago",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
  {
    id: "5",
    userName: "Christy Alex",
    userImg: "https://randomuser.me/api/portraits/women/13.jpg",
    messageTime: "2 days ago",
    messageText:
      "Hey there, this is my test for a post of my social app in React Native.",
  },
];

const Messages = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={MessagesArr}
        renderItem={({ item }) => (
          <MessageCard navigation={navigation} {...item} />
        )}
        keyExtractor={(ele) => ele.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
