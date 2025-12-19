import React from "react";
import XIcon from "/X.png";
import OIcon from "/O.png";

const Board = ({ bordElement, onCellClick, winningCombo }) => {
  const icons = {
    X: XIcon,
    O: OIcon,
  };

  return (
    <section className="mx-auto max-w-3xl flex items-center justify-center place-content-center">
      <div className="grid grid-cols-[190px_190px_190px]">
        {Object.keys(bordElement)
          .sort()
          .map((cellKey, i) => {
            return (
              <div
                key={cellKey}
                onClick={() => onCellClick(cellKey)}
                className={`h-36 border  flex items-center justify-center border-gray-300  transition-colors cursor-pointer ${
                  winningCombo.includes(cellKey) ? "clignotant" : "hover:bg-red-50"
                }`}
              >
                {bordElement[cellKey] && (
                  <img
                    className="w-16 h-16  block"
                    src={icons[bordElement[cellKey]]}
                  />
                )}
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default Board;
