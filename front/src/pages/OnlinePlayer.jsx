import React, { useEffect, useState } from "react";
import { Play, Users, Send, List, Loader2, AlertTriangle } from "lucide-react";
import useFetch from "../hooks/useFetch";
import useSocket from "../hooks/useSocket";
import Modal from "../components/Modal";
import { CircleCheck, LoaderCircle, Dot } from "lucide-react";
import { timerFormat } from "../utils";
import { toast } from "sonner";
import useAuthContext from "../context/auth";
import { useNavigate } from "react-router";
import { useGameContext } from "../context/game";

const OnlinePlayer = () => {
  const socketIo = useSocket();
  const { user } = useAuthContext();
  const { setPlayers } = useGameContext();
  const navigate = useNavigate();

  const { data, error, isLoading } = useFetch("/online-players", []);
  const players = data?.players ?? [];
  const [isRequestSent, setSentRequest] = useState(false);
  const [requestPlayer, setRequestPlayer] = useState({});
  const [timerId, setTimerId] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const REQUEST_CONFIRMATION_TIMEOUT = 30; //30s

  const onRequestSent = (player) => {
    const payload = {
      fromPlayer: {
        id: user.id,
        pseudo: user.pseudo,
      },
      toPlayer: {
        id: player.id,
        pseudo: player.pseudo,
      },
    };
    socketIo.emit("game-request", payload);
    setSentRequest(true);
    setRequestPlayer(player);
    const id = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    setTimerId(id);
  };

  useEffect(() => {
    //when the request is accepted by the other player
    socketIo?.on("handshake-done", ({ fromPlayer, toPlayer }) => {
      if (fromPlayer.id === user.id) {
        setSentRequest(false);
        clearInterval(timerId);
        setTimerId(null);
        setTimeElapsed(0);
        toast.info(
          "Votre requête de jeu a été accepté. Vous devez maintenant définir les paramètres du jeu.",
          {
            duration: Infinity,
          }
        );
        setPlayers({ fromPlayer, toPlayer });
        setTimeout(() => {
          navigate(`/game`);
        }, 2500);
      }
    });
  }, [socketIo?.connected]);

  useEffect(() => {
    //when there is timeout before requester could accept invitation
    if (timeElapsed === REQUEST_CONFIRMATION_TIMEOUT && timerId) {
      setSentRequest(false);
      clearInterval(timerId);
      setTimerId(null);
      setTimeElapsed(0);
      setRequestPlayer(null);
      toast.error(
        `${requestPlayer.pseudo} n'a pas répondu à votre invitation. Réessayez plus tard ou avec un autre joueur!`
      );
    }
  }, [timeElapsed]);

  const StatusDisplay = ({ message, Icon, color }) => (
    <tr className="h-40">
      <td colSpan={3} className="text-center">
        <div
          className={`flex flex-col items-center justify-center p-10 text-lg ${color}`}
        >
          <Icon className="w-8 h-8 mb-2" />
          {message}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-5xl mx-auto border border-gray-100">
      <h2 className="text-2xl flex items-center font-bold text-red-500 mb-6 border-b pb-3">
        <Users className="w-6 h-6 inline mr-2 align-text-bottom" /> Joueurs en
        Ligne <Dot size={32} className="text-emerald-600" />
      </h2>

      <div className="max-h-[500px] overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-50/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <List className="w-4 h-4 inline mr-1" /> Index
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <Users className="w-4 h-4 inline mr-1" /> Pseudo
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <Play className="w-4 h-4 inline mr-1 text-green-700" /> Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading && (
              <StatusDisplay
                message="Chargement des joueurs en cours..."
                Icon={Loader2}
                color="text-red-500"
              />
            )}

            {error && !isLoading && (
              <StatusDisplay
                message={`Erreur lors du chargement: ${error}`}
                Icon={AlertTriangle}
                color="text-red-500"
              />
            )}

            {!isLoading && !error && players.length > 0
              ? players.map((player, i) => {
                  return (
                    <tr
                      key={player.id}
                      className="hover:bg-indigo-50/20 transition duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                        {i + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-gray-800">
                        {player.pseudo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {
                          <button
                            className={`cursor-pointer
                                    font-semibold text-white bg-red-400 px-4 py-2 rounded-lg 
                                    flex items-center justify-center mx-auto transition-colors duration-200
                                    hover:bg-red-300 active:bg-red-600 shadow-md
                                `}
                            onClick={() => onRequestSent(player)}
                          >
                            Envoyer une requête
                            <Send size={14} className="ms-2" />
                          </button>
                        }
                      </td>
                    </tr>
                  );
                })
              : !isLoading &&
                !error && (
                  <StatusDisplay
                    message="Aucun joueur n'est actuellement en ligne."
                    Icon={Users}
                    color="text-gray-500"
                  />
                )}
          </tbody>
        </table>
      </div>
      <Modal showCloseButton={false} isOpen={isRequestSent}>
        <div className="bg-white w-[500px] h-[300px] rounded-2xl p-4">
          <div className="flex flex-col items-center justify-center gap-y-5">
            <div className="spinner">
              {" "}
              <CircleCheck size={35} />
            </div>
            <p className="text-md">
              Une requête a été envoyé à{" "}
              <span className="text-red-500">{requestPlayer?.pseudo}</span>
            </p>

            <p className="text-center text-gray-500">
              Si votre demande n'est pas acceptée dans les{" "}
              {REQUEST_CONFIRMATION_TIMEOUT} prochaines secondes vous pourrez en
              faire une nouvelle.
            </p>
            <div className="bg-red-500/50 text-red-500 p-2 rounded-md inline-block">
              {" "}
              {timerFormat(REQUEST_CONFIRMATION_TIMEOUT - timeElapsed)}{" "}
            </div>
            <div>
              <LoaderCircle className="animate-spin" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OnlinePlayer;
