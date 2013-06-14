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

        //JDM.Map.mapContainer.addChild(shape);
		JDM.Board.piecesContainer.addChild(shape);

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

                console.log('position : ', position)
                console.log('nouvelle position : ', newPosition)

                // placing pieces
                if (JDM.step == 0 && JDM.turn == 1) {
                    if (newPosition && position.tab == null && position.num == null) {

                        // si le nouvel emplacement n'est pas pris on peut placer son pion.
                        if (JDM.Board.positions[newPosition.tab][newPosition.num] == 0) {
                            JDM.Board.positions[newPosition.tab][newPosition.num] = player;

                            //JDM.Map.mapContainer.removeChild(shape);
                            JDM.Board.piecesContainer.removeChild(shape);
                            JDM.Piece.prototype.draw(newPosition, player);

                            // on check les moulins
                            var mills = JDM.Ia.findMills(JDM.Board.positions);

                            for (var i = 0, l = mills.length; i < l ; i++) {
                                if(!JDM.Ia.isExistingMill(mills[i])) {
                                    if (mills[i].player == 1) {

                                       JDM.delete = true;
                                    }
                                }
                            }

                            if (JDM.delete) {
                                // on met a jour le tableau des mills existant
                                JDM.Ia.existingMills = mills;

                            } else {
                                JDM.turn = 2;
                            }
                        }
                    }
                    shape.x = 0;
                    shape.y = 0;

                    JDM.update = true;
                }

                // moving pieces
                if (JDM.step == 1) {
                    /*
                     // si on bouge le pion de sa position actuelle on met à 0 l'emplacement
                     if (position.tab != null && position.num != null) {
                     JDM.Board.positions[position.tab][position.num] = 0;
                     }
                     */
                    console.log('next step')
                }
            };
        };
    },

    setIaEvent: function(shape, player, position) {

        shape.onClick = function(e) {
            // si c'est le tour du joueur 1, et qu'il est en phase de delete, il peut effacer la piece IA
            if (JDM.turn == 1 && JDM.delete) {
                console.log('piece deleted');

                var newPosition = JDM.Board.checkAndAdjustPosition({x : e.stageX, y: e.stageY});
                JDM.Board.positions[newPosition.tab][newPosition.num] = 0;
                JDM.Board.piecesContainer.removeChild(shape);

                JDM.update = true;

                JDM.delete = false;
                JDM.turn = 2;
            }
        }
    }
};
