import React from "react";
import { useStates } from "../Context/Context";
import {  MdEmail } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { CiAt } from "react-icons/ci";


function Footer() {
  const { state } = useStates();
  return (
    <div
      data-theme={state.mode}
      className="w-full h-[70px] flex gap-5 justify-between px-7 items-center mt-3  rounded-xl text-center"
    >
      <div className="flex justify-center items-center gap-1 font-mono font-bold  opacity-70">
        <MdEmail size={25} />

        <a
          href="mailto:taskly.dev@outlook.com"
          className="text-sm hover:opacity-50  transition duration-300 font-light tracking-wide"
        >
          taskly.dev@outlook.com
        </a>
      </div>
      <div className="flex justify-center items-center gap-3 opacity-70 font-mono font-bold ">
        <a
          className="hover:opacity-50 transition duration-300"
          href="https://a7x3a.github.io/"
          target="_blank"
        >
          <CiAt size={25} />
        </a>
        <a
          className="hover:opacity-50  transition duration-300"
          href="https://github.com/a7x3a"
          target="_blank"
        >
          <FaGithub size={25} />
        </a>
      </div>
    </div>
  );
}

export default Footer;
