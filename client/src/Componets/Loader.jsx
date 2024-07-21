import React from "react";
import { jelly } from 'ldrs'
jelly.register()

function Loader() {
  return (
    <div className="w-full min-h-[100dvh] flex justify-center items-center">
     <l-jelly
  size="80"
  speed="0.9" 
  color="gray" 
></l-jelly>
    </div>
  );
}

export default Loader;
