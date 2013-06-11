JDM.Ia = {
    Pion: function (tableau, indice) {
        this.i = tableau;
        this.j = indice;
    },
	Mill: function (pion1, pion2, pion3, player) {
		this.pion1 = pion1;
		this.pion2 = pion2;
		this.pion3 = pion3;
		this.player = player;
	},

    gameCopy: null,
    maxi: 0,
    maxj: 0,
	existingMills: [],
	bestNextSotg: [],

    placePieces: function () {

        // minMax calcule le best move (maxi, maxj) de profondeur 2 (il ne va calculer qu'un coup à l'avance)
        this.minMax(JDM.Board.positions, 2);

        // on met à jour la position du best move
        JDM.Board.positions[this.maxi][this.maxj] = 2;

        // on déplace la pièce sur cette position
        var newPosition = JDM.Board.arrayTranslatePositionToPixel[this.maxi][this.maxj];
        var selectedPiece = JDM.Board.iaPieces.shift();

        JDM.Map.mapContainer.removeChild(selectedPiece);
        JDM.Piece.prototype.draw(newPosition, 2);
    },

    minMax: function (game, depth) {
        // on copie le jeux
        this.gameCopy = game;

        // on commence par calculer max
        this.max(this.gameCopy, depth);
    },

    max: function(gameCopy, depth) {

        if (depth == 0) {
            return this.evaluation(gameCopy);
        }

        var max = -10000;
        var tmp;

        for (var i = 0; i < 3; i++){
            for (var j = 0; j < 9; j++) {
                if (gameCopy[i][j] == 0 && j != 4) {

                    gameCopy[i][j] = 2;

                    tmp = this.min(gameCopy, depth - 1);

                    if (tmp > max) {

                        max = tmp;
                        this.maxi = i;
                        this.maxj = j;
                    }

                    gameCopy[i][j] = 0;
                }
            }
        }

        return max;
    },

    min: function (gameCopy, depth) {

        if (depth == 0) {
            return this.evaluation(gameCopy);
        }

        var min = 10000;
        var tmp;

        for (var i = 0; i < 3; i++){
            for (var j = 0; j < 9; j++) {
                if (gameCopy[i][j] == 0 && j != 4) {

                    gameCopy[i][j] = 1;

                    tmp = this.max(gameCopy, depth - 1);

                    if (tmp < min) {
                        min = tmp;
                    }

                    gameCopy[i][j] = 0;
                }
            }
        }

        return min;
    },

    evaluation: function (gameCopy) {

        var score = 0;

        for (var i = 0; i < 3; i++) {

            // moulin horizontal haut
            if (gameCopy[i][0] == 2 && gameCopy[i][1] == 2 && gameCopy[i][2] == 2) {
                console.log("moulin horizontal haut")
                score += 20;
            }
            else if (gameCopy[i][0] == 1 && gameCopy[i][1] == 1 && gameCopy[i][2] == 1) {
                score -= 20;
            }

            // moulin horizontal bas
            if (gameCopy[i][6] == 2 && gameCopy[i][7] == 2 && gameCopy[i][8] == 2) {
                console.log("moulin horizontal bas")
                score += 20;
            }
            else if (gameCopy[i][6] == 1 && gameCopy[i][7] == 1 && gameCopy[i][8] == 1) {
                score -= 20;
            }

            // moulin vertical gauche
            if (gameCopy[i][0] == 2 && gameCopy[i][3] == 2 && gameCopy[i][6] == 2) {
                console.log("moulin vertical gauche")
                score += 20;
            }
            else if (gameCopy[i][0] == 1 && gameCopy[i][3] == 1 && gameCopy[i][6] == 1) {
                score -= 20;
            }

            // moulin vertical droite
            if (gameCopy[i][2] == 2 && gameCopy[i][5] == 2 && gameCopy[i][8] == 2) {
                console.log("moulin vertical droite")
                score += 20;
            }
            else if (gameCopy[i][2] == 1 && gameCopy[i][5] == 1 && gameCopy[i][8] == 1) {
                score -= 20;
            }
        }

        // Moulin vertical haut
        if (gameCopy[0][1] == 2 && gameCopy[1][1] == 2 && gameCopy[2][1] == 2){
            console.log('moulin vertical haut')
            score += 20;
        } else if (gameCopy[0][1] == 1 && gameCopy[1][1] == 1 && gameCopy[2][1] == 1){
            score -= 20;
        }

         // Moulin vertical bas
        if (gameCopy[0][7] == 2 && gameCopy[1][7] == 2 && gameCopy[2][7] == 2){
            console.log('moulin vertical bas')
            score += 20;
        } else if (gameCopy[0][7] == 1 && gameCopy[1][7] == 1 && gameCopy[2][7] == 1){
            score -= 20;
        }

        // Moulin horizontal gauche
        if (gameCopy[0][3] == 2 && gameCopy[1][3] == 2 && gameCopy[2][3] == 2){
            console.log('moulin horizontal gauche')
            score += 20;
        } else if (gameCopy[0][3] == 1 && gameCopy[1][3] == 1 && gameCopy[2][3] == 1){
            score -= 20;
        }

        // Moulin horizontal droite
        if (gameCopy[0][5] == 2 && gameCopy[1][5] == 2 && gameCopy[2][5] == 2){
            console.log('moulin horizontal droite')
            score += 20;
        } else  if (gameCopy[0][5] == 1 && gameCopy[1][5] == 1 && gameCopy[2][5] == 1){
            score -= 20;
        }

        return score;
    },

    nextMoves: function (stateofthegame, nextplayer) {
        var newBoards = [];
        var piecesPositionArray = this.findAllPieces(stateofthegame, nextplayer);
        for (var i = 0, l = piecesPositionArray.length; i < l; i++) {
            //recopier l'etat de jeu actuel, et effectuer les changements
            var posIpion = piecesPositionArray[i][0].i;
            var posJpion = piecesPositionArray[i][0].j;

            for (var j = 0, k = piecesPositionArray[i][1].length; j < k; j++) {
                var newIPos =  piecesPositionArray[i][1][j].i;
                var newJPos = piecesPositionArray[i][1][j].j;
                var newSofg = stateofthegame;
                newSofg[posIpion][posJpion] = 0;
                newSofg[newIPos][newJPos] = nextplayer;
                newBoards.push(newSofg);
            }
        }

        return newBoards;
    },

    findAllPieces: function (stateofthegame, color) {
        //var colorToSearch = color;
        var piecesPositionArray = [];
        for (var i = 0; i < 3; i++){
            for (var j = 0; j < 9; j++) {
                if (stateofthegame[i][j] == color) {
                    //check si la piece en question peut bouger ou pas, et si elle peut bouger, sur quelles positions
                    myPion = new this.Pion(i, j);
                    var pionPossiblePos = this.canMove(stateofthegame, myPion);
                    if (pionPossiblePos.length != 0) {
                        var pieceAvailableToMove = [myPion , pionPossiblePos];
                        piecesPositionArray.push(pieceAvailableToMove);
                    }
                }
            }
        }

        return piecesPositionArray;
    },

    canMove: function (stateofthegame, pion) {
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
                    currentPos = new this.Pion(pion.i, 3);
                    positionsAvailable.push(currentPos);
                }
                if (stateofthegame[pion.i][pion.j + 1] == 0) {
                    currentPos = new this.Pion(pion.i, pion.j + 1);
                    positionsAvailable.push(currentPos);
                }
            }
            else if (pion.j == 2 || pion.j == 8) {
                if (stateofthegame[pion.i][5] == 0) {
                    currentPos = new this.Pion(pion.i, 5);
                    positionsAvailable.push(currentPos);
                }
                if (stateofthegame[pion.i][pion.j - 1] == 0) {
                    currentPos = new this.Pion(pion.i, pion.j - 1);
                    positionsAvailable.push(currentPos);
                }
            }
        }
        else {
            if (pion.j == 1 || pion.j == 7) {
                if (stateofthegame[pion.i][pion.j + 1] == 0) {
                    currentPos = new this.Pion(pion.i, pion.j + 1);
                    positionsAvailable.push(currentPos);
                }
                if (stateofthegame[pion.i][pion.j - 1] == 0) {
                    currentPos = new this.Pion(pion.i, pion.j - 1);
                    positionsAvailable.push(currentPos);
                }
            }
            else if (pion.j == 3 || pion.j == 5) {
                if (stateofthegame[pion.i][pion.j + 3] == 0) {
                    currentPos = new this.Pion(pion.i, pion.j + 3);
                    positionsAvailable.push(currentPos);
                }
                if (stateofthegame[pion.i][pion.j - 3] == 0) {
                    currentPos = new this.Pion(pion.i, pion.j - 3);
                    positionsAvailable.push(currentPos);
                }
            }

            if (pion.i == 0 || pion.i == 2) {
                if (stateofthegame[1][pion.j] == 0) {
                    currentPos = new this.Pion(1, pion.j);
                    positionsAvailable.push(currentPos);
                }
            }
            else if (pion.i == 1) {
                if (stateofthegame[0][pion.j] == 0) {
                    currentPos = new this.Pion(0, pion.j);
                    positionsAvailable.push(currentPos);
                }
                if (stateofthegame[2][pion.j] == 0) {
                    currentPos = new this.Pion(2, pion.j);
                    positionsAvailable.push(currentPos);
                }
            }
        }

        return positionsAvailable;
    },
	
	findMills: function (stateofthegame) {
	
		var mills = [];
		for (var i = 0; i < 3; i++) {
		
            // moulin horizontal haut
            if (stateofthegame[i][0] == 2 && stateofthegame[i][1] == 2 && stateofthegame[i][2] == 2) {
				mill = new this.Mill(new this.Pion(i, 0), new this.Pion(i, 1), new this.Pion(i, 2), 2);
				mills.push(mill)
            }
            else if (stateofthegame[i][0] == 1 && stateofthegame[i][1] == 1 && stateofthegame[i][2] == 1) {
                mill = new this.Mill(new this.Pion(i, 0), new this.Pion(i, 1), new this.Pion(i, 2), 1);
				mills.push(mill)
            }

            // moulin horizontal bas
            if (stateofthegame[i][6] == 2 && stateofthegame[i][7] == 2 && stateofthegame[i][8] == 2) {
                mill = new this.Mill(new this.Pion(i, 6), new this.Pion(i, 7), new this.Pion(i, 8), 2);
				mills.push(mill)
            }
            else if (stateofthegame[i][6] == 1 && stateofthegame[i][7] == 1 && stateofthegame[i][8] == 1) {
                mill = new this.Mill(new this.Pion(i, 6), new this.Pion(i, 7), new this.Pion(i, 8), 1);
				mills.push(mill)
            }

            // moulin vertical gauche
            if (stateofthegame[i][0] == 2 && stateofthegame[i][3] == 2 && stateofthegame[i][6] == 2) {
                mill = new this.Mill(new this.Pion(i, 0), new this.Pion(i, 3), new this.Pion(i, 6), 2);
				mills.push(mill)
            }
            else if (stateofthegame[i][0] == 1 && stateofthegame[i][3] == 1 && stateofthegame[i][6] == 1) {
                mill = new this.Mill(new this.Pion(i, 0), new this.Pion(i, 3), new this.Pion(i, 6), 1);
				mills.push(mill)
            }

            // moulin vertical droite
            if (stateofthegame[i][2] == 2 && stateofthegame[i][5] == 2 && stateofthegame[i][8] == 2) {
                mill = new this.Mill(new this.Pion(i, 2), new this.Pion(i, 5), new this.Pion(i, 8), 2);
				mills.push(mill)
            }
            else if (stateofthegame[i][2] == 1 && stateofthegame[i][5] == 1 && stateofthegame[i][8] == 1) {
                mill = new this.Mill(new this.Pion(i, 2), new this.Pion(i, 5), new this.Pion(i, 8), 1);
				mills.push(mill)
            }
        }

        // Moulin vertical haut
        if (stateofthegame[0][1] == 2 && stateofthegame[1][1] == 2 && stateofthegame[2][1] == 2){
            mill = new this.Mill(new this.Pion(0, 1), new this.Pion(1, 1), new this.Pion(2, 1), 2);
			mills.push(mill)
        } 
		else if (stateofthegame[0][1] == 1 && stateofthegame[1][1] == 1 && stateofthegame[2][1] == 1){
            mill = new this.Mill(new this.Pion(0, 1), new this.Pion(1, 1), new this.Pion(2, 1), 1);
			mills.push(mill)
        }

         // Moulin vertical bas
        if (stateofthegame[0][7] == 2 && stateofthegame[1][7] == 2 && stateofthegame[2][7] == 2){
            mill = new this.Mill(new this.Pion(0, 7), new this.Pion(1, 7), new this.Pion(2, 7), 2);
			mills.push(mill)
        } 
		else if (stateofthegame[0][7] == 1 && stateofthegame[1][7] == 1 && stateofthegame[2][7] == 1){
			mill = new this.Mill(new this.Pion(0, 7), new this.Pion(1, 7), new this.Pion(2, 7), 1);
			mills.push(mill)
        }

        // Moulin horizontal gauche
        if (stateofthegame[0][3] == 2 && stateofthegame[1][3] == 2 && stateofthegame[2][3] == 2){
            mill = new this.Mill(new this.Pion(0, 3), new this.Pion(1, 3), new this.Pion(2, 3), 2);
			mills.push(mill)
        } 
		else if (stateofthegame[0][3] == 1 && stateofthegame[1][3] == 1 && stateofthegame[2][3] == 1){
            mill = new this.Mill(new this.Pion(0, 3), new this.Pion(1, 3), new this.Pion(2, 3), 1);
			mills.push(mill)
        }

        // Moulin horizontal droite
        if (stateofthegame[0][5] == 2 && stateofthegame[1][5] == 2 && stateofthegame[2][5] == 2){
            mill = new this.Mill(new this.Pion(0, 5), new this.Pion(1, 5), new this.Pion(2, 5), 2);
			mills.push(mill)
        } 
		else if (gameCopy[0][5] == 1 && gameCopy[1][5] == 1 && gameCopy[2][5] == 1){
            mill = new this.Mill(new this.Pion(0, 5), new this.Pion(1, 5), new this.Pion(2, 5), 1);
			mills.push(mill)
        }
		
		return mills;
	},
	
	isExistingMill: function (mill) {
		var result = false;
		
		for (var i = 0, l = existingMills.length; i < l ; i++) {
			if (pionEquals(existingMills[i].pion1, mill.pion1) && pionEquals(existingMills[i].pion2, mill.pion2) && pionEquals(existingMills[i].pion3, mill.pion3)) {
				return true;
			}
		}
		
		return result;
	},
	
	pionEquals: function (pion1, pion2) {
		if (pion1.i == pion2.i && pion1.j == pion2.j) {
			return true;
		}
		else {
			return false;
		}
	},

	bestNextMove: function (stateofthegame, player) {
		bestNextSotg = [];
		maxPhase2(stateofthegame, 4);
		var i = Math.random() * 10;
		return bestNextSotg[i];
	},
	
	maxPhase2: function (stateofthegame, depth) {
		if (depth == 0) {
            return this.mapScore(stateofthegame);
        }

        var max = -10000;
        var tmp;
		var possibleSotg = nextMoves(stateofthegame, 2)

		for (var i = 0, l = possibleSotg.length; i < l; i++) {
			tmp = this.minPhase2(possibleSotg[i], depth - 1);
			if (tmp >= max) {
				max = tmp;
				bestNextSotg.push(possibleSotg[i]);
			}
		}
                
        return max;
	},
	
	minPhase2: function (stateofthegame, depth) {
		if (depth == 0) {
            return this.mapScore(stateofthegame);
        }

        var min = 10000;
        var tmp;
		var possibleSotg = nextMoves(stateofthegame, 1)

		for (var i = 0, l = possibleSotg.length; i < l; i++) {
			tmp = this.maxPhase2(possibleSotg[i], depth - 1);
			if (tmp < min) {
				min = tmp;
			}
		}
	
        return min;
	},
	
	mapScore: function (stateofthegame) {
		var mills = findMills(stateofthegame);
		var numberOfIaMills = 0;
		var numberOfHumanMills = 0;
		
		for (var i = 0, l = mills.length; i < l; i++) {
			if (mills[i].player == 1) {
				numberOfHumanMills += 1;
			}
			else if (mills[i].player == 2 {
				numberOfIaMills += 1;
			}
		}
		
		var iaPieces = countPieces(stateofthegame, 2);
		var humanPieces = countPieces(stateofthegame, 1);
		var iaFixedPieces = 0;
		var humanFixedPieces = 0;
		var iaAdjPieces = 0;
		var humanAdjPieces = 0;
		for (var i = 0, l = iaPieces.length; i < l; i++) {
			//regarder les pieces bloquees (fixed) et le nombre de pieces adjacentes
			var isMovable = canMove(stateofthegame, iaPieces[i]);
			if (isMovable.length == 0) {
				iaFixedPieces += 1
			}
			for (var j = 0, k = iaPieces.length; j < k; j++) {
				if (j != i) {
					if (pieceNextTo(iaPieces[i], iaPieces[j])) {
						iaAdjPieces += 1;
					}
				}
			}
		}
		
		for (var i = 0; l = humanPieces.length; i < l; i++) {
			var isMovable = canMove(stateofthegame, humanPieces[i]);
			if (isMovable.length == 0) {
				humanFixedPieces += 1
			}
			for (var j = 0, k = humanPieces.length; j < k; j++) {
				if (j != i) {
					if (pieceNextTo(humanPieces[i], humanPieces[j])) {
						humanAdjPieces += 1;
					}
				}
			}
		}
	},
	
	countPieces: function (stateofthegame, color) {
        var piecesArray = [];
        for (var i = 0; i < 3; i++){
            for (var j = 0; j < 9; j++) {
                if (stateofthegame[i][j] == color) {
                    myPion = new this.Pion(i, j);
                    piecesArray.push(pieceAvailableToMove);    
                }
            }
        }
	
		return piecesArray;	
	},
	
	pieceNextTo: function (pion1, pion2) {
		if (pion1.j % 2 == 0) {
			if (pion1.i == pion2.i) {
				if (pion1.j == 0) {
					if (pion2.j == 1 || pion2.j == 3) {
						return true;
					}
				}
				else if (pion1.j == 2) {
					if (pion2.j == 1 || pion2.j == 5) {
						return true;
					}
				}
				else if (pion1.j == 6) {
					if (pion2.j == 3 || pion2.j == 7) {
						return true;
					}
				}
				else if (pion1.j == 8) {
					if (pion2.j == 5 || pion2.j == 7) {
						return true;
					}
				}
				
				return false;
			}
			
			return false;
		}
		else {
			if (pion1.i == pion2.i) {
				if (pion1.j == 1) {
					if (pion2.j == 0 || pion2.j == 2) {
						return true;
					}
				}
				else if (pion1.j == 3) {
					if (pion2.j == 0 || pion2.j == 6) {
						return true;
					}
				}
				else if (pion1.j == 5) {
					if (pion2.j == 2 || pion2.j == 8) {
						return true;
					}
				}
				else if (pion1.j == 7) {
					if (pion2.j == 6 || pion2.j == 8) {
						return true;
					}
				}
				
				return false;
			}
			else if (pion1.i == 0 || pion1.i == 2) {
				if (pion2.i == 1 && pion1.j == pion2.j) {
					return true;
				}
				
				return false;
			}
			else if (pion1.i == 1) {
				if ((pion2.i == 0 || pion2.i == 2) && pion1.j == pion2.j) {
					return true;
				}
				
				return false;
			}
			
			return false;
		}
	},
}

