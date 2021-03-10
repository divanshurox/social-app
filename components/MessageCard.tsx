import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { RootStackParamList } from "../types";

interface Props {
  id: string;
  userName: string;
  userImg: string;
  messageTime?: string;
  messageText?: string;
  navigation: StackNavigationProp<RootStackParamList, "Messages">;
}

const MessageCard = ({ userName, userImg, navigation, id }: Props) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Chat", {
          userName,
          id,
          userImg,
        })
      }
      style={[
        styles.row,
        styles.root,
        {
          borderBottomColor: "#ccc",
          borderBottomWidth: 1,
          borderBottomStartRadius: 50,
          borderBottomEndRadius: 50,
          paddingBottom: 10,
        },
      ]}
    >
      <View>
        <Image source={{ uri: userImg }} style={styles.image} />
      </View>
      <View
        style={{
          justifyContent: "center",
          marginHorizontal: 5,
          padding: 5,
        }}
      >
        <View
          style={[
            styles.row,
            {
              justifyContent: "space-between",
            },
          ]}
        >
          <Text>{userName}</Text>
          {/* <Text>{messageTime}</Text> */}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default MessageCard;

const styles = StyleSheet.create({
  root: {
    marginVertical: 5,
    width: "100%",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  row: {
    flexDirection: "row",
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "black",
    flex: 0,
  },
});
