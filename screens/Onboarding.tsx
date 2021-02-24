import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Image, TouchableOpacity, Text, View } from "react-native";
import { RootStackParamList } from "../types";
import Onboard from "react-native-onboarding-swiper";

type OnboardingScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Onboarding"
>;
type OnboardingScreenRouteProp = RouteProp<RootStackParamList, "Onboarding">;
type Props = {
  navigation?: OnboardingScreenNavigationProp;
  route?: OnboardingScreenRouteProp;
};

const Done = ({ ...props }) => {
  return (
    <TouchableOpacity style={{ marginRight: 10 }} {...props}>
      <Text>Done</Text>
    </TouchableOpacity>
  );
};

const Dot = ({ selected }: any) => {
  return (
    <View
      style={{
        width: 5,
        height: 5,
        borderRadius: 5 / 2,
        backgroundColor: selected ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.3)",
        marginHorizontal: 3,
      }}
    />
  );
};

const Onboarding: React.FC<Props> = ({ navigation }) => {
  return (
    <Onboard
      DoneButtonComponent={Done}
      DotComponent={Dot}
      onDone={() => navigation?.replace("Login")}
      onSkip={() => navigation?.navigate("Login")}
      pages={[
        {
          backgroundColor: "#a6e4d0",
          image: (
            <Image
              style={styles.imageStyle}
              source={{
                uri:
                  "https://raw.githubusercontent.com/itzpradip/react-native-firebase-social-app/master/assets/onboarding-img1.png",
              }}
            />
          ),
          title: "Onboarding",
          subtitle: "Done with React Native Onboarding Swiper",
        },
        {
          backgroundColor: "#fdeb93",
          image: (
            <Image
              style={styles.imageStyle}
              source={{
                uri:
                  "https://raw.githubusercontent.com/itzpradip/react-native-firebase-social-app/master/assets/onboarding-img2.png",
              }}
            />
          ),
          title: "Onboarding",
          subtitle: "Done with React Native Onboarding Swiper",
        },
        {
          backgroundColor: "#e9bcbe",
          image: (
            <Image
              style={styles.imageStyle}
              source={{
                uri:
                  "https://raw.githubusercontent.com/itzpradip/react-native-firebase-social-app/master/assets/onboarding-img3.png",
              }}
            />
          ),
          title: "Onboarding",
          subtitle: "Done with React Native Onboarding Swiper",
        },
      ]}
    />
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  imageStyle: {
    width: 200,
    height: 200,
  },
});
