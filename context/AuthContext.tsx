import React, { useState, createContext } from "react";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";

interface UserInput {
  email: string;
  password: string;
}

interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  login: ({ email, password }: UserInput) => void;
  register: ({ email, password }: UserInput) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>();

const AuthContextProvider = ({ children }: any) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const login = async ({ email, password }: UserInput) => {
    const { user } = await auth().signInWithEmailAndPassword(email, password);
    console.log(user);
    setUser(user);
  };
  const register = async ({ email, password }: UserInput) => {
    const { user } = await auth().createUserWithEmailAndPassword(
      email,
      password
    );
    console.log(user);
    setUser(user);
  };
  const logout = async () => {
    await auth().signOut();
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
