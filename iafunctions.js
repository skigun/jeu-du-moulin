JDM.Pion = function (tableau, indice){
	this.i = tableau;
	this.j = indice;
}

function nextMoves(stateofthegame, nextplayer) {
	var newBoards = [];
	var piecesPositionArray = findAllPieces(stateofthegame, nextplayer);
	for (var i = 0, var l = piecesPositionArray.length; i < l; i++) {
		//recopier l'etat de jeu actuel, et effectuer les changements
		var posIpion = piecesPositionArray[i][0].i;
		var posJpion = piecesPositionArray[i][0].j;
		
		for (var j = 0, var k = piecesPositionArray[i][1].length; j < k; j++) {
			var newIPos =  piecesPositionArray[i][1][j].i;
			var newJPos = piecesPositionArray[i][1][j].j;
			var newSofg = stateofthegame;
			newSofg[posIpion][posJpion] = 0;
			newSofg[newIPos][newJPos] = nextplayer;
			newBoards.push(newSofg);
		}
	}
	
	return newBoards;
}

function findAllPieces(stateofthegame, color) {
	//var colorToSearch = color;
	var piecesPositionArray = [];
	for (var i = 0; i < 3; i++){
		for (var j = 0; j < 9; j++) {
			if  (stateofthegame[i][j] == color) {
				//check si la piece en question peut bouger ou pas, et si elle peut bouger, sur quelles positions
				myPion = new Pion(i, j);
				var pionPossiblePos = canMove(stateofthegame, myPion);
				if (pionPossiblePos.length != 0) {
					var pieceAvailableToMove = [myPion , pionPossiblePos];
					piecesPositionArray.push(pieceAvailableToMove);
				}
			}
		}
	}
	
	return piecesPositionArray;
}

function canMove(stateofthegame, pion) {
	/*
		Conditions pour savoir si une piece peut bouger
		Si 0 ou 6 : check 3 et +1
		Si 2 ou 8 : check 5 et -1
		Si impair,
		Si i = 0 ou i = 2, check [1][pos], si i = 1, check [0][pos] et [2][pos]
		Si 1 ou 7 : check +1 et -1
		Si 3 ou 5 : check +3 et -3
	*/
	var positionsAvailable = [];
	if (pion.j % 2 == 0) {
		if (pion.j == 0 || pion.j == 6) {
			if (stateofthegame[pion.i][3] == 0) {
				currentPos = new Pion(pion.i, 3);
				positionsAvailable.push(currentPos);
			}
			if (stateofthegame[pion.i][pion.j + 1] == 0) {
				currentPos = new Pion(pion.i, pion.j + 1);
				positionsAvailable.push(currentPos);
			}
		}
		else if (pion.j == 2 || pion.j == 8) {
			if (stateofthegame[pion.i][5] == 0) {
				currentPos = new Pion(pion.i, 5);
				positionsAvailable.push(currentPos);
			}
			if (stateofthegame[pion.i][pion.j - 1] == 0) {
				currentPos = new Pion(pion.i, pion.j - 1);
				positionsAvailable.push(currentPos);
			}
		}
	}
	else {
		if (pion.j == 1 || pion.j == 7) {
			if (stateofthegame[pion.i][pion.j + 1] == 0) {
				currentPos = new Pion(pion.i, pion.j + 1);
				positionsAvailable.push(currentPos);
			}
			if (stateofthegame[pion.i][pion.j - 1] == 0) {
				currentPos = new Pion(pion.i, pion.j - 1);
				positionsAvailable.push(currentPos);
			}
		}
		else if (pion.j == 3 || pion.j == 5) {
			if (stateofthegame[pion.i][pion.j + 3] == 0) {
				currentPos = new Pion(pion.i, pion.j + 3);
				positionsAvailable.push(currentPos);
			}
			if (stateofthegame[pion.i][pion.j - 3] == 0) {
				currentPos = new Pion(pion.i, pion.j - 3);
				positionsAvailable.push(currentPos);
			}
		}
		
		if (pion.i == 0 || pion.i == 2) {
			if (stateofthegame[1][pion.j] == 0) {
				currentPos = new Pion(1, pion.j);
				positionsAvailable.push(currentPos);
			}
		}
		else if (pion.i == 1) {
			if (stateofthegame[0][pion.j] == 0) {
				currentPos = new Pion(0, pion.j);
				positionsAvailable.push(currentPos);
			}
			if (stateofthegame[2][pion.j] == 0) {
				currentPos = new Pion(2, pion.j);
				positionsAvailable.push(currentPos);
			}
		}
	}
	
	return positionsAvailable;

}
