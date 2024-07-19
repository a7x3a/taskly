import React from "react";
import { Navigate } from "react-router-dom";
import { useStates } from "../Context/Context";

const ProtectedRoute = ({ element: Component, ...rest }) => {
  const { state } = useStates();
  return state.isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
