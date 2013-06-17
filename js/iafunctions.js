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
    bestMove: [],
    existingMills: [],
	bestNextMoves : [],
    bestNextSotg: null,

    iaPlay: function() {
        console.log('IA play');
        if (JDM.step == 1 && JDM.turn == 2 && !JDM.deletePiece) {
            console.log('IA place');
            this.placePieces(function() {
                // on décremente le nombre de pieces à poser
                var mills = JDM.Ia.findMills(JDM.Board.positions);

                JDM.Ia.checkMills(mills, 2);

                if (JDM.deletePiece) {
                    JDM.Ia.deletePieces();
                } else {
                    JDM.turn = 1;
                }

                JDM.piecesToPlace -= 1;

                if (JDM.piecesToPlace == 0) {
                    JDM.step = 2;
                    JDM.turn = 1;
                    console.log('step', JDM.step, 'turn', JDM.turn, 'delete', JDM.deletePiece)
                }
            });
        }

        if (JDM.step == 2 && JDM.turn == 2 && !JDM.deletePiece) {
            console.log('IA move');
            this.movePiece(function() {
                var mills = JDM.Ia.findMills(JDM.Board.positions);

                JDM.Ia.checkMills(mills, 2);

                JDM.Ia.checkRemainingPiece();

                if (JDM.deletePiece) {
                    JDM.Ia.deletePieces();
                } else {
                    JDM.turn = 1;
                }
            });
        }
    },

    movePiece: function(callback) {
        JDM.Board.positions = this.bestNextMove(JDM.Board.positions);

        setTimeout(function() {
            JDM.Board.drawGame();
            callback();
        }, 1000);
    },

    deletePieces: function() {
        console.log('IA delete');
        if (JDM.turn == 2 && JDM.deletePiece) {
            JDM.update = true;
            var gameCopy = JDM.Board.positions;

            this.maxDelete(gameCopy, 1);
            JDM.Board.positions[this.bestMove.i][this.bestMove.j] = 0;

            JDM.Ia.checkRemainingPiece();

            setTimeout(function() {
                JDM.Board.drawGame();
                JDM.turn = 1;
                JDM.deletePiece = false;
            }, 1000);
        }
    },

    placePieces: function(callback) {
        // minMax calcule le best move (maxi, maxj) de profondeur 2 (il ne va calculer qu'un coup à l'avance)
        this.minMax(JDM.Board.positions, 2);

        // on met à jour la position du best move
        JDM.Board.positions[this.bestMove.i][this.bestMove.j] = 2;

        // on déplace la pièce sur cette position
        var newPosition = JDM.Board.arrayTranslatePositionToPixel[this.bestMove.i][this.bestMove.j];
        var selectedPiece = JDM.Board.iaPieces.shift();

        // on met à zero le tableau
        this.bestMove = [];

        JDM.Board.piecesToPlaceContainer.removeChild(selectedPiece);

        setTimeout(function() {
            JDM.Board.drawGame();
            callback();
        }, 1000);
    },

    nextMovesPhase3: function(stateofthegame, nextplayer) {
        var newBoards = [];
        var piecesPositionArray = this.findAllPiecesPhase3(stateofthegame, nextplayer);
        for (var i = 0, l = piecesPositionArray.length; i < l; i++) {
            //recopier l'etat de jeu actuel, et effectuer les changements
            var posIpion = piecesPositionArray[i][0].i;
            var posJpion = piecesPositionArray[i][0].j;

            for (var j = 0, k = piecesPositionArray[i][1].length; j < k; j++) {
                var newIPos =  piecesPositionArray[i][1][j].i;
                var newJPos = piecesPositionArray[i][1][j].j;
                var newSofg = [];
                newSofg = JSON.parse(JSON.stringify(stateofthegame));
                newSofg[posIpion][posJpion] = 0;
                newSofg[newIPos][newJPos] = nextplayer;
                //console.log(posIpion + ' ' + posJpion + ' = 0');
                //console.log(newIPos + ' ' + newJPos + ' = ' + nextplayer);
                newBoards.push(newSofg);
            }
        }
        return newBoards;
    },

    findAllPiecesPhase3: function(stateofthegame, color) {
        var piecesPositionArray = [];
        var openPositions = [];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 9; j++) {
                if (stateofthegame[i][j] == 0) {
                    var openPion = new this.Pion(i, j);
                    openPositions.push(openPion);
                }
            }
        }
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 9; j++) {
                if (stateofthegame[i][j] == color) {
                    var myPion = new this.Pion(i, j);
                    var pieceAvailableToMove = [myPion , openPositions];
                    piecesPositionArray.push(pieceAvailableToMove);
                }
            }
        }
        return piecesPositionArray;
    },


    isPieceInMills: function(currentPiece, player) {

        // si le pion courrant ne fait pas parti d'un moulin, on peut l'effacer
        for (var k = 0, l = this.existingMills.length; k < l ; k++) {
            if (this.existingMills[k].player == player) {
                // si le pion testé fait parti d'un moulin
                if (this.pionEquals(this.existingMills[k].pion1, currentPiece) || this.pionEquals(this.existingMills[k].pion2, currentPiece) || this.pionEquals(this.existingMills[k].pion3, currentPiece)) {
                    return true;
                }
            }
        }

        return false;
    },

    maxDelete: function(gameCopy, depth) {
        var max = -10000;
        var tmp;

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 9; j++) {

                // Le joueur 2 (IA) efface une piece du joueur 1
                if (gameCopy[i][j] == 1 && j != 4) {

                    var currentPiece = new this.Pion(i, j);
                    // si le pion courrant ne fait pas parti d'un moulin, on peut l'effacer

                    if (!this.isPieceInMills(currentPiece, 1)) {
                        // console.log('current piece', currentPiece);

                        gameCopy[i][j] = 0;
                        tmp = this.minDelete(gameCopy, depth - 1);

                        if (tmp > max) {
                            max = tmp;
                            this.bestMove = ({i: i, j: j, score: tmp});
                        }

                        gameCopy[i][j] = 1;
                    }
                }
            }
        }

        return max;
    },

    minDelete: function(gameCopy, depth) {
        if (depth == 0) {
            return this.mapScore(gameCopy);
        }
    },

    minMax: function (game, depth) {
        // on copie le jeux
        this.gameCopy = game;

        // on commence par calculer max
        this.max(this.gameCopy, depth);
    },

    max: function(gameCopy, depth) {
        if (depth == 0) {
            return this.mapScore(gameCopy);
        }

        var max = -10000;
        var tmp;

        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 9; j++) {
                if (gameCopy[i][j] == 0 && j != 4) {

                    gameCopy[i][j] = 2;
                    tmp = this.min(gameCopy, depth - 1);

                    if (tmp > max) {
                        max = tmp;
                        this.bestMove = ({i: i, j: j, score: tmp});
                    }

                    gameCopy[i][j] = 0;
                }
            }
        }

        return max;
    },

    min: function(gameCopy, depth) {
        if (depth == 0) {
            return this.evaluation(gameCopy);
        }

        var min = 10000;
        var tmp;

        for (var i = 0; i < 3; i++) {
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
                // console.log("moulin horizontal haut")
                score += 20;
            } else if (gameCopy[i][0] == 1 && gameCopy[i][1] == 1 && gameCopy[i][2] == 1) {
                score -= 20;
            }

            // moulin horizontal bas
            if (gameCopy[i][6] == 2 && gameCopy[i][7] == 2 && gameCopy[i][8] == 2) {
                // console.log("moulin horizontal bas")
                score += 20;
            } else if (gameCopy[i][6] == 1 && gameCopy[i][7] == 1 && gameCopy[i][8] == 1) {
                score -= 20;
            }

            // moulin vertical gauche
            if (gameCopy[i][0] == 2 && gameCopy[i][3] == 2 && gameCopy[i][6] == 2) {
                // console.log("moulin vertical gauche")
                score += 20;
            } else if (gameCopy[i][0] == 1 && gameCopy[i][3] == 1 && gameCopy[i][6] == 1) {
                score -= 20;
            }

            // moulin vertical droite
            if (gameCopy[i][2] == 2 && gameCopy[i][5] == 2 && gameCopy[i][8] == 2) {
                // console.log("moulin vertical droite")
                score += 20;
            } else if (gameCopy[i][2] == 1 && gameCopy[i][5] == 1 && gameCopy[i][8] == 1) {
                score -= 20;
            }
        }

        // Moulin vertical haut
        if (gameCopy[0][1] == 2 && gameCopy[1][1] == 2 && gameCopy[2][1] == 2) {
            // console.log('moulin vertical haut')
            score += 20;
        } else if (gameCopy[0][1] == 1 && gameCopy[1][1] == 1 && gameCopy[2][1] == 1) {
            score -= 20;
        }

         // Moulin vertical bas
        if (gameCopy[0][7] == 2 && gameCopy[1][7] == 2 && gameCopy[2][7] == 2) {
            // console.log('moulin vertical bas')
            score += 20;
        } else if (gameCopy[0][7] == 1 && gameCopy[1][7] == 1 && gameCopy[2][7] == 1) {
            score -= 20;
        }

        // Moulin horizontal gauche
        if (gameCopy[0][3] == 2 && gameCopy[1][3] == 2 && gameCopy[2][3] == 2) {
            // console.log('moulin horizontal gauche')
            score += 20;
        } else if (gameCopy[0][3] == 1 && gameCopy[1][3] == 1 && gameCopy[2][3] == 1) {
            score -= 20;
        }

        // Moulin horizontal droite
        if (gameCopy[0][5] == 2 && gameCopy[1][5] == 2 && gameCopy[2][5] == 2) {
            // console.log('moulin horizontal droite')
            score += 20;
        } else if (gameCopy[0][5] == 1 && gameCopy[1][5] == 1 && gameCopy[2][5] == 1) {
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
				var newSofg = [];
				newSofg = JSON.parse(JSON.stringify(stateofthegame));
                newSofg[posIpion][posJpion] = 0;
                newSofg[newIPos][newJPos] = nextplayer;
				//console.log(posIpion + ' ' + posJpion + ' = 0');
                //console.log(newIPos + ' ' + newJPos + ' = ' + nextplayer);
                newBoards.push(newSofg);
			}
        }
        return newBoards;
    },

    findAllPieces: function (stateofthegame, color) {
        //var colorToSearch = color;
        var piecesPositionArray = [];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 9; j++) {
                if (stateofthegame[i][j] == color) {
                    //check si la piece en question peut bouger ou pas, et si elle peut bouger, sur quelles positions
                    var myPion = new this.Pion(i, j);
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
        } else {
            if (pion.j == 1 || pion.j == 7) {
                if (stateofthegame[pion.i][pion.j + 1] == 0) {
                    currentPos = new this.Pion(pion.i, pion.j + 1);
                    positionsAvailable.push(currentPos);
                }
                if (stateofthegame[pion.i][pion.j - 1] == 0) {
                    currentPos = new this.Pion(pion.i, pion.j - 1);
                    positionsAvailable.push(currentPos);
                }
            } else if (pion.j == 3 || pion.j == 5) {
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
            } else if (pion.i == 1) {
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
				mills.push(mill);
            } else if (stateofthegame[i][0] == 1 && stateofthegame[i][1] == 1 && stateofthegame[i][2] == 1) {
                mill = new this.Mill(new this.Pion(i, 0), new this.Pion(i, 1), new this.Pion(i, 2), 1);
				mills.push(mill);
            }

            // moulin horizontal bas
            if (stateofthegame[i][6] == 2 && stateofthegame[i][7] == 2 && stateofthegame[i][8] == 2) {
                mill = new this.Mill(new this.Pion(i, 6), new this.Pion(i, 7), new this.Pion(i, 8), 2);
				mills.push(mill);
            } else if (stateofthegame[i][6] == 1 && stateofthegame[i][7] == 1 && stateofthegame[i][8] == 1) {
                mill = new this.Mill(new this.Pion(i, 6), new this.Pion(i, 7), new this.Pion(i, 8), 1);
				mills.push(mill);
            }

            // moulin vertical gauche
            if (stateofthegame[i][0] == 2 && stateofthegame[i][3] == 2 && stateofthegame[i][6] == 2) {
                mill = new this.Mill(new this.Pion(i, 0), new this.Pion(i, 3), new this.Pion(i, 6), 2);
				mills.push(mill);
            } else if (stateofthegame[i][0] == 1 && stateofthegame[i][3] == 1 && stateofthegame[i][6] == 1) {
                mill = new this.Mill(new this.Pion(i, 0), new this.Pion(i, 3), new this.Pion(i, 6), 1);
				mills.push(mill);
            }

            // moulin vertical droite
            if (stateofthegame[i][2] == 2 && stateofthegame[i][5] == 2 && stateofthegame[i][8] == 2) {
                mill = new this.Mill(new this.Pion(i, 2), new this.Pion(i, 5), new this.Pion(i, 8), 2);
				mills.push(mill);
            } else if (stateofthegame[i][2] == 1 && stateofthegame[i][5] == 1 && stateofthegame[i][8] == 1) {
                mill = new this.Mill(new this.Pion(i, 2), new this.Pion(i, 5), new this.Pion(i, 8), 1);
				mills.push(mill);
            }
        }

        // Moulin vertical haut
        if (stateofthegame[0][1] == 2 && stateofthegame[1][1] == 2 && stateofthegame[2][1] == 2) {
            mill = new this.Mill(new this.Pion(0, 1), new this.Pion(1, 1), new this.Pion(2, 1), 2);
			mills.push(mill)
        } else if (stateofthegame[0][1] == 1 && stateofthegame[1][1] == 1 && stateofthegame[2][1] == 1) {
            mill = new this.Mill(new this.Pion(0, 1), new this.Pion(1, 1), new this.Pion(2, 1), 1);
			mills.push(mill);
        }

         // Moulin vertical bas
        if (stateofthegame[0][7] == 2 && stateofthegame[1][7] == 2 && stateofthegame[2][7] == 2) {
            mill = new this.Mill(new this.Pion(0, 7), new this.Pion(1, 7), new this.Pion(2, 7), 2);
			mills.push(mill);
        } 
		else if (stateofthegame[0][7] == 1 && stateofthegame[1][7] == 1 && stateofthegame[2][7] == 1) {
			mill = new this.Mill(new this.Pion(0, 7), new this.Pion(1, 7), new this.Pion(2, 7), 1);
			mills.push(mill);
        }

        // Moulin horizontal gauche
        if (stateofthegame[0][3] == 2 && stateofthegame[1][3] == 2 && stateofthegame[2][3] == 2) {
            mill = new this.Mill(new this.Pion(0, 3), new this.Pion(1, 3), new this.Pion(2, 3), 2);
			mills.push(mill);
        } else if (stateofthegame[0][3] == 1 && stateofthegame[1][3] == 1 && stateofthegame[2][3] == 1) {
            mill = new this.Mill(new this.Pion(0, 3), new this.Pion(1, 3), new this.Pion(2, 3), 1);
			mills.push(mill);
        }

        // Moulin horizontal droite
        if (stateofthegame[0][5] == 2 && stateofthegame[1][5] == 2 && stateofthegame[2][5] == 2) {
            mill = new this.Mill(new this.Pion(0, 5), new this.Pion(1, 5), new this.Pion(2, 5), 2);
			mills.push(mill);
        } else if (stateofthegame[0][5] == 1 && stateofthegame[1][5] == 1 && stateofthegame[2][5] == 1) {
            mill = new this.Mill(new this.Pion(0, 5), new this.Pion(1, 5), new this.Pion(2, 5), 1);
			mills.push(mill);
        }
		
		return mills;
	},
	
	isExistingMill: function (mill) {
		var result = false;
		
		for (var i = 0, l = this.existingMills.length; i < l ; i++) {
			if (this.pionEquals(this.existingMills[i].pion1, mill.pion1) && this.pionEquals(this.existingMills[i].pion2, mill.pion2) && this.pionEquals(this.existingMills[i].pion3, mill.pion3)) {
				return true;
			}
		}
		
		return result;
	},

    checkMills: function(mills, player) {
        // on check les moulins
        for (var i = 0, l = mills.length; i < l ; i++) {
            if (!this.isExistingMill(mills[i])) {
                if (mills[i].player == player) {
                    // on met la phase du jeu => delete
                    JDM.deletePiece = true;
                }
            }
        }
        // on met a jour le tableau des mills existant
        this.existingMills = mills;
    },
	
	pionEquals: function (pion1, pion2) {
		if (pion1.i == pion2.i && pion1.j == pion2.j) {
			return true;
		}

		return false;
	},

	bestNextMove: function (stateofthegame) {

		this.bestNextSotg = null;
		this.bestNextMoves = [];
        if (!JDM.flying.ia) {
		    this.maxPhase2(stateofthegame, 4);
        } else {
            this.maxFly(stateofthegame, 4);
        }

			var maxScoreMoves = [];
            var maxScore = 0;
			for (var i = 0, l = this.bestNextMoves.length; i < l; i++) {
				if (i == 0) {
					maxScore = this.bestNextMoves[i][1];
				}
				else {
					if (this.bestNextMoves[i][1] >= maxScore) {
						maxScoreMoves.push(this.bestNextMoves[i][0]);
					}
				}
			}
			if (this.bestNextMoves[0][1] >= maxScore) {
				maxScoreMoves.push(this.bestNextMoves[0][0]);
			}
			this.bestNextSotg = maxScoreMoves[Math.floor(Math.random()*maxScoreMoves.length)];
			return this.bestNextSotg;
	},

	maxPhase2: function (stateofthegame, depth) {
		if (depth == 0) {
            return this.mapScore(stateofthegame);
        }

        var max = -10000;
        var tmp;
		var possibleSotg = this.nextMoves(stateofthegame, 2)

		for (var i = 0, l = possibleSotg.length; i < l; i++) {
			tmp = this.minPhase2(possibleSotg[i], depth - 1);
			if (tmp >= max) {
				max = tmp;
                if (depth == 4) {
				    var tmpArray = [possibleSotg[i], tmp];
                    this.bestNextMoves.push(tmpArray);
					//this.bestNextSotg = possibleSotg[i];
                }
			}
		}
                
        return max;
	},
	
	minPhase2: function (stateofthegame, depth) {
		if (depth == 0) {
            return this.mapScore(stateofthegame);
        }

        var min = 100000;
        var tmp;
		var possibleSotg = this.nextMoves(stateofthegame, 1);

		for (var i = 0, l = possibleSotg.length; i < l; i++) {
			tmp = this.maxPhase2(possibleSotg[i], depth - 1);
			if (tmp < min) {
				min = tmp;
			}
		}
	
        return min;
	},

    maxFly: function (stateofthegame, depth) {
        if (depth == 0) {
            return this.mapScore(stateofthegame);
        }

        var max = -100000;
        var tmp;
        var possibleSotg = this.nextMovesPhase3(JDM.Board.positions, 2);

        for (var i = 0, l = possibleSotg.length; i < l; i++) {
            tmp = this.minPhase2(possibleSotg[i], depth - 1);
            if (tmp >= max) {
                max = tmp;
                if (depth == 4) {
                    var tmpArray = [possibleSotg[i], tmp];
                    this.bestNextMoves.push(tmpArray);
					//this.bestNextSotg = possibleSotg[i];
                }
            }
        }

        return max;
    },

    minFly: function (stateofthegame, depth) {
        if (depth == 0) {
            return this.mapScore(stateofthegame);
        }

        var min = 10000;
        var tmp;
        var possibleSotg = this.nextMovesPhase3(JDM.Board.positions, 2);

        for (var i = 0, l = possibleSotg.length; i < l; i++) {
            tmp = this.maxPhase2(possibleSotg[i], depth - 1);
            if (tmp < min) {
                min = tmp;
            }
        }

        return min;
    },
	
	mapScore: function (stateofthegame) {
		var mills = this.findMills(stateofthegame);
		var score = 0;
		var numberOfIaMills = 0;
		var numberOfHumanMills = 0;
		
		for (var i = 0, l = mills.length; i < l; i++) {
			if (mills[i].player == 1) {
				numberOfHumanMills += 1;
			} else if (mills[i].player == 2) {
				numberOfIaMills += 1;
			}
		}
		
		var iaPieces = this.countPieces(stateofthegame, 2);
		var humanPieces = this.countPieces(stateofthegame, 1);
		var iaFixedPieces = 0;
		var humanFixedPieces = 0;
		var iaAdjPieces = 0;
		var humanAdjPieces = 0;
		for (var i = 0, l = iaPieces.length; i < l; i++) {
			//regarder les pieces bloquees (fixed) et le nombre de pieces adjacentes
			var isMovable = this.canMove(stateofthegame, iaPieces[i]);
			if (isMovable.length == 0) {
				iaFixedPieces += 1
			}
			for (var j = 0, k = iaPieces.length; j < k; j++) {
				if (j != i) {
					if (this.pieceNextTo(iaPieces[i], iaPieces[j])) {
						iaAdjPieces += 1;
					}
				}
			}
		}
		
		for (var i = 0, l = humanPieces.length; i < l; i++) {
			var isMovable = this.canMove(stateofthegame, humanPieces[i]);
			if (isMovable.length == 0) {
				humanFixedPieces += 1
			}
			for (var j = 0, k = humanPieces.length; j < k; j++) {
				if (j != i) {
					if (this.pieceNextTo(humanPieces[i], humanPieces[j])) {
						humanAdjPieces += 1;
					}
				}
			}
		}
		
		score += (numberOfIaMills * 115);
		score -= (numberOfHumanMills * 100);
		score -= (iaFixedPieces * 5);
		score += (humanFixedPieces * 5);
		score += (iaAdjPieces * 1);
		score -= (humanAdjPieces * 1);
		
		return score;
	},
	
	countPieces: function (stateofthegame, color) {
        var piecesArray = [];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 9; j++) {
                if (stateofthegame[i][j] == color) {
                    var myPion = new this.Pion(i, j);
                    piecesArray.push(myPion);
                }
            }
        }
	
		return piecesArray;	
	},

    checkRemainingPiece: function() {
        if (JDM.step == 2 || JDM.step == 3) {

            var HumanRemainingPieces = JDM.Ia.countPieces(JDM.Board.positions, 1);
            var IAremainingPieces = JDM.Ia.countPieces(JDM.Board.positions, 2);

            console.log('Human remaining piece:', HumanRemainingPieces.length)
            console.log('IA remaining piece:', IAremainingPieces.length)

            if (IAremainingPieces.length == 3) {
                JDM.flying.ia = true;
            }

            if (HumanRemainingPieces.length == 3) {
                JDM.flying.human = true;
            }

            if (IAremainingPieces.length == 2) {
                JDM.winner = 1;
                JDM.step = 4;
            }
            if (HumanRemainingPieces.length == 2) {
                JDM.winner = 2;
                JDM.step = 4;
            }

            JDM.update = true;
        }
    },
	
	pieceNextTo: function (pion1, pion2) {
		if (pion1.j % 2 == 0) {
			if (pion1.i == pion2.i) {
				if (pion1.j == 0) {
					if (pion2.j == 1 || pion2.j == 3) {
						return true;
					}
				} else if (pion1.j == 2) {
					if (pion2.j == 1 || pion2.j == 5) {
						return true;
					}
				} else if (pion1.j == 6) {
					if (pion2.j == 3 || pion2.j == 7) {
						return true;
					}
                } else if (pion1.j == 8) {
					if (pion2.j == 5 || pion2.j == 7) {
						return true;
					}
				}

				return false;
			}
			
			return false;
		} else {
			if (pion1.i == pion2.i) {
				if (pion1.j == 1) {
					if (pion2.j == 0 || pion2.j == 2) {
						return true;
					}
				} else if (pion1.j == 3) {
					if (pion2.j == 0 || pion2.j == 6) {
						return true;
					}
				} else if (pion1.j == 5) {
					if (pion2.j == 2 || pion2.j == 8) {
						return true;
					}
				} else if (pion1.j == 7) {
					if (pion2.j == 6 || pion2.j == 8) {
						return true;
					}
				}
				
				return false;
			} else if (pion1.i == 0 || pion1.i == 2) {
				return pion2.i == 1 && pion1.j == pion2.j;
			} else if (pion1.i == 1) {
				return (pion2.i == 0 || pion2.i == 2) && pion1.j == pion2.j;
			}
			
			return false;
		}
	}
};
