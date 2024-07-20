import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import axios from "axios";
import "ldrs/ring2";
import { BiShow } from "react-icons/bi";
import { BiHide } from "react-icons/bi";
import Loader from "./Loader";
import useActions from "../Context/Reducer";
import { useStates } from "../Context/Context";
import { getConfig } from "../config/config";

const Login = () => {
  //Statemangemnts
  const { state } = useStates();
  const { login } = useActions();
  //Navigation
  const navigate = useNavigate();
  //API url getting
  const { API_URL } = getConfig();
  const url = `${API_URL}/auth/login`;
  const generate_otp_url = `${API_URL}/auth/generate-otp`;
  const verify_otp_url = `${API_URL}/auth/verify-otp`;
  //UseStates
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState();
  const [forgetMode, setForgetMode] = useState(false);
  const [sendButton, setSendButton] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [forgetLoader, setForgetLoader] = useState(false);
  //Refs
  const emailRef = useRef();
  const passwordRef = useRef();
  const otpRef = useRef();
  const newPasswordRef = useRef();
  const forgetEmailRef = useRef();

  //Genreta and send OTP
  const handleGenerateOTP = async () => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = forgetEmailRef.current?.value;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address!");
      return;
    }
    try {
      setForgetLoader(true);
      const response = await axios.post(
        generate_otp_url,
        {
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include credentials such as cookies
        }
      );
      setSendButton(true);
      setError(response.data.msg);
      setForgetLoader(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("Email not found. Please check your email address.");
      } else {
        setError("Something went wrong!");
      }
      setForgetLoader(false);
    }
  };

  //Submit for Forget Password
  const handleForget = async (e) => {
    e.preventDefault()
    setError(null);
    const email = forgetEmailRef.current?.value;
    const newPassword = newPasswordRef.current?.value;
    const otp = otpRef.current?.value;
    if (!(email && newPassword && otp)) {
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be 8 charecters or above!");
      return;
    }
    try {
      setLoader(true);
      const response = await axios.put(
        verify_otp_url,
        {
            email,
            newPassword,
            otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include credentials such as cookies
        }
      );
        //retrive data from backend and login after 2s;
        setError("Password Rest!")
        login(response.data.user);
        setLoader(false);
        navigate("/");
    } catch (error) {
      console.error("Login error:");
      setError(" Invalid email or password! "); // Display error message
      setLoader(false);
    }
  };
  //Submit for regular Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    try {
      setLoader(true);
      const response = await axios.post(
        url,
        {
            email,
            password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include credentials such as cookies
        }
      );
      //retrive data from backend;
      login(response.data.user);
      setLoader(false);
      navigate("/");
      // Handle success (e.g., redirect to another page or set logged-in state)
    } catch (error) {
      console.error("Login error:");
      setError(" Invalid email or password! "); // Display error message
      setLoader(false);
    }
  };



  return loader ? (
    <Loader />
  ) : (
    !state.isAuthenticated && (
      <div data-theme={state.mode} className="my-3 bg-transparent">
        <div className="flex min-w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-4xl">
          {/**Blank Div for left Image */}
          <div
            className="hidden bg-cover lg:block lg:w-1/2"
            style={{
              backgroundImage: `url(https://i.postimg.cc/FzDdSqHC/login.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          {forgetMode ? (
            //Form While Forget Mode
            <form
              data-theme={state.mode}
              id="forget"
              onSubmit={handleForget}
              className={`w-full !font-mono tracking-wide px-6 py-8 md:px-8 lg:w-1/2 ${
                state.mode === "dark" ? "bg-base-100" : "bg-white !text-black  "
              } `}
            >
              <div className="flex justify-center mx-auto">
                <img
                  className="w-auto  size-10"
                  src="https://img.icons8.com/?size=100&id=i3qtV6CSwDu3&format=png&color=000000"
                  alt=""
                />
              </div>

              <p className="mt-3 text-xl text-center opacity-80">
                Welcome back!
              </p>

              <div className="flex items-center justify-between mt-4">
                <span className="w-1/5 border-b lg:w-1/4"></span>

                <span className="text-sm  font-bold opacity-65 font-mono text-center tracking-widest uppercase  ">
                  Login
                </span>

                <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
              </div>

              <div className="mt-4">
                <label
                  className="block mb-2 text-sm font-medium opacity-75"
                  htmlFor="LoggingEmailAddress"
                >
                  Email Address
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    ref={forgetEmailRef}
                    required
                    className="grow  input w-full input-info"
                    placeholder="Email"
                    name="forget-email"
                    autoComplete="forget-email"
                    id="forget-email"
                  />
                  <a
                    onClick={() => {
                      handleGenerateOTP();
                    }}
                    className="btn"
                  >
                    {forgetLoader ? (
                      <l-ring-2
                        size="20"
                        stroke="5"
                        stroke-length="0.25"
                        bg-opacity="0.1"
                        speed="0.8"
                        color="gray"
                      ></l-ring-2>
                    ) : (
                      "Send"
                    )}
                  </a>
                </div>
              </div>
              <p className="text-sm mt-2 text-gray-500">{error}</p>
              <div className="mt-4">
                <div className="flex justify-between">
                  <label
                    className="block mb-2 text-sm font-medium opacity-75"
                    htmlFor="OTP"
                  >
                    Code
                  </label>
                  <a
                    onClick={() => {
                      setForgetMode((prev) => !prev);
                      setError(null);
                    }}
                    className="text-xs cursor-pointer opacity-65 hover:underline"
                  >
                    Back to Login
                  </a>
                </div>

                <input
                  maxLength={5}
                  ref={otpRef}
                  required
                  disabled={!sendButton}
                  placeholder="OTP"
                  className="grow input input-info w-full"
                  name="OTP"
                  autoComplete="OTP"
                  id="OTP"
                  pattern="[0-9]+"
                  inputMode="numeric"
                />
              </div>
              {sendButton && (
                <div className="mt-4">
                  <div className="flex justify-between">
                    <label
                      className="block mb-2 text-sm font-medium opacity-75"
                      htmlFor="new-password"
                    >
                      New Password
                    </label>
                  </div>

                  <div className="flex w-full relative">
                    <input
                      type={passwordShow ? "text" : "password"}
                      ref={newPasswordRef}
                      required
                      disabled={!sendButton}
                      placeholder="Password"
                      className="grow input input-info w-full"
                      name="new-password"
                      autoComplete="new-password"
                      id="new-password"
                    />
                    <a
                      onClick={() => {
                        setPasswordShow((prev) => !prev);
                      }}
                      className="btn  btn-ghost absolute right-0"
                    >
                      {passwordShow ? (
                        <BiHide size={17} />
                      ) : (
                        <BiShow size={17} />
                      )}
                    </a>
                  </div>
                </div>
              )}
              <div className="mt-6">
                <button
                  type="submit"
                  formTarget="forget"
                  className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                >
                  Sign In
                </button>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>

                <Link
                  to={"/signup"}
                  className=" text-sm text-gray-500 uppercase dark:text-gray-400 hover:underline"
                >
                  or sign up
                </Link>

                <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
              </div>
            </form>
          ) : (
            //Form While Not Forget Mode
            <form
              data-theme={state.mode}
              onSubmit={handleSubmit}
              id="login"
              className={`w-full !font-mono tracking-wide px-6 py-8 md:px-8 lg:w-1/2 ${
                state.mode === "dark" ? "bg-base-100" : "bg-white !text-black  "
              } `}
            >
              <div className="flex justify-center mx-auto">
                <img
                  className="w-auto  size-10"
                  src="https://img.icons8.com/?size=100&id=i3qtV6CSwDu3&format=png&color=000000"
                  alt=""
                />
              </div>

              <p className="mt-3 text-xl text-center opacity-80">
                Welcome back!
              </p>

              <div className="flex items-center justify-between mt-4">
                <span className="w-1/5 border-b lg:w-1/4"></span>

                <span className="text-sm  font-bold opacity-65 font-mono text-center tracking-widest uppercase  ">
                  Login
                </span>

                <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
              </div>

              <div className="mt-4">
                <label
                  className="block mb-2 text-sm font-medium opacity-75"
                  htmlFor="LoggingEmailAddress"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  ref={emailRef}
                  required
                  className="grow input w-full input-info"
                  placeholder="Email"
                  name="email"
                  autoComplete="email"
                  id="email"
                />
              </div>

              <div className="mt-4">
                <div className="flex justify-between">
                  <label
                    className="block mb-2 text-sm font-medium opacity-75"
                    htmlFor="loggingPassword"
                  >
                    Password
                  </label>
                  <a
                    onClick={() => {
                      setForgetMode((prev) => !prev);
                    }}
                    className="text-xs cursor-pointer opacity-65 hover:underline"
                  >
                    Forget Password?
                  </a>
                </div>
                <div className="flex relative">
                  <input
                    ref={passwordRef}
                    type={passwordShow ? "text" : "password"}
                    required
                    placeholder="Password"
                    className="grow input input-info w-full"
                    name="password"
                    autoComplete="current-password"
                    id="password"
                  />
                  <a
                    onClick={() => {
                      setPasswordShow((prev) => !prev);
                    }}
                    className="btn  btn-ghost absolute right-0"
                  >
                    {passwordShow ? <BiHide size={17} /> : <BiShow size={17} />}
                  </a>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  formTarget="login"
                  className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                >
                  Sign In
                </button>
              </div>
              <p className="text-sm mt-2">{error}</p>

              <div className="flex items-center justify-between mt-4">
                <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>

                <Link
                  to={"/signup"}
                  className="text-sm cursor-pointer text-gray-500 uppercase dark:text-gray-400 hover:underline"
                >
                  or sign up
                </Link>

                <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
              </div>
            </form>
          )}
        </div>
      </div>
    )
  );
};

export default Login;
