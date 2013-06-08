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

        JDM.Map.mapContainer.addChild(shape);

        this.setEvent(shape, player, position);
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

                if (newPosition) {
                    // si on bouge le pion de sa position actuelle on met à 0 l'emplacement
                    if (position.tab != null && position.num != null) {
                        JDM.Board.positions[position.tab][position.num] = 0;
                    }

                    // si le nouvel emplacement est à 0 on peut placer son pion.
                    if (JDM.Board.positions[newPosition.tab][newPosition.num] == 0) {
                        JDM.Board.positions[newPosition.tab][newPosition.num] = player;

                        JDM.Map.mapContainer.removeChild(shape);
                        JDM.Piece.prototype.draw(newPosition, player);
                    }
                }
                shape.x = 0;
                shape.y = 0;

                JDM.update = true;
            };
        };
    }
};
