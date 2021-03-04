import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import AddPost from "../screens/AddPost";
import Chat from "../screens/Chat";
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
        name="Chat"
        component={Chat}
        options={({ route }) => ({
          headerTitleAlign: "center",
          headerStyle: {
            elevation: 0,
            shadowColor: "white",
          },
          title: route?.params?.userName,
        })}
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
