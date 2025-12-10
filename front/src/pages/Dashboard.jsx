import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import StatCard from "../components/ui/StatCard";
import PlayerList from "../components/ui/PlayerList";
import { useRef } from "react";
import useFetch from "../hooks/useFetch";
import Modal from "../components/Modal";

const Dashboard = () => {
  const [currentSelection, setCurrentSelection] = useState("");
  const { data:stats, isLoading} = useFetch("/stats");

  const ref = useRef();

  const statsInfo = [
    { name: "played", description: "Jeux joués", icon: "played" },
    {
      name: "lost",
      description: "Jeux perdus",
      icon: "lost",
    },
    {
      name: "win",
      description: "Jeux gagnés",
      icon: "win",
    },
  ];


  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setCurrentSelection("");
      }
    }

    window.addEventListener("click", handleClickOutside, true);
    () => window.removeEventListener("click", handleClickOutside, true);
  }, []);

  return (
    <div>
        <ul className="flex justify-around flex-wrap">
          {statsInfo.map((element) => (
            <StatCard
              key={element.name}
              icon={element.icon}
              isLoading={isLoading}
              description={element.description}
              count={stats[element.name]}
              onClick={() => setCurrentSelection(element.name)}
            />
          ))}
        </ul>
          <Modal isOpen={currentSelection} onClose={() => setCurrentSelection("")} >
              <div>
              <PlayerList
                name={currentSelection}
                tableTitle={
                  currentSelection === "played"
                    ? "Liste des jeux"
                    : currentSelection === "win"
                    ? "Liste des victoires"
                    : "Liste des matches perdus"
                }
              />
            </div>
          </Modal>
          </div>
  );
};

export default Dashboard;
