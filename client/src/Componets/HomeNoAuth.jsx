import React from 'react'
import { useStates } from '../Context/Context'
import { Link } from 'react-router-dom';
function HomeNoAuth() {
    const {state} = useStates()
  return (
    <div
      data-theme={state.mode}
      className="max-w-full mt-3 h-fit rounded-lg flex xl:flex-row   flex-col-reverse tracking-widest font-mono overflow-hidden justify-center p-10"
    >
      <div className="flex flex-col min-h-full justify-center gap-10 text-center p-10">
        <div className="text-xl   md:text-5xl  xl:text-start  font-extrabold ">
          Stay On Top,
          Fuel Your Creativity
        </div>
        <div className="font-medium sm:text-lg text-sm  ">
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
      <div className='w-full grid place-content-center '>
      <img
        className="w-full  opacity-85    rounded-lg"
        src="https://d107mjio2rjf74.cloudfront.net/sites/res/home/common/header.png"
        alt=""
      /></div>
    </div>
  );
}

export default HomeNoAuth
