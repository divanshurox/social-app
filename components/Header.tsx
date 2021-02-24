import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  navigation: StackNavigationProp<Record<string, object | undefined>, string>;
}

const Header = ({ navigation }: Props) => {
  return (
    <View style={[styles.header, styles.row]}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  header: {
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
