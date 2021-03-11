import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext } from "react";
import {
  StyleSheet,
  Image,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import { AuthContext } from "../context/AuthContext.android";
import { RootStackParamList } from "../types";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import moment from "moment";

const { height, width } = Dimensions.get("window");

type ImageUploadScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "ImageUpload"
>;
type ImageUploadScreenRouteProp = RouteProp<RootStackParamList, "ImageUpload">;
interface Props {
  navigation: ImageUploadScreenNavigationProp;
  route: ImageUploadScreenRouteProp;
}

const keyForMessageCollection = (key1: string, key2: string) => {
  let res;
  if (key1 > key2) {
    res = key1 + key2;
  } else {
    res = key2 + key1;
  }
  return res;
};

const ImageUpload = ({ navigation, route }: Props) => {
  const { image, id, userImg, userName } = route.params;
  const { user } = useContext(AuthContext);

  const uploadImageBucket = async () => {
    const imageUri = String(image);
    let fileName = image?.substring(image?.lastIndexOf("/") + 1);
    const extension = image?.split(".").pop();
    const name = fileName?.split(".").slice(0, -1).pop();
    fileName = name + "-" + Date.now() + "." + extension;
    const storageRef = storage().ref(`photos/${fileName}`);
    try {
      await storageRef.putFile(imageUri);
    } catch (err) {
      console.log(err);
    }
    const imageUrl = storageRef.getDownloadURL();
    return imageUrl;
  };

  const onSend = async () => {
    const keyId = keyForMessageCollection(user?.uid as string, id);
    const imageUrl = await uploadImageBucket();
    try {
      let messagesArray = [];
      const doc = await firestore().collection("messages").doc(keyId).get();
      if (doc.exists) {
        const { messages: previousMessages }: any = doc.data();
        messagesArray = [
          ...previousMessages,
          {
            createdAt: moment(new Date()).format(),
            image: imageUrl,
            text: null,
            user: {
              _id: user?.uid,
              avatar: userImg,
              name: userName,
            },
          },
        ];
        await firestore().collection("messages").doc(keyId).update({
          messages: messagesArray,
        });
        navigation.goBack();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image as string | undefined }}
        style={styles.image}
      />
      <TouchableOpacity onPress={onSend} style={styles.button}>
        <Text style={styles.text}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  image: {
    width,
    height: height * 0.5,
  },
  button: {
    width: width - 20,
    backgroundColor: "#2e64e5",
    padding: 17,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
});
