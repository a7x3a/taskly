import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useStates } from "../Context/Context";
import useActions from "../Context/Reducer";
import { AiOutlineLogout } from "react-icons/ai";
import { IoPersonCircleOutline } from "react-icons/io5";

const Navbar = () => {
  const navigate = useNavigate();
  const { state } = useStates();
  const { logout, switch_mode } = useActions();
  const hanldeLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div
      data-theme={state.mode}
      className={`navbar bg-base-100 rounded-xl z-50 sm:px-5 sm:p-3 p-5  `}
    >
      <div className="flex-1">
        <Link
          to={"/"}
          className="btn btn-ghost sm:text-xl opacity-80 text-lg font-bold font-mono tracking-widest uppercase"
        >
          Taskly
        </Link>
      </div>
      <label
        className={`swap opacity-80 scale-90 sm:px-5 px-2 swap-rotate ${
          state.mode === "dark" ? "text-blue-200" : null
        }`}
      >
        {/* this hidden checkbox controls the state */}
        <input
          type="checkbox"
          name="theme_controller"
          className="theme-controller"
          value="synthwave"
          onClick={switch_mode}
        />

        {/* sun icon */}
        <svg
          className="swap-off fill-current w-10 h-10"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
        </svg>

        {/* moon icon */}
        <svg
          className="swap-on fill-current w-10 h-10"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
        </svg>
      </label>
      <div className="flex-none">
        <div className="dropdown dropdown-end z-50">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost  btn-circle sm:scale-105 scale-125  avatar"
          >
            <div className="sm:w-10 w-8 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.icons8.com/?size=100&id=kDoeg22e5jUY&format=png&color=000000"
              />
            </div>
          </div>
          {state.isAuthenticated ? (
            <ul
              tabIndex={0}
              className="menu border border-gray-600  menu-md  dropdown-content sm:mt-7 mt-8 mr-[-0.5rem]  z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to={"/profile"} className="justify-between">
                  {state.user && state.user.username} <IoPersonCircleOutline size={25}/>
                </Link>
              </li>
              <li>
                <a className="justify-between" onClick={hanldeLogout}>
                  logout <AiOutlineLogout size={22}/>
                </a>
              </li>
            </ul>
          ) : (
            <ul
              tabIndex={0}
              className="menu  border border-gray-600 menu-md  dropdown-content sm:mt-7 mt-8 mr-[-0.5rem]  z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to={"/login"} className="justify-between">
                  Login
                </Link>
              </li>
              <li>
                <Link to={"/signup"} className="justify-between">
                  Signup
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
