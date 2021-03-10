import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useEffect, useContext } from "react";
import { StyleSheet, View, FlatList, ActivityIndicator } from "react-native";
import MessageCard from "../components/MessageCard";
import { RootStackParamList } from "../types";
import firestore from "@react-native-firebase/firestore";
import { AuthContext } from "../context/AuthContext.android";

type MessagesScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Messages"
>;
type MessagesScreenRouteProp = RouteProp<RootStackParamList, "Messages">;
interface Props {
  navigation: MessagesScreenNavigationProp;
  route: MessagesScreenRouteProp;
}

interface MessageArray {
  id: string;
  userName: string;
  userImg: string;
  messageTime?: string;
  messageText?: string;
}

const Messages = ({ navigation }: Props) => {
  const [messagesArr, setMessageArr] = useState<MessageArray[] | []>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { profileData } = user;
  useEffect(() => {
    fetchMessageUser();
  }, []);
  const fetchMessageUser = async () => {
    try {
      setMessageArr([]);
      let data = [];
      Promise.all(
        profileData.following.map(async (ele: any) => {
          const doc = await firestore().collection("users").doc(ele).get();
          if (doc.exists) {
            const { userImg, fName, lName }: any = doc.data();
            return {
              id: doc.id,
              userImg,
              userName: fName + " " + lName,
            };
          }
        })
      ).then((res) => {
        setMessageArr(res as any);
      });
      if (loading) {
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View style={styles.container}>
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="dodgerblue" />
        </View>
      ) : (
        <FlatList
          data={messagesArr}
          renderItem={({ item }) => (
            <MessageCard navigation={navigation} {...item} />
          )}
          keyExtractor={(ele) => ele.id}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchMessageUser}
        />
      )}
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
