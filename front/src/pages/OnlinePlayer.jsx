import React from "react";
import { Play, Users, Send, List, Loader2, AlertTriangle } from "lucide-react";
import useFetch from "../hooks/useFetch";
import { Dot } from "lucide-react";
import { toast } from "sonner";

const OnlinePlayer = () => {
  const { data, error, isLoading } = useFetch("/online-players", []);
  const players = data?.players ?? [];

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
                            onClick={() =>
                              toast.info(`Requête envoyée à ${player.pseudo}`)
                            }
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
    </div>
  );
};

export default OnlinePlayer;
