import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { RootStackParamList } from "../types";
import ActionButton from "react-native-action-button";
import { Ionicons } from "@expo/vector-icons";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import * as Permissions from "expo-permissions";
import storage from "@react-native-firebase/storage";
import { ProgressBar } from "@react-native-community/progress-bar-android";
import firestore from "@react-native-firebase/firestore";
import { AuthContext } from "../context/AuthContext.android";

type AddPostNavigationProp = StackNavigationProp<RootStackParamList, "AddPost">;
type AddPostRouteProp = RouteProp<RootStackParamList, "AddPost">;
interface Props {
  navigation: AddPostNavigationProp;
  route: AddPostRouteProp;
}
const AddPost = ({ navigation }: Props) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | undefined | null>("");
  const [uploading, setUploading] = useState(false);
  const [transfered, setTransfered] = useState(0);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    askCameraPermissionAsync();
  });
  const askCameraPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== "granted") {
      alert(
        "Hey! You might want to enable notifications for my app, they are good."
      );
    }
  };
  const addPhoto = () => {
    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.5,
      },
      ({ uri }) => {
        setImage(uri);
      }
    );
  };
  const takePhoto = () => {
    launchCamera(
      {
        mediaType: "photo",
        includeBase64: false,
        maxHeight: 200,
        maxWidth: 200,
      },
      ({ uri }) => {
        setImage(uri);
      }
    );
  };

  const submitPost = async () => {
    const imageUrl = await uploadImageBucket();
    firestore()
      .collection("posts")
      .add({
        userId: user?.uid,
        post: text,
        postImg: imageUrl,
        postTime: firestore.Timestamp.fromDate(new Date()),
        likes: null,
        comments: null,
      })
      .then(() => {
        navigation.navigate("Home");
      });
    setText("");
  };

  const uploadImageBucket = async (): Promise<string | null> => {
    if (image === "" || typeof image === "undefined") {
      return null;
    }
    const imageUri = String(image);
    let fileName = image?.substring(image.lastIndexOf("/") + 1);
    const extension = fileName?.split(".").pop();
    const name = fileName?.split(".").slice(0, -1).pop();
    fileName = name! + "-" + Date.now() + extension;
    const storageRef = storage().ref(`photos/${fileName}`);
    const task = storageRef.putFile(imageUri);
    setUploading(true);

    task.on("state_changed", (taskSnapshot) => {
      const { bytesTransferred, totalBytes } = taskSnapshot;
      setTransfered(Math.round(bytesTransferred / totalBytes));
    });

    try {
      await task;
      setUploading(false);
      const imageUrl = storageRef.getDownloadURL();
      Alert.alert("Success", "Your post has been uploaded successfully", [
        {
          text: "OK",
          style: "default",
        },
      ]);
      setImage("");
      return imageUrl;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      {image !== "" && <Image source={{ uri: image }} style={styles.image} />}
      <TextInput
        placeholder="Whats on your mind?"
        multiline
        value={text}
        numberOfLines={4}
        onChangeText={(text) => setText(text)}
        style={styles.textInput}
      />
      {!uploading && (
        <TouchableOpacity
          onPress={() => submitPost()}
          style={{
            marginRight: 20,
            backgroundColor: "#c4d9fc",
            padding: 10,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: "dodgerblue", fontWeight: "bold" }}>Post</Text>
        </TouchableOpacity>
      )}
      {uploading && (
        <View style={{ width: "100%", paddingHorizontal: 70 }}>
          <ProgressBar
            progress={transfered}
            styleAttr="Horizontal"
            color="#2196F3"
          />
        </View>
      )}
      <ActionButton buttonColor="rgba(231,76,60,1)">
        <ActionButton.Item
          buttonColor="#3498db"
          title="Take Photo"
          onPress={takePhoto}
        >
          <Ionicons name="camera-outline" style={styles.actionButtonIcon} />
        </ActionButton.Item>
        <ActionButton.Item
          buttonColor="#1abc9c"
          title="Add Photo"
          onPress={addPhoto}
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
  image: {
    width: "90%",
    height: 250,
  },
});
