import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import AppLoading from "expo-app-loading";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import Header from "../components/Header";
import Login from "../screens/Login";
import SignUp from "../screens/SignUp";

const Stack = createStackNavigator();

const AuthStack = ({}) => {
  const [isFirstTime, setFirstTime] = useState<any>(null);
  let routename = "";
  useEffect(() => {
    (async () => {
      const value = await AsyncStorage.getItem("alreadyLaunched");
      if (value === null) {
        await AsyncStorage.setItem("alreadyLaunched", "true");
        setFirstTime(true);
      } else {
        setFirstTime(false);
      }
    })();
  }, []);
  if (isFirstTime === null) {
    return <AppLoading />;
  } else if (isFirstTime) {
    routename = "Onboarding";
  } else {
    routename = "Login";
  }
  return (
    <Stack.Navigator initialRouteName={routename}>
      <Stack.Screen
        name="Onboarding"
        component={Onboarding}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{
          headerTransparent: true,
          header: ({ navigation }) => <Header navigation={navigation} />,
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;

const styles = StyleSheet.create({});
