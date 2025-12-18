import React, { useState, useEffect } from "react";
import useSocket from "../hooks/useSocket";
import useAuthContext from "../context/auth";
import Modal from "./Modal";
import BrandName from "./ui/BrandName";
import { Loader2 } from "lucide-react";
import { useGameContext } from "../context/game";
import { useNavigate } from "react-router";

const SocketManager = () => {
  const socketIo = useSocket();
  const { user } = useAuthContext();
  const { setPlayers, setSettings } = useGameContext();
  const navigate = useNavigate();

  const [isNewGameRequest, setNewGameRequest] = useState(false);
  const [requester, setRequester] = useState("");

  const [isPreparingGame, setIsPreparingGame] = useState(false);

  //when another user request a party with the currently logged in user
  useEffect(() => {
    socketIo?.on?.("can-accept-request", ({ fromPlayer, toPlayer }) => {
      if (user.id === toPlayer.id) {
        setNewGameRequest(true);
        setRequester(fromPlayer);
      }
    });

    socketIo?.on("game-begin", ({ players, to_icon, from_icon, max_game }) => {
      if (user.id === players.toPlayer.id) {
        setIsPreparingGame(false);
        setPlayers(players);
        setSettings({ to_icon, from_icon, max_game, me: "to" });
        navigate("/game");
      }
    });
  }, [socketIo?.connected]);

  const handleRequestReject = () => {
    setNewGameRequest(false);
  };

  const handleRequestAccept = () => {
    const payload = {
      fromPlayer: requester,
      toPlayer: {
        id: user.id,
        pseudo: user.pseudo,
      },
    };
    setNewGameRequest(false);
    setPlayers(payload);
    setIsPreparingGame(true);
    socketIo?.emit("request-accepted", payload);
  };

  return (
    <div>
      <Modal showCloseButton={false} isOpen={isNewGameRequest}>
        {" "}
        <div className="flex flex-col items-center justify-center bg-white h-44 w-[350px] rounded-2xl shadow-2xl">
          <h2>
            <BrandName className="text-xl" />
          </h2>
          <p className="text-sm text-gray-500 mt-3">
            Une nouvelle demande a été reçu de <span>{requester.pseudo}</span>
          </p>
          <div className="flex justify-center items-center gap-x-3 mt-8">
            <button
              onClick={handleRequestReject}
              className="btn btn-error block"
            >
              Rejeter
            </button>
            <button
              onClick={handleRequestAccept}
              className="btn btn-success block"
            >
              Accepter
            </button>
          </div>
        </div>
      </Modal>
      {/* When the player that should accept the request accept it we should put it in a loading state */}
      {/* while the other player is defining game settings */}
      <Modal showCloseButton={false} isOpen={isPreparingGame}>
        <div className="w-[300px] h-[200px] bg-white rounded-2xl flex items-center justify-center p-4 flex-col">
          <BrandName />
          <p className="text-red-400">Préparation du match ...</p>
          <span className="animate-spin">
            {" "}
            <Loader2 />{" "}
          </span>
        </div>
      </Modal>
    </div>
  );
};

export default SocketManager;
