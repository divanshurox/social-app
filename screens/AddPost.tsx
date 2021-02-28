import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { RootStackParamList } from "../types";
import ActionButton from "react-native-action-button";
import { Ionicons } from "@expo/vector-icons";

type AddPostNavigationProp = StackNavigationProp<RootStackParamList, "AddPost">;
type AddPostRouteProp = RouteProp<RootStackParamList, "AddPost">;
interface Props {
  navigation: AddPostNavigationProp;
  route: AddPostRouteProp;
}
const AddPost = (props: Props) => {
  const [text, setText] = useState("");
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Whats on your mind?"
        multiline
        value={text}
        numberOfLines={4}
        onChangeText={(text) => setText(text)}
        style={styles.textInput}
      />
      <ActionButton buttonColor="rgba(231,76,60,1)">
        <ActionButton.Item
          buttonColor="#3498db"
          title="Take Photo"
          onPress={() => {}}
        >
          <Ionicons name="camera-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#1abc9c"
          title="Add Photo"
          onPress={() => {}}
        >
          <Ionicons name="albums-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
      </ActionButton>
    </View>
  );
};

export default AddPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  textInput: {
    justifyContent: "center",
    alignItems: "center",
    fontSize: 25,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white",
  },
});
