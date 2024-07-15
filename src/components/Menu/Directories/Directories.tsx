import React, { useState } from "react";
import Arrow from "../../../assets/arrow.svg?react";
import ContentDirectories from "./ContentDirectories";

const Directories: React.FC<{ classActive: string }> = ({ classActive }) => {
  const [isDirectoriesOpen, setIsDirectoriesOpen] = useState<boolean>(false);

  const toggleDirectoriesOpen = () => {
    setIsDirectoriesOpen((prevState) => !prevState);
  };

  return (
    <div className="py-4">
      <button
        className={`flex items-center w-full mx-4 mb-2 ${
          isDirectoriesOpen ? "dark:text-slate-200" : ""
        }`}
        onClick={toggleDirectoriesOpen}
      >
        <Arrow
          className={`w-3 h-3 mr-2 rotate-90 transition ${
            isDirectoriesOpen ? "rotate-180" : ""
          }`}
        />
        Folders
      </button>
      <div className={isDirectoriesOpen ? "visible" : "hidden"}>
        <ContentDirectories classActive={classActive} />
      </div>
    </div>
  );
};

export default Directories;
