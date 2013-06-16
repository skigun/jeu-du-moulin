JDM.Piece = function (position, player) {
    this.shape = this.draw(position, player);
    this.position = position;
};

JDM.Piece.prototype = {
    draw: function(position, player) {
        var shape = new createjs.Shape();

        shape.graphics.setStrokeStyle(1).beginStroke("#000");

        if (player == 1) {
            shape.graphics.beginFill('#f00');
        } else {
            shape.graphics.beginFill('#0f0');
        }

        // Si on a les positions logiques
        if (position.num != null && position.tab != null) {
            var _position = JDM.Board.arrayTranslatePositionToPixel[position.tab][position.num];
            shape.graphics.drawCircle(_position.x, _position.y, 20);
        } else { // Si non on fait avec les positions en pixel
            shape.graphics.drawCircle(position.x, position.y, 20);
        }

        if (JDM.step == 0) {
		    JDM.Board.piecesToPlaceContainer.addChild(shape);
        }
        else
        {
            JDM.Board.piecesContainer.addChild(shape);
        }

        // on set les events seulement au joueur humain
        if (player == 1) {
            this.setEvent(shape, player, position);
        }
        if (player == 2) {
            JDM.Board.iaPieces.push(shape);
            this.setIaEvent(shape, player, position);
        }
    },

    setEvent: function(shape, player, position) {
        shape.onPress = function(e) {
            var offset = {x: shape.x - e.stageX, y: shape.y - e.stageY};

            e.onMouseMove = function(e) {
                shape.x = e.stageX + offset.x;
                shape.y = e.stageY + offset.y;
                JDM.update = true;
            };

            e.onMouseUp = function(e) {
                var newPosition = JDM.Board.checkAndAdjustPosition({x : e.stageX, y: e.stageY});

                var iaTurn = false;

                console.log('position : ', position)
                console.log('nouvelle position : ', newPosition)

                if (JDM.turn == 1  && !JDM.delete) {
                    // placing pieces
                    if (JDM.step == 1) {
                        if (newPosition && position.tab == null && position.num == null) {

                            // si le nouvel emplacement n'est pas pris on peut placer son pion.
                            if (JDM.Board.positions[newPosition.tab][newPosition.num] == 0) {
                                JDM.Board.positions[newPosition.tab][newPosition.num] = player;

                                JDM.Board.piecesToPlaceContainer.removeChild(shape);
                                JDM.Piece.prototype.draw(newPosition, player);

                                iaTurn = true;
                            }
                        }
                    }

                    // moving pieces
                    if (JDM.step == 2) {
                         // si on bouge le pion de sa position actuelle on met à 0 l'emplacement
                         if (position.tab != null && position.num != null) {

                             var pionPossiblePos = JDM.Ia.canMove(JDM.Board.positions, new JDM.Ia.Pion(position.tab, position.num));

                             console.log('possiblePos', pionPossiblePos)

                             if (pionPossiblePos.length != 0) {

                                 var newPion = new JDM.Ia.Pion(newPosition.tab, newPosition.num);

                                 for (var i = 0, l = pionPossiblePos.length; i < l ; i++) {

                                     if (JDM.Ia.pionEquals(pionPossiblePos[i], newPion)) {

                                         JDM.Board.positions[position.tab][position.num] = 0;

                                         JDM.Board.positions[newPosition.tab][newPosition.num] = 1;

                                         JDM.Board.drawGame();

                                         iaTurn = true;
                                     }
                                 }
                             }
                         }
                    }

                    shape.x = 0;
                    shape.y = 0;

                    JDM.update = true;

                    if (iaTurn) {
                        // on check les moulins
                        var mills = JDM.Ia.findMills(JDM.Board.positions);

                        JDM.Ia.checkMills(mills, 1);

                        console.log('delete', JDM.delete)

                        if (JDM.delete == false) {
                            JDM.turn = 2;
                        }

                        JDM.Ia.iaPlay();
                    }
                }
            };
        };
    },

    setIaEvent: function(shape, player, position) {

        shape.onClick = function(e) {
            console.log(position.tab, position.num)
            // si c'est le tour du joueur 1, et qu'il est en phase de delete, il peut effacer la piece IA
            if (JDM.turn == 1 && JDM.delete) {
                console.log('player 1 deleting piece');

                var newPosition = JDM.Board.checkAndAdjustPosition({x : e.stageX, y: e.stageY});
                var currentPiece = new JDM.Ia.Pion(newPosition.tab, newPosition.num);

                console.log('this piece cannot be deleted', JDM.Ia.isPieceInMills(currentPiece, 2))

                if (!JDM.Ia.isPieceInMills(currentPiece, 2)) {

                    JDM.Board.positions[newPosition.tab][newPosition.num] = 0;
                    JDM.Board.drawGame();

                    JDM.delete = false;
                    JDM.turn = 2;

                    JDM.Ia.iaPlay();
                }
            }
        }
    }
};
