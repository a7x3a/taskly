import React from "react";
import "ldrs/jelly";

// Default values shown

function Loader() {
  return (
    <div className="w-full min-h-[100dvh] flex justify-center items-center">
      <l-jelly size="100" speed="0.9" color="white"></l-jelly>  
    </div>
  );
}

export default Loader;
