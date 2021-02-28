import React from "react";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Home from "../screens/Home";
import Messages from "../screens/Messages";
import Profile from "../screens/Profile";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import { View } from "react-native";
import { RootStackParamList } from "../types";

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  navigation: NavigationProp;
}

const HomeStack = ({ navigation }: Props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerRight: () => (
            <View
              style={{
                marginRight: 10,
              }}
            >
              <AntDesign
                name="plus"
                size={25}
                color="dodgerblue"
                onPress={() => navigation.navigate("AddPost")}
              />
            </View>
          ),
          headerTitleAlign: "center",
          title: "RN Social",
          headerTitleStyle: {
            color: "dodgerblue",
            fontSize: 25,
          },
          headerStyle: {
            backgroundColor: "white",
            shadowColor: "white",
            elevation: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
};

const BottomTab = ({}) => {
  return (
    <Tab.Navigator initialRouteName="Home" shifting>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: () => {
            return (
              <MaterialCommunityIcons name="home" size={24} color="white" />
            );
          },
        }}
      />
      <Tab.Screen
        name="Messages"
        component={Messages}
        options={{
          tabBarIcon: () => {
            return (
              <MaterialCommunityIcons name="message" size={24} color="white" />
            );
          },
          tabBarColor: "red",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: () => {
            return <AntDesign name="user" size={24} color="white" />;
          },
          tabBarColor: "#FE9A01",
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
