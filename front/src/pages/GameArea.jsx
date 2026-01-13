import Board from "../components/Board";
import { useState } from "react";
import XIcon from "/X.png";
import OIcon from "/O.png";
import Modal from "../components/Modal";
import Select from "../components/Select";
import { toast } from "sonner";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import useSocket from "../hooks/useSocket";
import { useGameContext } from "../context/game";

const icons = {
  X: XIcon,
  O: OIcon,
};

const GameArea = () => {
  const socketIo = useSocket();

  const {
    setSettings,
    setBoard,
    board,
    winningCombo,
    setWinningCombo,
    remainingGame,
    setRemainingGame,
    score,
    setScore,
    currentPlayer,
    setCurrentPlayer,
    setPlayerIcon,
    players,
    getPlayerFromIcon,
    playerIcon,
    resetBoard,
  } = useGameContext();

  //when user has define game parameters like his icon and the max number of game by party
  const handleGameSettings = () => {
    setGameSettingsSet(true);
    toast.dismiss();
    const max_game = remainingGame;
    const from_icon = currentPlayer;
    const to_icon = currentPlayer === "X" ? "O" : "X";
    console.log("currentPlayer", from_icon);
    // setCurrentPlayer(from_icon);
    setPlayerIcon(from_icon);
    const payload = {
      max_game,
      from_icon,
      to_icon,
      players,
    };
    setSettings({ ...payload, me: "from" });
    socketIo?.emit("game-begin", payload);
  };

  const [isGameSettingsSet, setGameSettingsSet] = useState(!!playerIcon);

  const [endOfGame, setEndOfGame] = useState(false);

  const navigate = useNavigate();

  const updateRemoteBoard = (payload) => {
    socketIo?.emit("board-update", payload);
  };

  const syncFromRemoteBoard = () => {
    socketIo?.on("board-update", ({ cellKey, cellValue }) => {
      updateLocalBoard(cellKey, cellValue);
    });

    socketIo?.on("pursuit-party", () => {
      console.log("pursuingParty");
      pursuitParty(false);
    });
  };

  useEffect(() => {
    syncFromRemoteBoard();
  }, [socketIo?.connected]);

  useEffect(() => {
    const { hasWon, nobodyWon } = checkThatWin(board);

    //when a player won
    if (hasWon) {
      setScore({ ...score, [currentPlayer]: score[currentPlayer] + 1 });
    } else {
      //when nobody won
      if (nobodyWon) {
        toast.error("Personne n'a gagné cette manche", { duration: 2000 });
        setTimeout(() => {
          pursuitParty(false);
        }, 2000);
      }
      if (Object.values(board).some((v) => !!v))
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  }, [JSON.stringify(board)]);

  useEffect(() => {
    if (remainingGame === 0) {
      closeGame();
    } else {
      const currentMaxScore = Math.max(score.X, score.O);
      const currentMinScore = Math.min(score.X, score.O);

      if (remainingGame + currentMinScore < currentMaxScore) {
        closeGame();
      }
    }
  }, [remainingGame]);

  return (
    <section>
      <div>
        <div className="flex items-center justify-between">
          <div className="uppercase font-avenir-bold text-gray-400 flex items-center gap-x-4">
            {" "}
            Joueur actuel:
            <img className="w-5 h-5" src={icons[currentPlayer]} />{" "}
            <span> {} </span>
          </div>
          <div className="uppercase font-avenir-bold text-gray-400 flex items-center gap-x-4">
            {" "}
            Parties restantes:{" "}
            <span className="text-red-400"> {remainingGame} </span>
          </div>
        </div>
        <div className="mt-5">
          <div className="font-avenir-bold text-gray-400 flex items-center gap-x-4">
            <span> {getPlayerFromIcon("X")?.pseudo} </span>{" "}
            <img className="w-5 h-5" src={XIcon} />: {score.X}
          </div>
          <div className="font-avenir-bold text-gray-400 flex items-center gap-x-4">
            <span> {getPlayerFromIcon("O")?.pseudo} </span>
            <img className="w-5 h-5" src={OIcon} />: {score.O}
          </div>
        </div>
      </div>

      <Board
        winningCombo={winningCombo}
        onCellClick={handleCellClick}
        bordElement={board}
      />

      {/* Modal to set settings of the current party */}
      <Modal showCloseButton={false} isOpen={!isGameSettingsSet}>
        <div className="w-md bg-gray-200 p-3 rounded-sm">
          <Select
            name="game-in-a-row"
            value={remainingGame}
            label="Choisissez le nombre de parties par jeu"
            options={[1, 3, 5, 7]}
            onChange={(e) => {
              setRemainingGame(e.currentTarget.value);
            }}
          />
          <Select
            label="Choisissez votre symbole"
            onChange={(e) => setCurrentPlayer(e.currentTarget.value)}
            value={currentPlayer}
            options={["X", "O"]}
            name="player-symbol"
          />
          <div>
            <button
              onClick={handleGameSettings}
              className="btn btn-success my-2 w-full"
            >
              Valider
            </button>
          </div>
        </div>
      </Modal>

      {/* To pursuie a party  */}
      <Modal
        className="justify-start items-start"
        showCloseButton={false}
        isOpen={winningCombo.length > 0}
      >
        <div className="card w-96 bg-base-100  p-3 card-xs shadow-sm m-4">
          <div className="card-body">
            <h2 className="card-title">
              Vainqueur de la manche: {getPlayerFromIcon(currentPlayer).pseudo}
            </h2>
            <p>
              La partie continuera quand{" "}
              {getPlayerFromIcon(currentPlayer).pseudo} aura appuyé sur
              Continuer
            </p>
            <div className="justify-end card-actions">
              {currentPlayer === playerIcon && (
                <button onClick={pursuitParty} className="btn btn-error">
                  Continuer
                </button>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* When the game end */}
      <Modal showCloseButton={false} isOpen={endOfGame}>
        <div className="card card-dash bg-base-100 w-96">
          <div className="card-body">
            {score.O === score.X ? (
              <h2>Personne ne gagne ce jeu</h2>
            ) : (
              <h2 className="card-title ">
                <div className="flex items-center gap-x-2">
                  Le joueur{" "}
                  <span>
                    {" "}
                    {getPlayerFromIcon(score.X > score.O ? "X" : "O").pseudo}
                  </span>
                  <img
                    className="w-12 h-12 block"
                    src={icons[score.X > score.O ? "X" : "O"]}
                  />{" "}
                  gagne avec {Math.max(score.X, score.O)} points
                </div>
              </h2>
            )}
            <div className="card-actions justify-end">
              {/* i don't use navigate just to not keep state  */}
              <button
                onClick={() => window.location.replace("/")}
                className="btn btn-error"
              >
                Voir les statistiques
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );

  function handleCellClick(key) {
    //if there is not already some value inner the cell
    //and the cliking player is the player that have the right rights then

    if (!board[key]) {
      if (currentPlayer !== playerIcon)
        return toast.info("Ce n'est pas votre tour de jouer!", {
          position: "top-right",
        });
      updateLocalBoard(key, currentPlayer);
      updateRemoteBoard({ cellKey: key, cellValue: currentPlayer });
      console.log("Emitting:--", key, currentPlayer);
    }
  }

  function updateLocalBoard(cellKey, cellValue) {
    setBoard((prev) => ({ ...prev, [cellKey]: cellValue }));
  }

  function checkThatWin(board) {
    //differents possible combinations
    const winCombo = [
      ["00", "01", "02"], //horizontale line 1
      ["10", "11", "12"], //horizontale line 2
      ["20", "21", "22"], //horizontale line 3
      ["00", "10", "20"], //verticale line 1
      ["01", "11", "21"], //verticale line 2
      ["02", "12", "22"], //verticale line 3
      ["00", "11", "22"], //diagonale line
      ["02", "11", "20"], //diagonale line
    ];

    let hasWon = false;
    // there is a win when all value of each combo line are the same
    for (let i = 0; i < winCombo.length; i++) {
      if (
        winCombo[i].every((cellKey) => board[cellKey] === "X") ||
        winCombo[i].every((cellKey) => board[cellKey] === "O")
      ) {
        setWinningCombo(winCombo[i]);
        hasWon = true;
        break;
      }
    }
    //when all cells are full and there is no winner then nobody won
    const nobodyWon = !hasWon && Object.values(board).every(Boolean);
    return { hasWon, nobodyWon };
  }

  function pursuitParty(withEmitOption = true) {
    setWinningCombo([]);
    resetBoard();
    setCurrentPlayer((prev) => (prev === "X" ? "O" : "X"));
    setRemainingGame((prev) => prev - 1);
    if (withEmitOption) socketIo?.emit("pursuit-party");
  }

  function closeGame() {
    console.log(currentPlayer);

    setEndOfGame(true);

    //only the winner will emit through the server
    const winner = currentPlayer === "X" ? "O" : "X";
    const canEmit = winner === playerIcon || score.X === score.Y;

    //as soon a winner is set currentPlayer change value
    //so we can't use it directly to know thr winner

    if (canEmit) {
      const payload = {
        ...players,
        winner_id:
          score.X === score.Y
            ? null
            : getPlayerFromIcon(winner).id,
      };
      socketIo?.emit("game-end", payload);
    }
  }
};

export default GameArea;
