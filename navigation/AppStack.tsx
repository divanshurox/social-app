import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import AddPost from "../screens/AddPost";
import BottomTab from "./BottomTab";

const Stack = createStackNavigator();
const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={BottomTab}
        options={{
          header: () => null,
        }}
      />
      <Stack.Screen
        name="AddPost"
        component={AddPost}
        options={{
          headerTitleAlign: "center",
          headerStyle: {
            backgroundColor: "white",
            shadowColor: "white",
            elevation: 5,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;

const styles = StyleSheet.create({});
