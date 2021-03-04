import React, { useState, createContext } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-community/google-signin";
import { LoginManager, AccessToken } from "react-native-fbsdk";
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
}

export const AuthContext = createContext<AuthContextType>();

const AuthContextProvider = ({ children }: any) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const login = async ({ email, password }: UserInput) => {
    const { user } = await auth().signInWithEmailAndPassword(email, password);
    setUser(user);
  };
  const register = async ({ email, password }: UserInput) => {
    const { user } = await auth().createUserWithEmailAndPassword(
      email,
      password
    );
    setUser(user);
  };
  const logout = async () => {
    await auth().signOut();
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
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        facebookLogin,
        googleLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
