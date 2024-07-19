import { useEffect } from "react";
import axios from "axios";
import { useStates } from "../Context/Context";
import useActions from "../Context/Reducer";
import { getConfig } from "../config/config";

const TokenCheck = () => {
  const { state } = useStates();
  const { login, loader } = useActions();
  const { API_URL } = getConfig();
  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/check-token`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          login(response.data.user);
        }
      } catch (error) {
        loader();
      }
    };

    if (!state.isAuthenticated) {
      checkToken();
    }
  }, []);

  return null; 
};

export default TokenCheck;
