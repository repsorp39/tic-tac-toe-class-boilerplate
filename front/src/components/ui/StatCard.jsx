import React from "react";
import peopleCheck from "/people-check.png";
import people from "/people.png";
import peopleCross from "/people-cross.png";
import { Loader } from "lucide-react";
import { Eye } from "lucide-react";

const StatCard = ({ count, description, icon, isLoading, onClick }) => {
  const icons = {
    played: people,
    win: peopleCheck,
    lost: peopleCross,
  };

  return (
    <li
      onClick={onClick}
      className="shadow-xl bg-white border-2 border-gray-200 rounded-2xl w-80 h-32 flex items-center p-4 hover:shadow-2xs transition-all cursor-pointer mt-5"
    >
      <div className="m-2">
        {" "}
        <img className="w-10" src={icons[icon]} />{" "}
      </div>
      <div>
        {isLoading ? (
          <Loader className="animate-spin" />
        ) : (
          <span className="font-bold font-avenir-medium text-4xl ">
            {" "}
            {count}{" "}
          </span>
        )}
        <p className="font-avenir-medium font-bold text-gray-400">
          {" "}
          {description}{" "}
        </p>
        <button className="flex items-center gap-x-2 text-sm font-bold text-red-500">
          Voir <Eye size={15} className="text-[8px]" />
        </button>
      </div>
    </li>
  );
};

export default StatCard;
