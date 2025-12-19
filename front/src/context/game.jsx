import { useState, useContext, createContext } from "react";

const GameContext = createContext();
/**
 *
 * we will represents our board like {key:value, key:value} , and value can be either X
 * or O as the content
 * keys are like 00, 01, 02 to identify cell... example { "00":"X","01","O"}
 *
 */
let initialBoard = {};

for (let i = 0; i <= 2; i++) {
  for (let j = 0; j <= 2; j++) {
    initialBoard = { ...initialBoard, [i + "" + j]: null };
  }
}

function GameProvider({ children }) {
  const [players, setPlayers] = useState({ fromPlayer: null, toPlayer: null });
  const [playerIcon, setPlayerIcon] = useState(null);
  const [isPlaying, setPlaying] = useState(false);
  const [board, setBoard] = useState(initialBoard);
  
  const resetBoard = () => setBoard(initialBoard);

  const [winningCombo, setWinningCombo] = useState([]);
  const [settings, setSettings] = useState({});
  const [remainingGame, setRemainingGame] = useState(5);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [currentPlayer, setCurrentPlayer] = useState("X");

  const getPlayerPseudo = (icon) => {
    if (settings.from_icon === icon) return players?.fromPlayer?.pseudo;
    return players?.toPlayer?.pseudo;
  };

  const data = {
    players,
    setPlayers,
    board,
    setBoard,
    settings,
    setSettings,
    isPlaying,
    setPlaying,
    winningCombo,
    setWinningCombo,
    resetBoard,
    remainingGame,
    setRemainingGame,
    score,
    setScore,
    currentPlayer,
    setCurrentPlayer,
    playerIcon,
    setPlayerIcon,
    getPlayerPseudo
  };

  return <GameContext.Provider value={data}>{children}</GameContext.Provider>;
}

export function useGameContext() {
  return useContext(GameContext);
}

export default GameProvider;
