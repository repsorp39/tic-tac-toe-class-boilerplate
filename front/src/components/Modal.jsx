import { X } from "lucide-react";
import React from "react";
import { useRef } from "react";
import { useEffect } from "react";

const Modal = ({
  children,
  onClose = () => {},
  isOpen,
  showCloseButton = true,
  className = "",
}) => {
  const ref = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    }

    window.addEventListener("click", handleClickOutside, true);
    () => window.removeEventListener("click", handleClickOutside, true);
  }, []);

  return (
    isOpen && (
      <div
        className={`fixed top-0 right-0  w-[calc(100vw-256px)] h-screen bg-black/30 backdrop-blur-[2px] flex items-center justify-center ${className}`}
      >
        <div ref={ref}> {children} </div>
        {showCloseButton && (
          <span
            onClick={onClose}
            className="absolute top-0 right-0 m-5 text-red-500 bg-red-500/30 rounded-full p-1 hover:bg-red-500/50 cursor-pointer"
          >
            <X size={20} />{" "}
          </span>
        )}
      </div>
    )
  );
};

export default Modal;
