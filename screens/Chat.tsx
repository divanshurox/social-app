import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { RootStackParamList } from "../types";
import {
  Actions,
  ActionsProps,
  GiftedChat,
  Send,
} from "react-native-gifted-chat";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext.android";
import firestore from "@react-native-firebase/firestore";
import moment from "moment";
import * as ImagePicker from "react-native-image-picker";

type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, "Chat">;
type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">;
interface Props {
  navigation: ChatScreenNavigationProp;
  route: ChatScreenRouteProp;
}

interface User {
  _id: number;
  name: string;
  avatar: string;
}
interface Message {
  _id: string | number;
  text: string;
  createdAt: Date | number;
  user: User;
  image?: string;
  video?: string;
  audio?: string;
  system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
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

const Chat = ({ navigation, route }: Props) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [image, setImage] = useState<string | undefined | null>(null);
  const { user } = useContext(AuthContext);
  const { userName, id, userImg } = route.params;
  const keyId = keyForMessageCollection(user?.uid as string, id);
  useEffect(() => {
    const subcriber = firestore()
      .collection("messages")
      .doc(keyId)
      .onSnapshot((docSnapshot) => {
        if (docSnapshot.exists) {
          const { messages: PreviousMessages }: any = docSnapshot.data();
          setMessages(PreviousMessages);
        }
      });
    return () => subcriber();
  }, [keyId]);

  const onSend = useCallback(async (messages = []) => {
    const keyId = keyForMessageCollection(user?.uid as string, id);
    const message = messages[0];
    try {
      let messagesArray = [];
      const doc = await firestore().collection("messages").doc(keyId).get();
      if (doc.exists) {
        const { messages: previousMessages }: any = doc.data();
        messagesArray = [
          ...previousMessages,
          {
            ...message,
            createdAt: moment(message.createdAt).format(),
            user: {
              _id: message.user._id,
              avatar: userImg,
              name: userName,
            },
          },
        ];
        await firestore().collection("messages").doc(keyId).update({
          messages: messagesArray,
        });
      }
    } catch (err) {
      console.log(err);
    }
    // setMessages((previousMessages) =>
    //   GiftedChat.append(previousMessages, messages)
    // );
  }, []);

  const renderSend = (props: any) => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            size={47}
            color="#2e64e5"
          />
        </View>
      </Send>
    );
  };

  const renderLoading = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="dodgerblue" />
      </View>
    );
  };
  const handlePickImage = () => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.5,
      },
      ({ uri, didCancel }) => {
        if (!didCancel) {
          setImage(uri);
          navigation.navigate("ImageUpload", {
            image: uri,
            id,
            userImg,
            userName,
          });
        }
      }
    );
  };
  const renderActions = (
    props: Readonly<ActionsProps> &
      Readonly<{
        children?: React.ReactNode;
      }>
  ) => {
    return (
      <Actions
        {...props}
        options={{
          ["Send Image"]: handlePickImage,
        }}
      ></Actions>
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: user?.uid as any,
      }}
      alwaysShowSend
      renderSend={renderSend}
      scrollToBottom
      renderLoading={renderLoading}
      renderActions={renderActions}
      onPressActionButton={handlePickImage}
      imageStyle={{
        width: "90%",
        position: "relative",
        left: 7,
      }}
      scrollToBottomComponent={() => {
        return (
          <FontAwesome
            name="angle-double-down"
            style={{
              marginRight: 10,
            }}
            size={25}
            color="#ccc"
          />
        );
      }}
    />
  );
};

export default Chat;
