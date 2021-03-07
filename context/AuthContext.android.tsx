import React, { useState, createContext } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-community/google-signin";
import { LoginManager, AccessToken } from "react-native-fbsdk";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

interface UserInput {
  email: string;
  password: string;
}

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  login: ({ email, password }: UserInput) => void;
  register: ({ email, password }: UserInput) => void;
  logout: () => void;
  googleLogin: () => void;
  facebookLogin: () => void;
  setUser: React.Dispatch<React.SetStateAction<FirebaseAuthTypes.User | null>>;
}

export const AuthContext = createContext<AuthContextType>();

const AuthContextProvider = ({ children }: any) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const login = async ({ email, password }: UserInput) => {
    const { user } = await auth().signInWithEmailAndPassword(email, password);
    const data = await user.getIdToken();
    try {
      await AsyncStorage.setItem("token", data);
    } catch (err) {
      console.log(err);
    }
    try {
      const jsonValue = JSON.stringify(user);
      await AsyncStorage.setItem("user", jsonValue);
    } catch (err) {
      console.log(err, " unable to set user object");
    }
    setUser(user);
  };
  const register = async ({ email, password }: UserInput) => {
    const { user } = await auth().createUserWithEmailAndPassword(
      email,
      password
    );
    const data = await user.getIdToken();
    try {
      await AsyncStorage.setItem("token", data);
    } catch (err) {
      console.log(err);
    }
    try {
      const jsonValue = JSON.stringify(user);
      await AsyncStorage.setItem("user", jsonValue);
    } catch (err) {
      console.log(err, " unable to set user object");
    }
    try {
      await firestore()
        .collection("users")
        .doc(user.uid)
        .set({
          fName: "",
          lName: "",
          phone: "",
          email: email,
          createdAt: firestore.Timestamp.fromDate(new Date()),
          userImg:
            "https://www.clearmountainbank.com/wp-content/uploads/2020/04/male-placeholder-image.jpeg",
          profileData: {
            posts: 0,
            followers: [],
            following: [],
            bio: "Here goes the bio",
          },
        });
      setUser(user);
    } catch (err) {
      console.log(err);
    }
  };
  const googleLogin = async () => {
    try {
      const { idToken } = await GoogleSignin.signIn();
      console.log(idToken);
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const { user } = await auth().signInWithCredential(googleCredential);
      console.log(user);
      setUser(user);
    } catch (err) {
      console.log(err);
    }
  };
  const facebookLogin = async () => {
    const result = await LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]);

    if (result.isCancelled) {
      throw "User cancelled the login process";
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw "Something went wrong obtaining access token";
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken
    );

    // Sign-in the user with the credential
    const { user } = await auth().signInWithCredential(facebookCredential);
    setUser(user);
  };
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "user"]);
      await auth().signOut();
      setUser(null);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        facebookLogin,
        googleLogin,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
