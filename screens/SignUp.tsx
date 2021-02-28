import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FormButton from "../components/FormButton";
import FormInput from "../components/FormInput";
import SocialButton from "../components/SocialButton";
import { AuthContext } from "../context/AuthContext.android";
import { RootStackParamList } from "../types";

type SignUpScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SignUp"
>;
type SignUpScreenRouteProp = RouteProp<RootStackParamList, "SignUp">;
type Props = {
  navigation?: SignUpScreenNavigationProp;
  route?: SignUpScreenRouteProp;
};

interface SignUpProps {
  email: string;
  password: string;
  password2: string;
}

const SignUp: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const { register } = useContext(AuthContext);
  const registerAsync = ({ email, password, password2 }: SignUpProps) => {
    if (password !== password2) {
      return;
    }
    register({ email, password });
  };
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.heading}>Create Account</Text>
      </View>
      <View style={{ marginVertical: 10 }}>
        <FormInput
          iconName="user"
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholderTextColor="black"
          placeholder="Email"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <FormInput
          iconName="lock"
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholderTextColor="black"
          placeholder="Password"
          secureTextEntry
        />
        <FormInput
          iconName="lock"
          value={password2}
          onChangeText={(text) => setPassword2(text)}
          placeholderTextColor="black"
          placeholder="Confirm Password"
          secureTextEntry
        />
      </View>
      <FormButton
        text="Sign Up"
        color="#1197F6"
        onPress={() => registerAsync(email, password, password2)}
      />
      <View style={{ marginVertical: 20 }}>
        <Text style={{ fontWeight: "800" }}>
          By registering you agree to the terms and sevices
        </Text>
      </View>
      <SocialButton
        text="Sign In with Facebook"
        color="#c0d9ea"
        textColor="#1969ea"
        iconColor="#1969ea"
        iconName="facebook"
      />
      <SocialButton
        text="Sign In with Google"
        color="#f9acb5"
        textColor="#ef3e53"
        iconColor="#ef3e53"
        iconName="google"
      />
      <TouchableOpacity onPress={() => navigation?.navigate("SignUp")}>
        <Text style={styles.text}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#1197f6",
    fontWeight: "bold",
  },
  heading: {
    fontSize: 25,
    fontWeight: "bold",
  },
});
