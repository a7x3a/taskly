import React from "react";
import { useStates } from "../Context/Context";
import HomeNoAuth from "../Componets/HomeNoAuth";
const HomeRoute = ({ element: Component, ...rest }) => {
  const { state } = useStates();
  return state.isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <HomeNoAuth {...rest}/>
  );
};

export default HomeRoute;
