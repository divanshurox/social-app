import React from "react";
import AuthContextProvider from "./context/AuthContext.android";
import NavigationProvider from "./navigation";
import { GoogleSignin } from "@react-native-community/google-signin";

GoogleSignin.configure({
  webClientId:
    "1020075048858-ft2pciskoiohnkkn68tcp6r0ahdj7jmf.apps.googleusercontent.com",
});

export default function App() {
  return (
    <AuthContextProvider>
      <NavigationProvider />
    </AuthContextProvider>
  );
}
