import { useStates } from "../Context/Context";
import { useRef, useState } from "react";
import axios from "axios";
import { getConfig } from "../config/config";
import { BsFillPersonLinesFill } from "react-icons/bs";

const Profile = () => {
  const { state } = useStates();
  const [inputMode, setInputMode] = useState(false);
  const [passwordChange, setPasswordChange] = useState(false);
  const usernameRef = useRef();
  const emailRef = useRef();
  const PasswordRef = useRef();
  const newPasswordRef = useRef();
  const repeatPasswordRef = useRef();
  const { API_URL } = getConfig();
  const [error, setError] = useState(null);
  const isMath = () => {
    const newPasswordValue = newPasswordRef.current.value;
    const repeatPasswordValue = repeatPasswordRef.current.value;
    return (
      newPasswordValue &&
      repeatPasswordValue &&
      newPasswordValue === repeatPasswordValue
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const username = usernameRef.current.value;
      const email = emailRef.current.value;
      const password = PasswordRef.current.value;
      const newPassword = newPasswordRef.current
        ? newPasswordRef.current.value
        : null;
      if (newPassword && !isMath()) {
        setError("Passwords do not match");
        return;
      }
      if(newPassword && newPassword.length < 8){
        setError("Password Must be 8 characters or above!");
        return;
      }

      if(newPassword && newPassword===password){
        setError("Please use another password")
        return
      }
      const requestBody = {
        username,
        email,
        password,
        ...(passwordChange && newPassword ? { newPassword } : {}),
      };

      const response = await axios.put(`${API_URL}/user/change`, requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Include credentials such as cookies
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setError(response.data.msg);
        setInputMode(false);
        setPasswordChange(false);
      }
    } catch (error) {
      setError(
        error.response?.data?.error ||
          "An error occurred while updating the profile"
      );
    }
  };

  return state.isAuthenticated ? (
    <div
      data-theme={state.mode}
      className="w-full max-h-full gap-3 rounded-xl flex flex-col items-center  p-3 font-mono  text-lg mt-3"
    >
      <div className={`text-lg flex items-center justify-between cursor-context-menu w-full font-extrabold p-4  text-white ${state.mode === "dark" ? "bg-slate-700" : "bg-gray-500"} rounded-lg`}>
        Account Setting <BsFillPersonLinesFill size={25} />
      </div>

      <form
        name="profile"
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-3"
      >
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
          </svg>
          <input
            ref={usernameRef}
            type="text"
            defaultValue={state.user.username}
            className="grow "
            placeholder="Username"
            disabled={!inputMode}
            required
            name="username"
            autoComplete="username"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            ref={emailRef}
            type="email"
            defaultValue={state.user.email}
            disabled={!inputMode}
            className="grow "
            placeholder="Email"
            required
            name="email"
            autoComplete="email"
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            ref={PasswordRef}
            type="password"
            disabled={!inputMode}
            className={`grow placeholder:opacity-45`}
            placeholder="current password"
            required
            name="password"
            autoComplete="current-password"
          />
        </label>
        {passwordChange && inputMode ? (
          <>
            <label className="input input-bordered flex items-center gap-2 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                ref={newPasswordRef}
                type="password"
                disabled={!inputMode}
                className={`grow placeholder:opacity-45`}
                placeholder="new password"
                required
                name="new-password"
                autoComplete="new-password"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                ref={repeatPasswordRef}
                type="password"
                disabled={!inputMode}
                className={`grow placeholder:opacity-45`}
                placeholder="repeat password"
                required
                name="repeat-password"
                autoComplete="new-password"
              />
            </label>
          </>
        ) : null}
        <p className="text-gray-400">{error}</p>
        <button
          type="button"
          onClick={() => {
            setInputMode((prev) => !prev);
          }}
          className="btn"
        >
          {!inputMode ? "Change Settings" : "Cancel"}
        </button>
        {inputMode ? (
          <button
            type="button"
            onClick={() => {
              setPasswordChange((prev) => !prev);
            }}
            className="btn"
          >
            {!passwordChange ? "Change Password" : "Cancel"}
          </button>
        ) : null}

        <input disabled={!inputMode} type="submit" value="Save Changes" className="btn" />
      </form>
    </div>
  ) : null;
};

export default Profile;
