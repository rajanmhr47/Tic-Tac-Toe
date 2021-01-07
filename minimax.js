function minimax(newBoard, player, depth) {
    "use strict";

    // if(depth <= 0) {
    //     return { score: 0 };
    // }

	let availSpots = emptySquares();

	if (checkIfGameIsOver(newBoard, AI_PLAYER)) {
		return { score: 5 };
	}
	else if (checkIfGameIsOver(newBoard, HUMAN_PLAYER)) {
		return { score: -5 };
	}
	else if (availSpots.length === 0) {
		return { score: 0 };
	}
	let moves = [];
	for (let i = 0; i < availSpots.length; i++) {
		let move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == AI_PLAYER) {
			let result = minimax(newBoard, HUMAN_PLAYER, depth--);
			move.score = result.score;
		}
		else {
			let result = minimax(newBoard, AI_PLAYER, depth--);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	let bestMove;
	if (player === AI_PLAYER) {
		let bestScore = -Infinity;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}
	else {
		let bestScore = Infinity;
		for (let i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
