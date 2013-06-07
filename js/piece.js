JDM.Piece = function (position, player) {
    var self = this;
    this.shape = null;
    this.position = position;

    this.shape = new createjs.Shape();
    this.shape.graphics.setStrokeStyle(1).beginStroke("#000");

    if (player == 1) {
        this.shape.graphics.beginFill('#f00');
    } else {
        this.shape.graphics.beginFill('#0f0');
    }

    // Si on a les positions logiques
    if (this.position.num != null && this.position.tab != null) {
        var _position = JDM.Board.arrayTranslatePositionToPixel[this.position.tab][this.position.num];
        this.shape.graphics.drawCircle(_position.x, _position.y, 20);
    } else { // Si non on fait avec les positions en pixel
        this.shape.graphics.drawCircle(this.position.x, this.position.y, 20);
    }

    JDM.Map.mapContainer.addChild(this.shape);

    (function(self, player) {

        self.shape.onPress = function(e) {
            var offset = {x: self.shape.x - e.stageX, y: self.shape.y - e.stageY};

            e.onMouseMove = function(e) {
                self.shape.x = e.stageX + offset.x;
                self.shape.y = e.stageY + offset.y;
                JDM.update = true;
            };

            e.onMouseUp = function(e) {
                position = JDM.Board.checkAndAdjustPosition({x : e.stageX, y: e.stageY});

                if (!position) {
                    return;
                }
                console.log(position);

                JDM.Map.mapContainer.removeChild(self.shape);
                JDM.Piece(position, player);
                JDM.update = true;
            };
        };
    })(self, player);
};
