import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
//Componets
import Home from "./Componets/Home";
import Login from "./Componets/Login";
import Navbar from "./Componets/Navbar";
import Signup from "./Componets/Signup";
import Profile from "./Componets/Profile";
import Footer from "./Componets/Footer";
import Loader from "./Componets/Loader";
//Route Checkings
import ProtectedRoute from "./Checks/ProtectedRoute";
import RollinRoute from "./Checks/RollinRoute";
import TokenCheck from "./Checks/TokenCheck";
import HomeRoute from "./Checks/HomeRoute";
//Contexts
import { useStates } from "./Context/Context";


const App = () => {
  const { state } = useStates();
  return (
    <div
      className={`${
        state.mode === "dark" ? "bg-slate-600" : "bg-zinc-700"
      } min-h-[100dvh] overflow-hidden`}
    >
      <div className={`max-w-full  h-full sm:min-h-[100dvh] p-5`}>
        <BrowserRouter>
          <TokenCheck />
          {state.isFetching ? (
            <Loader />
          ) : (
            <>
              <Navbar />
              <Routes>
                <Route
                  path="/profile"
                  element={<ProtectedRoute element={Profile} />}
                />
                <Route
                  path="/login"
                  element={<RollinRoute element={Login} />}
                />
                <Route
                  path="/signup"
                  element={<RollinRoute element={Signup} />}
                />

                <Route path="/" element={<HomeRoute element={Home}/>} />
              </Routes>
              <Footer />
            </>
          )}
        </BrowserRouter>
      </div>
    </div>
  );
};

export default App;
