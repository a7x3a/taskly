import React, { createContext, useReducer, useContext } from "react";

const Context = createContext();

const Reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isFetching: false,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isFetching: false,
      };
    case "LOADER":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isFetching: false,
      };
    case "THEME":
      const newMode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem("themeMode", newMode); // Save theme mode to localStorage
      return {
        ...state,
        mode: newMode,
      };

    default:
      return state;
  }
};
const getInitialThemeMode = () => {
  const savedMode = localStorage.getItem("themeMode");
  return savedMode || "light"; // Default to light theme if no mode is saved
};

const initialState = {
  isAuthenticated: false,
  user: null,
  isFetching: true,
  mode: getInitialThemeMode(),
};

export const Provider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);

  return (
    <Context.Provider value={{ state, dispatch }}>
      {children}
    </Context.Provider>
  );
};

export const useStates = () => {
  return useContext(Context);
};
