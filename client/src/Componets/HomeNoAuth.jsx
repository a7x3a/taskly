import React from 'react'
import { useStates } from '../Context/Context'
import { Link } from 'react-router-dom';
function HomeNoAuth() {
    const {state} = useStates()
  return (
    <div
      data-theme={state.mode}
      className="max-w-full mt-3 h-fit rounded-lg flex sm:flex-row  flex-col-reverse tracking-widest font-mono overflow-hidden justify-center p-10"
    >
      <div className="flex flex-col min-h-full justify-center gap-10 text-center p-10">
        <div className="text-4xl  sm:text-5xl  sm:text-start  font-extrabold ">
          Stay On Top,
          Fuel Your Creativity
        </div>
        <div className="font-medium text-lg ">
          Simplify task management, capture inspiration, and ignite creativity
          daily.
        </div>
        <div className="flex justify-center flex-col gap-3">
          <Link to={"/signup"} className="btn btn-outline">
            Get Started!
          </Link>
          <Link to={"/login"} className="btn btn-outline">
            Login
          </Link>
        </div>
      </div>
      <img
        className="sm:w-1/2 border-gray-400 opacity-85 sm:border-l-2 sm:border-t-4 sm:border-b sm:border-r p-5  rounded-lg"
        src="https://d107mjio2rjf74.cloudfront.net/sites/res/home/common/header.png"
        alt=""
      />
    </div>
  );
}

export default HomeNoAuth
