import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../types";
import { AntDesign } from "@expo/vector-icons";
import FormInput from "../components/FormInput";
import FormButton from "../components/FormButton";
import * as ImagePicker from "react-native-image-picker";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import { AuthContext } from "../context/AuthContext.android";

type EditProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "EditProfile"
>;
type EditProfileScreenRouteProp = RouteProp<RootStackParamList, "EditProfile">;
interface Props {
  navigation: EditProfileScreenNavigationProp;
  route: EditProfileScreenRouteProp;
}

const EditProfile = ({ route, navigation }: Props) => {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [photoURL, setPhoto] = useState<string | undefined>("");
  const { user } = useContext(AuthContext);
  const [isImageChanged, setImageChanged] = useState(false);
  const {
    bio: about,
    firstName,
    lastName,
    phone: Phone,
    photoUrl,
  } = route.params;
  useEffect(() => {
    if (route.params) {
      if (about) {
        setBio(about);
      }
      if (firstName) {
        setFName(firstName);
      }
      if (lastName) {
        setLName(lastName);
      }
      if (Phone) {
        setPhone(Phone);
      }
      if (photoUrl) {
        setPhoto(photoUrl);
      }
    }
  }, [route.params]);

  const getPicture = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.5,
      },
      ({ uri }) => {
        setImageChanged(true);
        setPhoto(uri);
      }
    );
  };

  const deleteImageFromBucket = async (imgUrl: string | undefined) => {
    if (imgUrl !== undefined) {
      const imageRef = storage().refFromURL(imgUrl);
      try {
        await imageRef.delete();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const uploadImageBucket = async (): Promise<string | null> => {
    const imageUri = String(photoURL);
    let fileName = photoURL?.substring(photoURL.lastIndexOf("/") + 1);
    const extension = fileName?.split(".").pop();
    const name = fileName?.split(".").slice(0, -1).pop();
    fileName = name! + "-" + Date.now() + extension;
    const storageRef = storage().ref(`photos/${fileName}`);
    const task = storageRef.putFile(imageUri);

    try {
      await task;
      const imageUrl = storageRef.getDownloadURL();
      return imageUrl;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const updateProfileImageBucket = async () => {
    let userImgUrl = "";
    try {
      const data = await firestore().collection("users").doc(user?.uid).get();
      if (data.exists) {
        userImgUrl = data.data()?.userImg;
      }
    } catch (err) {
      console.log(err);
    }
    if (isImageChanged) {
      try {
        if (
          userImgUrl ===
            "https://www.clearmountainbank.com/wp-content/uploads/2020/04/male-placeholder-image.jpeg" ||
          userImgUrl === null ||
          userImgUrl === undefined
        ) {
          // Directly upload the image
          const imageUrl = await uploadImageBucket();
          setPhoto(imageUrl!);
          return imageUrl;
        } else {
          // First delete the existing image then add the new image
          deleteImageFromBucket(userImgUrl);
          const imageUrl = await uploadImageBucket();
          setPhoto(imageUrl!);
          return imageUrl;
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      return userImgUrl;
    }
  };

  const updateProfile = async () => {
    const imageUrl = await updateProfileImageBucket();
    try {
      await firestore().collection("users").doc(user?.uid).update({
        fName,
        lName,
        userImg: imageUrl,
        "profileData.bio": bio,
        phone,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 20,
        backgroundColor: "#fff",
        flex: 1,
      }}
    >
      <View style={styles.root}>
        <TouchableOpacity onPress={() => getPicture()}>
          <ImageBackground
            source={{ uri: photoURL }}
            imageStyle={{ borderRadius: 130 / 2, opacity: 0.7 }}
            style={styles.image}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <AntDesign name="camera" size={24} color="black" />
            </View>
          </ImageBackground>
        </TouchableOpacity>
        <View>
          <FormInput
            iconName="user"
            placeholder="First Name"
            placeholderTextColor="#000"
            value={fName}
            onChangeText={(text) => setFName(text)}
          />
          <FormInput
            iconName="user"
            placeholder="Last Name"
            placeholderTextColor="#000"
            value={lName}
            onChangeText={(text) => setLName(text)}
          />
          <FormInput
            iconName="user"
            placeholder="Bio"
            placeholderTextColor="#000"
            value={bio}
            onChangeText={(text) => setBio(text)}
          />
          <FormInput
            iconName="phone"
            placeholder="Phone"
            placeholderTextColor="#000"
            value={phone}
            onChangeText={(text) => setPhone(text)}
          />
        </View>
        <FormButton
          text="Update"
          color="#1197F6"
          onPress={async () => {
            await updateProfile();
            navigation.navigate("Profile");
          }}
        />
      </View>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    paddingVertical: 30,
  },
  row: {
    flexDirection: "row",
  },
  image: {
    height: 130,
    width: 130,
  },
  imageOver: {},
});
