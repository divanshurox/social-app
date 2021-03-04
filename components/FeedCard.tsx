import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Animated,
  TextInput,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext.android";
import moment from "moment";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import ProgressiveImage from "./ProgressiveImage";

interface Interactions {
  likes?: number | null;
  comments?: number | null;
}

export interface FeedCardProps {
  id: string;
  creatorId: string;
  avatar: string;
  name: string;
  time: string | FirebaseFirestoreTypes.Timestamp;
  text: string;
  image?: string;
  interactions?: Interactions;
  onDelete?: (id: string) => void;
}

const CARD_HEIGHT_WITH_IMAGE = 380;
const CARD_HEIGHT_WITHOUT_IMAGE = 200;

const INTERPOLATED_CARD_HEIGHT_WITH_IMAGE = 430;
const INTERPOLATED_CARD_HEIGHT_WITHOUT_IMAGE = 250;

const FeedCard = ({
  avatar,
  text,
  image,
  interactions,
  name,
  time,
  creatorId,
  id,
  onDelete,
}: FeedCardProps) => {
  const [isLiked, setLiked] = useState(false);
  const [isCommented, setCommented] = useState(false);
  const [comment, setComment] = useState("");
  const { user } = useContext(AuthContext);
  const animVal = new Animated.Value(0);
  const cardHeight = animVal.interpolate({
    inputRange: [0, 1],
    outputRange: [
      image ? CARD_HEIGHT_WITH_IMAGE : CARD_HEIGHT_WITHOUT_IMAGE,
      image
        ? INTERPOLATED_CARD_HEIGHT_WITH_IMAGE
        : INTERPOLATED_CARD_HEIGHT_WITHOUT_IMAGE,
    ],
    extrapolate: "clamp",
  });
  const toggleAnimation = () => {
    Animated.spring(animVal, {
      toValue: 1,
      useNativeDriver: false,
    }).start(() => setCommented(true));
  };
  const toggleReverseAnimation = () => {
    Animated.spring(animVal, {
      toValue: 0,
      useNativeDriver: false,
    }).start(() => setCommented(false));
  };

  return (
    <Animated.View style={[styles.root, styles.shadow, { height: cardHeight }]}>
      {/* User Info View */}
      <View style={[styles.row, styles.userContainer]}>
        <View>
          <Image
            source={{
              uri: avatar,
            }}
            style={styles.avatarImage}
          />
        </View>
        <View style={styles.userInfoContainer}>
          <Text style={{ fontWeight: "bold" }}>{name}</Text>
          <Text>{moment(time.toDate()).fromNow()}</Text>
        </View>
      </View>
      {/* Text View */}
      <View style={{ marginBottom: 10 }}>
        <Text>{text}</Text>
      </View>
      {/* Image View */}
      {image && (
        <ProgressiveImage
          image={image!}
          defaultImage={require("../assets/default.png")}
          style={styles.feedImage}
        />
      )}
      {/* Interactions View */}
      <View style={[styles.row, styles.interactionContainer]}>
        <TouchableOpacity
          onPress={() => setLiked(true)}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          {isLiked ? (
            <AntDesign name="heart" size={24} color="dodgerblue" />
          ) : (
            <AntDesign name="hearto" size={24} color="black" />
          )}
          <Text>{interactions?.likes} Likes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleAnimation()}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <FontAwesome name="comment-o" size={24} color="black" />
          <Text>{interactions?.comments} Comments</Text>
        </TouchableOpacity>
        {creatorId === user?.uid && (
          <TouchableOpacity
            onPress={() => onDelete(id)}
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <FontAwesome name="trash-o" size={24} color="black" />
            <Text>{interactions?.comments} Delete Post</Text>
          </TouchableOpacity>
        )}
      </View>
      {isCommented && (
        <View
          style={[
            styles.row,
            {
              justifyContent: "center",
              alignItems: "baseline",
            },
          ]}
        >
          <TextInput
            style={styles.textInput}
            value={comment}
            onChangeText={(text) => setComment(text)}
          />
          <TouchableOpacity
            onPress={() => toggleReverseAnimation()}
            style={{ marginLeft: 5 }}
          >
            <Text>Post</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
};

export default FeedCard;

const styles = StyleSheet.create({
  root: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#F5F5F5",
    marginHorizontal: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  row: {
    flexDirection: "row",
  },
  shadow: {
    shadowColor: "#ccc",
    shadowOffset: {
      width: 10,
      height: 10,
    },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarImage: {
    height: 60,
    width: 60,
    borderRadius: 50,
  },
  feedImage: {
    height: 190,
  },
  userContainer: {
    marginBottom: 10,
  },
  userInfoContainer: {
    justifyContent: "center",
    marginLeft: 15,
  },
  interactionContainer: {
    justifyContent: "space-around",
    marginTop: 10,
  },
  textInput: {
    height: 40,
    borderBottomColor: "#000",
    borderBottomWidth: 1,
    width: "80%",
  },
});
