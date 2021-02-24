import React from "react";
import AuthContextProvider from "./context/AuthContext";
import NavigationProvider from "./navigation";

export default function App() {
  return (
    <AuthContextProvider>
      <NavigationProvider />
    </AuthContextProvider>
  );
}
