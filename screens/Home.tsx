import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, FlatList, View, Alert, ScrollView } from "react-native";
import { RootStackParamList } from "../types";
import FeedCard, { FeedCardProps } from "../components/FeedCard";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { AuthContext } from "../context/AuthContext.android";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;
type HomeScreenRouteProp = RouteProp<RootStackParamList, "Home">;
interface Props {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
}

const Home = ({ navigation }: Props) => {
  const [posts, setPosts] = useState<FeedCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const { user, setUser } = useContext(AuthContext);
  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    fetchPosts();
  }, [deleted]);
  const fetchUser = async () => {
    const data = await firestore().collection("users").doc(user?.uid).get();
    if (data.exists) {
      const obj = data.data();
      setUser({
        uid: user?.uid,
        ...obj,
      } as any);
    }
  };
  const fetchPosts = async () => {
    try {
      setPosts([]);
      let postsArr: FeedCardProps[] = [];
      const { docs } = await firestore()
        .collection("posts")
        .orderBy("postTime", "desc")
        .get();
      docs.forEach((doc) => {
        const { comments, likes, post, postImg, postTime, userId } = doc.data();
        postsArr.push({
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
      setPosts(postsArr);
      if (loading) {
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const deletePost = async (postId: string) => {
    const doc = await firestore().collection("posts").doc(postId).get();
    if (doc.exists) {
      const { postImg } = doc.data();
      if (postImg !== null) {
        const imageRef = storage().refFromURL(postImg);
        try {
          await imageRef.delete();
          deletePostFirestore(postId);
          setDeleted(true);
        } catch (err) {
          console.log(err);
        }
      } else {
        deletePostFirestore(postId);
        setDeleted(true);
      }
    }
  };
  const deletePostFirestore = async (postId: string) => {
    try {
      await firestore().collection("posts").doc(postId).delete();
      Alert.alert("Attention", "Your post has been deleted successfully");
    } catch (err) {
      console.log(err);
    }
  };
  if (loading) {
    return (
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          alignItems: "center",
          paddingVertical: 20,
          backgroundColor: "#fff",
        }}
        showsVerticalScrollIndicator={false}
      >
        <SkeletonPlaceholder>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 60, height: 60, borderRadius: 50 }} />
            <View style={{ marginLeft: 20 }}>
              <View style={{ width: 120, height: 20, borderRadius: 4 }} />
              <View
                style={{
                  marginTop: 6,
                  width: 80,
                  height: 20,
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
          <View style={{ marginTop: 10, marginBottom: 30 }}>
            <View style={{ width: 300, height: 20, borderRadius: 4 }} />
            <View
              style={{
                marginTop: 6,
                width: 250,
                height: 20,
                borderRadius: 4,
              }}
            />
            <View
              style={{
                marginTop: 6,
                width: 350,
                height: 200,
                borderRadius: 4,
              }}
            />
          </View>
        </SkeletonPlaceholder>
        <SkeletonPlaceholder>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={{ width: 60, height: 60, borderRadius: 50 }} />
            <View style={{ marginLeft: 20 }}>
              <View style={{ width: 120, height: 20, borderRadius: 4 }} />
              <View
                style={{
                  marginTop: 6,
                  width: 80,
                  height: 20,
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
          <View style={{ marginTop: 10, marginBottom: 30 }}>
            <View style={{ width: 300, height: 20, borderRadius: 4 }} />
            <View
              style={{
                marginTop: 6,
                width: 250,
                height: 20,
                borderRadius: 4,
              }}
            />
            <View
              style={{
                marginTop: 6,
                width: 350,
                height: 200,
                borderRadius: 4,
              }}
            />
          </View>
        </SkeletonPlaceholder>
      </ScrollView>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <FeedCard
            {...item}
            onPress={() => {
              navigation.navigate("HomeProfile", {
                userId: item.creatorId,
              });
            }}
            onDelete={() => {
              Alert.alert("Attention", "Are you sure to delete the post?", [
                {
                  text: "Cancel",
                  style: "cancel",
                },
                {
                  text: "Ok",
                  style: "default",
                  onPress: () => deletePost(item.id),
                },
              ]);
            }}
          />
        )}
        keyExtractor={(ele) => ele.id}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        onRefresh={fetchPosts}
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
});
