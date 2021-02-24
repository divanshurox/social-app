import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  TouchableOpacityProps,
} from "react-native";

const { width } = Dimensions.get("window");

type Props = TouchableOpacityProps & {
  text: string;
  color: string;
};

const FormButton = ({ text, color, ...props }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: color }]}
      {...props}
    >
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export default FormButton;

const styles = StyleSheet.create({
  container: {
    width: width - 40,
    borderRadius: 10,
    padding: 17,
  },
  text: {
    textAlign: "center",
    color: "white",
    fontWeight: "700",
  },
});
