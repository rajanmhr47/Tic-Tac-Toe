let originalBoard;
let isAgainstComputer = false;
const PLAYER_PLAYER_SCORE = { score_X: 0, tie: 0, score_O: 0};
const PLAYER_COMPUTER_SCORE = { score_X: 0, tie: 0, score_O: 0 };
const HUMAN_PLAYER = 'O';	//player 1 in case of 2 play.
const AI_PLAYER = 'X';		//player 2 in case of 2 play.
const WINNING_COMBINATIONS = [
    [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [6,4,2]
];

let playerToStart = "O";
let currentPlayer = "O";

//DOM caching.
const cells = document.querySelectorAll(".cell");
const endgame_div = document.querySelector('.endgame');
const message_div = document.querySelector('.endgame #messageWrap .message');
const button_div = document.querySelector('.endgame #messageWrap #replayButton');
const secondplayer_td = document.querySelector('.second-player');
const tiescore_td = document.querySelector('.score-tie');
const scoreX_td = document.querySelector('.score-X');
const scoreO_td = document.querySelector('.score-O');
const gameoption_td = document.getElementById('game-option');

initialSetup();
startGame();

function startGame() {
	endgame_div.style.display = "none";

	playerToStart = playerToStart == HUMAN_PLAYER ? AI_PLAYER : HUMAN_PLAYER;
	currentPlayer = playerToStart;
	
    //Array.from() shallow copy from an iterable object
	originalBoard = Array.from(Array(9).keys());

    for(let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', clickInput, false);
	}
	
	// if it's computer turn
	if(isAgainstComputer == true && currentPlayer == AI_PLAYER) {
		input(getBestMove(9), AI_PLAYER);
		currentPlayer = currentPlayer == HUMAN_PLAYER ? AI_PLAYER : HUMAN_PLAYER;
	}
}

function clickInput(square) {
    if(typeof originalBoard[square.target.id] == 'number') {
		input(square.target.id, currentPlayer);
		
		if(isAgainstComputer == false) {
			currentPlayer = currentPlayer == HUMAN_PLAYER ? AI_PLAYER : HUMAN_PLAYER;
		}

        //check if its tie or game over otherwise it's computer turn;
        if(isAgainstComputer && !checkIfGameIsOver(originalBoard, HUMAN_PLAYER) && !isGameDraw()) {
            //it AI's turn
            input(getBestMove(), AI_PLAYER);
			isGameDraw();
        }
    }
}

function isGameDraw() {
    if(emptySquares().length == 0)
    {
		for (var i = 0; i < cells.length; i++) {
			cells[i].removeEventListener('click', clickInput, false);
		}
		if(isAgainstComputer)
			PLAYER_COMPUTER_SCORE.tie++;
		else
			PLAYER_PLAYER_SCORE.tie++;
		showResult("Tie Game!")
        return true;
    }
	return false;
}

function input(squareId, player) {
	console.log(squareId);
    originalBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    
    //check if game is won or not.
    let gameStatus = checkIfGameIsOver(originalBoard, player);
    if(gameStatus)
        gameOver(gameStatus);
}

function checkIfGameIsOver(board, player) {
    let result = null;
    for(let [index, combination] of WINNING_COMBINATIONS.entries()) {
        if(combination.every((value) => originalBoard[value] == player)) {
            result = {index, player};
            break;
        }
    }
    return result;
}

function gameOver(status) {
    for (let index of WINNING_COMBINATIONS[status.index]) {
		document.getElementById(index).style.backgroundColor = status.player == HUMAN_PLAYER ? "#006600" : "#9e1919";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', clickInput, false);
	}
	if(isAgainstComputer)
		(status.player == HUMAN_PLAYER) ? PLAYER_COMPUTER_SCORE.score_X++ : PLAYER_COMPUTER_SCORE.score_O++;
	else
		(status.player == HUMAN_PLAYER) ? PLAYER_PLAYER_SCORE.score_X++ : PLAYER_PLAYER_SCORE.score_O++;
	
	let msg = isAgainstComputer ? (status.player == HUMAN_PLAYER ? "You win!" : "You lose!")
				:(`Player ${status.player} wins`);
    showResult(msg);
}

function showResult(winner) {
	endgame_div.style.display = "block";
	message_div.innerText = winner;
	message_div.style.color = button_div.style.backgroundColor = getMessageButtonColor(winner);

	updateScore();
}

function getMessageButtonColor(winner) {
	let color = "";
	switch(winner)
	{
		case "You win!":
			color = "green";
			break;
		case "You lose!":
			color = "red";
			break;
		default:
			color = "wheat";
			break;
	}
	return color;
}

function emptySquares() {
	return originalBoard.filter(s => typeof s == 'number');
}

function getBestMove(depth = -1) {
	return minimax(originalBoard, AI_PLAYER, depth).index;
}

function initialSetup() {
	playerToStart = AI_PLAYER;
	isAgainstComputer = gameoption_td.innerHTML == "1P";

	gameoption_td.addEventListener('click', () => {
		gameoption_td.innerHTML = gameoption_td.innerHTML == "1P" ? "2P": "1P";
		isAgainstComputer = gameoption_td.innerHTML == "1P";
		secondplayer_td.innerHTML = isAgainstComputer ? "Computer X" : "Player X";
		
		updateScore();
		startGame();
	}, false);
}

function updateScore() {
	//udpate the scores
	let score = isAgainstComputer ? PLAYER_COMPUTER_SCORE: PLAYER_PLAYER_SCORE;

	tiescore_td.innerHTML = score.tie;
	scoreX_td.innerHTML = score.score_X;
	scoreO_td.innerHTML = score.score_O;
}