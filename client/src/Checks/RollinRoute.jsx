import React from "react";
import { Navigate } from "react-router-dom";
import { useStates } from "../Context/Context";

const RollinRoute = ({ element: Component, ...rest }) => {
  const { state } = useStates();
  return !state.isAuthenticated ? <Component {...rest} /> : <Navigate to="/" />;
};

export default RollinRoute;
