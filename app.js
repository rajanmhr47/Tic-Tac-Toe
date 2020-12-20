var originalBoard;
const HUMAN_PLAYER = 'O';
const AI_PLAYER = 'X';
const WINNING_COMBINATIONS = [
    [0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [6,4,2]
];

//DOM caching.
const cells = document.querySelectorAll(".cell");
const endgame_div = document.querySelector('.endgame');
const message_div = document.querySelector('.endgame #messageWrap .message');
const button_div = document.querySelector('.endgame #messageWrap #replayButton');

startGame();

function startGame() {
    endgame_div.style.display = "none";

    //Array.from() shallow copy from an iterable object
    originalBoard = Array.from(Array(9).keys());

    for(let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', clickInput, false);
    }
}

function clickInput(square) {
    if(typeof originalBoard[square.target.id] == 'number') {
        input(square.target.id, HUMAN_PLAYER);

        //check for tie otherwise it's computer turn;
        if(!checkIfGameIsOver(originalBoard, HUMAN_PLAYER) && !isGameDraw()) {
            //it AI's turn
            input(getBestMove(), AI_PLAYER);
        }
        isGameDraw();
    }
}

function isGameDraw() {
    if(emptySquares().length == 0)
    {
		for (var i = 0; i < cells.length; i++) {
			cells[i].removeEventListener('click', clickInput, false);
		}
		showResult("Tie Game!")
        return true;
    }
	return false;
}

function input(squareId, player) {
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
		document.getElementById(index).style.backgroundColor = status.player == HUMAN_PLAYER ? "#006600" : "#990000";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', clickInput, false);
    }
    
    showResult(status.player == HUMAN_PLAYER ? "You win!" : "You lose!");
}

function showResult(winner) {
	endgame_div.style.display = "block";
	message_div.innerText = winner;
	message_div.style.color = button_div.style.backgroundColor = getMessageButtonColor(winner);
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

function getBestMove() {
	// return emptySquares()[0];
	return minimax(originalBoard, AI_PLAYER).index;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkIfGameIsOver(newBoard, AI_PLAYER)) {
		return {score: 5};
	} else if (checkIfGameIsOver(newBoard, HUMAN_PLAYER)) {
		return {score: -5};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == AI_PLAYER) {
			var result = minimax(newBoard, HUMAN_PLAYER);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, AI_PLAYER);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === AI_PLAYER) {
		var bestScore = -Infinity;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = Infinity;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}