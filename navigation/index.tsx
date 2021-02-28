import { NavigationContainer } from "@react-navigation/native";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext.android";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";

const index: React.FC<{}> = ({}) => {
  const { user } = useContext(AuthContext);
  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default index;
