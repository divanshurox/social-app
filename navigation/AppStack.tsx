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
          headerRight: () => (
            <View
              style={{
                marginRight: 20,
                backgroundColor: "#c4d9fc",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "dodgerblue", fontWeight: "bold" }}>
                Post
              </Text>
            </View>
          ),
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
