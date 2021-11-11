import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useContext } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { AuthContext } from "../context/AuthContext.android";
import { RootStackParamList } from "../types";

type AutoAuthScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "AutoAuth"
>;
type AutoAuthScreenRouteProp = RouteProp<RootStackParamList, "AutoAuth">;
interface Props {
  navigation: AutoAuthScreenNavigationProp;
  route: AutoAuthScreenRouteProp;
}

const AutoAuth = ({ navigation }: Props) => {
  const { setUser } = useContext(AuthContext);
  const getUserData = async () => {
    try {
      const value = await AsyncStorage.getItem("user");
      if (value !== null) {
        return JSON.parse(value);
      }
      return null;
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    (async () => {
      try {
        const value = await AsyncStorage.getItem("token");
        if (value !== null || value !== undefined) {
          const userData = await getUserData();
          if (userData) {
            setUser(userData);
          } else {
            navigation.navigate("Login");
          }
        }
      } catch (err) {
        console.log("error fetching user token");
      }
    })();
  }, []);
  return (
    <View style={styles.container}>
      <ActivityIndicator color="dodgerblue" size="large" />
    </View>
  );
};

export default AutoAuth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
