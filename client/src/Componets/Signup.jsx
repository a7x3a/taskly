import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getConfig } from "../config/config";
import useActions from "../Context/Reducer";
import { useStates } from "../Context/Context";
import axios from "axios";
import { Link } from "react-router-dom";
import { BiShow } from "react-icons/bi";
import { BiHide } from "react-icons/bi";
import Loader from "./Loader";

const Signup = () => {
  //Navigation
  const navigate = useNavigate();
  //Statemangemnts
  const { login } = useActions();
  const { state } = useStates();
  //API url getting
  const { API_URL } = getConfig();
  const url = `${API_URL}/auth/register`;
  //Refs
  const userRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const rePasswordRef = useRef();
  //UseStates
  const [error, setError] = useState(null);
  const [passwordShow, setPasswordShow] = useState(false);
  const [loader, setLoader] = useState(false);

  //Password Field Checker
  const checkThePassword = (e) => {
    //password must be between 8-* charecters and must be same with repass
    //if not then display error
    e.preventDefault();
    if (
      passwordRef.current.value === rePasswordRef.current.value &&
      passwordRef.current.value.length >= 8
    ) {
      setError(null);
      return true;
    } else if (
      passwordRef.current.value === rePasswordRef.current.value &&
      passwordRef.current.value.length < 8
    ) {
      setError("Password Must be 8 characters or above!");
      return false;
    } else {
      setError("Passwords do not match");
      return false;
    }
  };

  //Register Handling
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkThePassword(e)) {
      return;
    }

    const username = userRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const response = await axios.post(
        url,
        {
          username,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setLoader(true);
        login(response.data.user);
        setLoader(false);
        navigate("/");
      } else {
        setLoader(false);
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.msg);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.msg);
      }
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
              backgroundImage: `url(https://i.postimg.cc/6qn7wXj5/signup.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
          {/**Signup Form*/}
          <form
            data-theme={state.mode}
            onSubmit={handleSubmit}
            id="signup"
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

            <p className="mt-3 capitalize  text-xl text-center opacity-80">
              Sign up and get started!
            </p>

            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b lg:w-1/4"></span>

              <span className="text-sm  font-bold opacity-65 font-mono text-center tracking-widest uppercase  ">
                Signup
              </span>

              <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
            </div>

            <div className="mt-4">
              <label
                className="block mb-2 text-sm font-medium opacity-75"
                htmlFor="email"
              >
                Username
              </label>
              <input
                type="text"
                ref={userRef}
                required
                className="grow input w-full input-info"
                placeholder="Enter Username"
                name="username"
                autoComplete="username"
                id="username"
              />
            </div>

            <div className="mt-4">
              <label
                className="block mb-2 text-sm font-medium opacity-75"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                type="email"
                ref={emailRef}
                required
                className="grow input w-full input-info"
                placeholder="Enter your Email"
                name="email"
                autoComplete="email"
                id="email"
              />
            </div>

            <div className="mt-4">
              <div className="flex justify-between">
                <label
                  className="block mb-2 text-sm font-medium opacity-75"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <div className="flex relative">
                <input
                  ref={passwordRef}
                  type={passwordShow ? "text" : "password"}
                  required
                  placeholder="Password"
                  className="grow input input-info w-full"
                  name="password"
                  autoComplete="password"
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

            <div className="mt-4">
              <div className="flex justify-between">
                <label
                  className="block mb-2 text-sm font-medium opacity-75"
                  htmlFor="re-Password"
                >
                  Confirm Password
                </label>
              </div>

              <div className="flex relative">
                <input
                  ref={rePasswordRef}
                  type={passwordShow ? "text" : "password"}
                  required
                  placeholder="Password"
                  className="grow input input-info w-full"
                  name="re-password"
                  autoComplete="re-password"
                  id="re-password"
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
                formTarget="signup"
                className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
              >
                Signup
              </button>
            </div>
            <p className="text-sm mt-2">{error}</p>

            <div className="flex items-center justify-between mt-4">
              <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
              <p className="text-sm flex flex-col gap-3 text-center">
                Already have an account? 
                <Link
                  to={"/login"}
                  className="text-sm cursor-pointer text-gray-500 uppercase dark:text-gray-400 hover:underline"
                >
                  Login
                </Link>
              </p>
              <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default Signup;
