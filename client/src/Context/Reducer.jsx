import { useStates } from "./Context";
import axios from "axios";
import { getConfig } from "../config/config";

const useActions = () => {
  const { dispatch } = useStates();
  const { API_URL } = getConfig();
  const login = (userData) => {
    dispatch({ type: "LOGIN", payload: userData });
  };

  const loader = () => {
    dispatch({ type: "LOADER" });
  };

  const switch_mode = () => {
    dispatch({ type: "THEME" });
  };


   const logout = async (e) => {
    const url = `${API_URL}/auth/logout`;
    try {
      const response = await axios.post(
        url,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include credentials such as cookies
        }
      );
      console.log(response.status);
    } catch (e) {
      console.log(e);
    }
    dispatch({ type: "LOGOUT" });
  };

  return { login, logout, loader, switch_mode };
};

export default useActions;
