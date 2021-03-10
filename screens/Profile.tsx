import React, { useState, useEffect, useContext } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  RefreshControl,
} from "react-native";
import FeedCard, { FeedCardProps } from "../components/FeedCard";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { AuthContext } from "../context/AuthContext.android";
import { RouteProp, useIsFocused } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
import storage from "@react-native-firebase/storage";

type ProfileScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Profile"
>;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, "Profile">;
interface Props {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
}

const { width } = Dimensions.get("window");

const Profile = ({ navigation, route }: Props) => {
  const [userPosts, setUserPosts] = useState<FeedCardProps[]>();
  const [loading, setLoading] = useState(true);
  const { user, logout } = useContext(AuthContext);
  const { profileData }: any = user;
  const [deleted, setDeleted] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchUser();
    return () => fetchUser();
  }, [isFocused]);

  useEffect(() => {
    fetchPosts();
    return () => fetchPosts();
  }, [deleted]);

  const userId = route.params ? route.params?.userId : user?.uid;

  const fetchUser = async () => {
    const data = await firestore().collection("users").doc(userId).get();
    if (data.exists) {
      setUserData(data.data());
    }
  };

  const fetchPosts = async () => {
    try {
      setUserPosts([]);
      let userPostsArr: FeedCardProps[] = [];
      const { docs } = await firestore()
        .collection("posts")
        .where("userId", "==", userId)
        .get();
      docs.forEach((doc) => {
        const { comments, likes, post, postImg, postTime, userId } = doc.data();
        userPostsArr.push({
          id: doc.id,
          creatorId: userId,
          text: post,
          image: postImg,
          interactions: {
            likes,
            comments,
          },
          time: postTime,
        });
      });
      setUserPosts(userPostsArr);
      if (loading) {
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const deletePost = async (id: string) => {
    const doc = await firestore().collection("posts").doc(id).get();
    if (doc.exists) {
      try {
        const { postImg }: any = doc.data();
        if (postImg !== null) {
          // First delete the image
          const imgRef = storage().refFromURL(postImg);
          try {
            await imgRef.delete();
            deletePostFirestore(id);
            setDeleted(true);
          } catch (err) {
            console.log(err);
          }
        } else {
          deletePostFirestore(id);
          setDeleted(true);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const deletePostFirestore = async (id: string) => {
    try {
      await firestore().collection("posts").doc(id).delete();
      Alert.alert("Attention", "Your post has been deleted successfully");
    } catch (err) {
      console.log(err);
    }
  };

  const onFollowPress = async () => {
    // First update the following in the current users data
    try {
      const currentUserData = await firestore()
        .collection("users")
        .doc(user?.uid)
        .get();
      if (currentUserData.exists) {
        let currentUserFollowing = [];
        const {
          profileData: { following },
        }: any = currentUserData.data();
        currentUserFollowing = [...following, route?.params?.userId];
        console.log(currentUserFollowing);
        await firestore().collection("users").doc(user?.uid).update({
          "profileData.following": currentUserFollowing,
        });
      }
    } catch (err) {
      console.log(err);
    }
    // Update the followers list in second user
    try {
      const currentUserData = await firestore()
        .collection("users")
        .doc(route?.params?.userId)
        .get();
      if (currentUserData.exists) {
        let currentUserFollowers = [];
        const {
          profileData: { followers },
        }: any = currentUserData.data();
        currentUserFollowers = [...followers, user?.uid];
        console.log(currentUserFollowers);
        await firestore().collection("users").doc(route.params?.userId).update({
          "profileData.followers": currentUserFollowers,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.root}
      refreshControl={
        <RefreshControl
          onRefresh={() => {
            fetchUser();
            fetchPosts();
          }}
          refreshing={loading}
        />
      }
    >
      <View
        style={{
          marginVertical: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          source={{
            uri: userData?.userImg,
          }}
          style={styles.image}
        />
        <Text style={{ fontWeight: "700", color: "black", fontSize: 25 }}>
          {userData?.fName} {userData?.lName}
        </Text>
      </View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text>{userData?.profileData?.bio}</Text>
        <View
          style={[
            styles.row,
            {
              justifyContent: "space-around",
              width: 200,
              marginVertical: 20,
            },
          ]}
        >
          {route.params ? (
            <>
              <TouchableOpacity style={styles.button}>
                <Text style={{ fontWeight: "600", color: "black" }}>
                  Message
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => onFollowPress()}
              >
                <Text style={{ fontWeight: "600", color: "black" }}>
                  {profileData.following.indexOf(route.params?.userId) !== -1
                    ? "Following"
                    : "Follow"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  navigation.navigate("EditProfile", {
                    firstName: userData?.fName,
                    lastName: userData?.lName,
                    bio: userData?.profileData?.bio,
                    phone: userData?.phone,
                    photoUrl: userData?.userImg,
                  })
                }
              >
                <Text style={{ fontWeight: "600", color: "black" }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => logout()}>
                <Text style={{ fontWeight: "600", color: "black" }}>
                  Logout
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <View
        style={[
          styles.row,
          {
            justifyContent: "space-between",
            width: 350,
            paddingHorizontal: 20,
          },
        ]}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 30, color: "black" }}>
            {userData?.profileData?.posts}
          </Text>
          <Text>Posts</Text>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 30, color: "black" }}>
            {userData?.profileData?.followers.length}
          </Text>
          <Text>Followers</Text>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 30, color: "black" }}>
            {userData?.profileData?.following.length}
          </Text>
          <Text>Following</Text>
        </View>
      </View>
      {userPosts && (
        <View
          style={{
            width: width - 20,
            marginVertical: 10,
          }}
        >
          {userPosts!.map((ele, i) => {
            return (
              <FeedCard
                key={i}
                {...ele}
                onDelete={() => {
                  Alert.alert("Attention", "Are you sure to delete the post?", [
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                    {
                      text: "Ok",
                      style: "default",
                      onPress: () => deletePost(ele.id),
                    },
                  ]);
                }}
              />
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
  },
  row: {
    flexDirection: "row",
  },
  image: {
    height: 130,
    width: 130,
    borderRadius: 130 / 2,
  },
  button: {
    borderColor: "#3b5998",
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
});
