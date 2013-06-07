JDM.piece = function (position, player) {
    this.shape = new createjs.Shape();

    this.shape.graphics.setStrokeStyle(1).beginStroke("#000");

    if (player == 1) {
        this.shape.graphics.beginFill('#f00');
    } else {
        this.shape.graphics.beginFill('#0f0');
    }

    this.shape.graphics.drawCircle(position.x, position.y, 20);
    JDM.Map.mapContainer.addChild(this.shape);

    (function(target, player) {

        target.onPress = function(e) {
            var offset = {x: target.x - e.stageX, y: target.y - e.stageY};

            e.onMouseMove = function(e) {
                target.x = e.stageX + offset.x;
                target.y = e.stageY + offset.y;
                JDM.update = true;
            };


            e.onMouseUp = function(e) {
                position = JDM.Board.checkAndAdjustPosition({x : e.stageX, y: e.stageY});

                if (!position) {
                    return;
                }

                JDM.piece({x: position.x, y: position.y}, player);
                JDM.Map.mapContainer.removeChild(target);
                JDM.update = true;
            };

        };
    })(this.shape, player);
};
