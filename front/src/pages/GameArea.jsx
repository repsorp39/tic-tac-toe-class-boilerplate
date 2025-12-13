import Board from "../components/Board";
import { useState } from "react";
import XIcon from "/X.png";
import OIcon from "/O.png";
import Modal from "../components/Modal";
import Select from "../components/Select";
import { toast } from "sonner";
import { useEffect } from "react";
import { useNavigate } from "react-router";

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

const icons = {
  X: XIcon,
  O: OIcon,
};

const GameArea = () => {
  const [board, setBoard] = useState(initialBoard);

  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [remainingGame, setRemainingGame] = useState(5);
  const [isGameSettingsSet, setGameSettingsSet] = useState(false);
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [winningCombo, setWinningCombo] = useState([]);
  const [endOfGame, setEndOfGame] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (remainingGame === 0) {
      setEndOfGame(true);
    } else {
      const currentMaxScore = Math.max(score.X, score.O);
      const currentMinScore = Math.min(score.X, score.O);

      if (remainingGame + currentMinScore < currentMaxScore) {
        setEndOfGame(true);
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
            <img className="w-5 h-5" src={icons[currentPlayer]} />
          </div>
          <div className="uppercase font-avenir-bold text-gray-400 flex items-center gap-x-4">
            {" "}
            Parties restantes:{" "}
            <span className="text-red-400"> {remainingGame} </span>
          </div>
        </div>
        <div className="mt-5">
          <div className="uppercase font-avenir-bold text-gray-400 flex items-center gap-x-4">
            <img className="w-5 h-5" src={XIcon} />: {score.X}
          </div>
          <div className="uppercase font-avenir-bold text-gray-400 flex items-center gap-x-4">
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
              onClick={() => setGameSettingsSet(true)}
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
        <div className="card w-96 bg-base-100 card-xs shadow-sm m-4">
          <div className="card-body">
            <h2 className="card-title">
              Vainqueur de la manche: {currentPlayer}
            </h2>
            <div className="justify-end card-actions">
              <button onClick={pursuitParty} className="btn btn-error">
                Continuer
              </button>
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
              <h2 className="card-title">
                Le joueur{" "}
                <img
                  className="w-12 h-12"
                  src={icons[score.X > score.O ? "X" : "O"]}
                />{" "}
                gagne avec {Math.max(score.X, score.O)} points
              </h2>
            )}
            <div className="card-actions justify-end">
              <button
                onClick={() => navigate("/")}
                className="btn btn-error"
              >
                Voir mes statistiques
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );

  function handleCellClick(key) {
    //if there is not already some value inner the cell
    if (!board[key]) {
      const updatedBoard = { ...board, [key]: currentPlayer };
      setBoard(updatedBoard);
      const { hasWon, nobodyWon } = checkThatWin(updatedBoard);

      //when a player won
      if (hasWon) {
        setScore({ ...score, [currentPlayer]: score[currentPlayer] + 1 });
      } else {
        //when nobody won
        if (nobodyWon) {
          toast.error("Personne n'a gagné cette manche", { duration: 2000 });
          setTimeout(() => {
            pursuitParty();
          }, 2000);
        }
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      }
    }
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

  function pursuitParty() {
    setWinningCombo([]);
    setBoard(initialBoard);
    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    setRemainingGame(remainingGame - 1);
  }
};

export default GameArea;
