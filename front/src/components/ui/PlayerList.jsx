import React from "react";
import { Trophy, Frown, Users, Calendar } from "lucide-react";
import useAuthContext from "../../context/auth";
import { toast } from "sonner";
import getAxiosInstance from "../../lib/axios-config";
import { useState } from "react";
import { useEffect } from "react";
import { formatDate } from "../../utils";
import { StopCircle } from "lucide-react";

const PlayerList = ({ tableTitle, name }) => {
  const { user } = useAuthContext();
  const http = getAxiosInstance();
  const [games, setGames] = useState([]);

  async function fetchGames() {
    try {
      const res = await http.get(`/stats/${name}`);
      setGames(res.data ?? []);
    } catch (error) {
      toast.error("Une erreur est survenue!");
      console.log(error);
    }
  }

  useEffect(() => {
    fetchGames();
  }, []);

  function getMatchDetails(game) {
    const { player_1, winner_id } = game;
    const userWin = winner_id === user.id;

    //match info
    const details = userWin
      ? {
          statut: "Victoire",
          resultIcon: Trophy,
          resultColor: "text-green-700 bg-green-100",
        }
      : !winner_id
      ? {
          statut: "Match null",
          resultIcon: StopCircle,
          resultColor: "text-yellow-700 bg-yellow-100",
        }
      : {
          statut: "Défaite",
          resultIcon: Frown,
          resultColor: "text-red-700 bg-red-100",
        };

    //opponent info
    const opponentKey = user.id === player_1 ? "player_2" : "player_1";

    const opponentPseudo = game[`${opponentKey.replace("_", "")}.pseudo`];

    return {
      ...details,
      opponent: opponentPseudo,
      date: formatDate(game.createdAt),
    };
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{tableTitle}</h2>

      <div className="max-h-[500px] overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Users className="w-4 h-4 inline mr-1" /> Adversaire
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <Calendar className="w-4 h-4 inline mr-1" /> Date
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Résultat
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {games.length > 0 ? (
              games.map((game) => {
                const {
                  opponent,
                  date,
                  statut,
                  resultColor,
                  resultIcon: Icon,
                } = getMatchDetails(game);

                return (
                  <tr
                    key={game.id}
                    className="hover:bg-indigo-50/20 transition duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {opponent}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {date}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`
                        inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold
                        ${resultColor}
                      `}
                      >
                        <Icon className="w-4 h-4 mr-1" />
                        {statut}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="w-full">
                <td
                  colSpan={3}
                  className="text-center w-full font-avenir-medium text-sm block p-3 text-gray-500"
                >
                  Aucun match correspondant à ce critère.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlayerList;
