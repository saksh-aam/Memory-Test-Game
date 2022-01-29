import React, { useState, useEffect } from "react";
import produce from "immer";
import "./App.css";

const random = (counter, setboard) => {
  setboard(
    Array.from({ length: counter }, () =>
      Array.from({ length: counter }, () => Math.floor(Math.random() * 1.5))
    )
  );
};

const stopped=(stop, tempgrid, setboard)=>{
  if(stop){
    return(
      <div>
        <h3>"Sorry! You clicked the wrong cell"</h3>
        <div className="playboard">
          {tempgrid.map((x, i) =>
            x.map((_, j) => (
              <div
                key={`${i}-${j}`}
                className={`cell ${!!tempgrid[i][j]}`}
              ></div>
            ))
          )}
        </div>
      </div>
    )
  }
}

const nextlevel=(next, setnext, stop, counter, setcounter, setrunning)=>{
  if(next && !stop){
    return(
      <button
        onClick={() => {
          setcounter(counter + 1);
          setrunning(true);
          setnext(false)
        }}
      >
        Next
      </button>
    )
  }
}

function App() {
  const [counter, setcounter] = useState(0);
  const [valid, setvalid] = useState(0);
  const [copy, setcopy] = useState(false);
  const [next, setnext] = useState(false);
  const [create, setcreate] = useState(false);
  const [running, setrunning] = useState(false);
  const [stop, setstop] = useState(false);
  
  const [board, setboard] = useState(
    Array.from({ length: counter }, () =>
      Array.from({ length: counter }, () => 0)
    )
  );
  const [tempgrid, setgrid] = useState(
    Array.from({ length: counter }, () =>
      Array.from({ length: counter }, () => 0)
    )
  );

  useEffect(() => {
    random(counter, setboard);
    setcopy(true);
  }, [counter]);

  useEffect(() => {
    const root = document.documentElement;
    root?.style.setProperty("--counter", counter);
  }, [counter]);

  useEffect(() => {
    if (copy) {
      setgrid(produce(board, (draft) => {}));
      setcreate(true);
    }// eslint-disable-next-line
  }, [copy]);

  useEffect(() => {
    if (create) {
      var count=0;
      for(let i=0; i<counter; i++){
        for(let j=0; j<counter; j++){
          if(tempgrid[i][j]===1){
            count++;
          }
        }
      }setvalid(count);
      setTimeout(() => {
        setboard(
          Array.from({ length: counter }, () =>
            Array.from({ length: counter }, () => 0)
          )
        );
        setcopy(false);
        setcreate(false);
        setrunning(false);
      }, 3000);
    }// eslint-disable-next-line
  }, [create]);

  return (
    <div className="App">
      <h1>Let's check your Memory</h1>
      <button
        onClick={() => {
          setcounter(3);
          setstop(false);
          setrunning(true);
        }}
      >
        Start
      </button>
      {nextlevel(next, setnext, stop, counter, setcounter, setrunning)}

      <div className="playboard">
        {board.map((x, i) =>
          x.map((_, j) => (
            <div
              key={`${i}-${j}`}
              className={`cell ${!!board[i][j]}`}
              onClick={() => {
                if (!running) {
                  setboard(
                    produce(board, (draft) => {
                      draft[i][j] = draft[i][j] ^ 1;
                    })
                  );
                  setvalid(valid-1);
                  if (tempgrid[i][j] === board[i][j]) {
                    setstop(true);
                    setrunning(true);
                  }
                  if(valid-1===0){
                    setnext(true);
                  }
                }
              }}
            ></div>
          ))
        )}
      </div>
      <br />
      {stopped(stop, tempgrid, setboard)}
    </div>
  );
}

export default App;

