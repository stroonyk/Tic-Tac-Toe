import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


/* Reverse button */
function ReverseButton(props){	
	const text = props.ascending ? "Moves Decending" : "Moves Ascending";
	return (
		<button onClick={() => props.onClick()} >
			{text}
		</button>
	);
}
/* Start again button */
function StartAgainButton(props){	
	return (
		<button onClick={() => props.onClick()} >
			Start Again
		</button>
	);
}
/* This is a square on the board. style it appropriately if we are a winner */
function Square(props){
    return (
		<button 
			className="square" 
			onClick={() => props.onClick()}
			style={props.winningSquare ? {backgroundColor:'green'}:null}
		>
        {props.value}
      </button>
    );
}
/* This is our board */
class Board extends React.Component {	
	renderSquare(i) {
		// determine if we're a winning square
		let winningSquare = this.props.winner && this.props.winner.includes(i) ? true : false;
		return <Square value={this.props.squares[i]} 
				onClick= {() => this.props.onClick(i)}
				winningSquare={winningSquare}
				/>;
	}
	render() {					
		let outterBoard = [];
		for (let j = 0; j < 3; j++)
		{
			let innerBoard = [];
			for (let k = 0; k < 3; k++)
			{
				innerBoard.push(this.renderSquare((j * 3)  + k));
			}
			outterBoard.push(<div className="board-row">{innerBoard}</div>);
		}
		return (
			<div>
			{outterBoard}
			</div>
			
		);

	}
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
		position : null,
      }],
	  stepNumber : 0,
      xIsNext: true,
	  displayMovesForward : true,
    };
  }
  handleClick(i) {
    const history = this.state.history.slice(0,this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
	
    this.setState({
      history: history.concat([{
        squares: squares,
		position : i,
      }]),
	  stepNumber:history.length,
      xIsNext: !this.state.xIsNext,	 
    });
  }	
  jumpTo(step,line) {	
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }  
  startAgain(){
    this.setState({
      history: [{
        squares: Array(9).fill(null),
		position : null,
      }],
	  stepNumber : 0,
      xIsNext: true,
	  displayMovesForward : true,
    });	  
  }
  toggleMoves(){
	if (this.state.displayMovesForward)
		this.setState({displayMovesForward : false });
	else
		this.setState({displayMovesForward : true});
  }
  render() {
	const history = this.state.history;
	const current = history[this.state.stepNumber];
	const winner = calculateWinner(current.squares);

	const moves = history.map((step,move) => {
		const col = step.position%3 + 1;
		const row = Math.floor(step.position/3) + 1;
		const desc = move ? 'col:' + col + '.row:' + row + '. Go to move#' + move :'go to game start';
		const className = 'history' + move;
		let myStyle = (this.state.stepNumber === move) ? {fontWeight:'bold'} : {fontWeight:'normal'};
		let winningLine = winner ? winner.lines : null;
		return (
			<li key={move}>
				<button style={myStyle} onClick={() => this.jumpTo(move,winningLine)}>{desc}</button>
			</li>
		);
	});
		
	let status;
	if (winner){
		status = "Winner: " + winner.player;
	}
	else { 
		if (this.state.stepNumber === 9)
			status = "DRAWWWW";
		else
			status = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
	}
    return (
      <div className="game">
        <div className="game-board">
          <Board 
			squares={current.squares}
			onClick={(i) => this.handleClick(i)}
			winner={winner && winner.playerSquares}
			/>
		 <div>{status}</div>
        </div>
        <div className="game-info">         
          <ol>{this.state.displayMovesForward ? moves : moves.reverse() }</ol>
        </div>
		<div>
			<ReverseButton ascending={this.state.displayMovesForward}
			onClick={() => {this.toggleMoves()} }/>
			<StartAgainButton onClick={() => {this.startAgain()} }/>			
		</div>
      </div>
    );
  }
}
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {'player' : squares[a], 
				'playerSquares' : [a, b, c]
			};
    }
  }
  return null;
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
