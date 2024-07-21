import React from "react";
import { waveform } from 'ldrs'
waveform.register()
function Loader() {
  return (
    <div className="w-full min-h-[100dvh] flex justify-center items-center">
      <l-waveform
  size="100"
  stroke="3.5"
  speed="1" 
  color="gray" 
></l-waveform> 
    </div>
  );
}

export default Loader;
