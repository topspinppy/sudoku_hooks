import React, { useState, useEffect } from "react";
import axios from 'axios';
import Cell from "./Cell";

let statusText = "";
const Board = props => {
  const [board, setBoard] = useState([
    [1, 2, 3, 4],
    [3, 4, 0, 0],
    [2, 0, 4, 0],
    [4, 0, 0, 2]
  ]);
  const [initial,setInitial] = useState([
    [true, true, true, true],
    [true, true, false, false],
    [true, false, true, false],
    [true, false, false, true]
  ]);
  const [statusText, setStatusText] = useState("")

  useEffect(() => {
    let source = axios.CancelToken.source()
    async function fetchData() {
        await axios.get('https://us-central1-skooldio-courses.cloudfunctions.net/react_01/random').then((response) =>{
            console.log(response.data.board)
            setBoard([...response.data.board])
            setInitial( response.data.board.map (row => row.map( item => item !== 0 )))
        })
    }
    fetchData();

    return () => {
        source.cancel();
    }
  }, []);

  return (
    <div>
      <div className="board">
        {board.map((number, indexi) =>
          number.map((numbers, indexj) => (
            <Cell
              key={`cell-${indexi}-${indexj}`}
              isInitial={initial[indexi][indexj]}
              number={numbers}
              onChange={newNumbers => {
                board[indexi][indexj] = newNumbers;
                let newBoard = board;
                setBoard([...newBoard]);
              }}
            />
          ))
        )}
      </div>
      <button 
        onClick={e => {
          let returns = submit(board, e)
          setStatusText(returns)
        }}
      >
          Check This!
      </button>
      <p> {statusText} </p>
    </div>
  );
};

const submit = board => {
  const isValid = validate(board);
  statusText = isValid ? "Board is complete :)" : "Board is Valid :(";
  return statusText
};

const validate = board => {
  let isValid = true;
  for (let i = 0; i < 4; i++) {
    const horizontal = new Set();
    const vertical = new Set();
    const square = new Set();
    for (let j = 0; j < 4; j++) {
      horizontal.add(board[i][j]);
      vertical.add(board[j][i]);
      square.add(
        board[2 * (i % 2) + (j % 2)][2 * Math.floor(i / 2) + Math.floor(j / 2)]
      );
    }
    horizontal.delete(0);
    vertical.delete(0);
    square.delete(0);
    if (horizontal.size !== 4 || vertical.size !== 4 || square.size !== 4) {
      isValid = false;
    }
  }
  return isValid;
};

export default Board;
