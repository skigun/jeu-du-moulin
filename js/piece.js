JDM.piece = function (position, player) {
    this.shape = new createjs.Shape();

    if (player == 1) {
        this.shape.graphics.beginFill('#f00');
    } else {
        this.shape.graphics.beginFill('#0f0');
    }

    this.shape.graphics.drawCircle(position.x, position.y, 20);
    JDM.Map.mapContainer.addChild(this.shape);

    this.shape.addEventListener('click', function(e) {
        console.log(e.target.id);
    });
};
