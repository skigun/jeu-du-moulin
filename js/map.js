JDM.Map = {
    mapContainer: new createjs.Container(),
    cube0: new createjs.Shape(),
    cube1: new createjs.Shape(),
    cube2: new createjs.Shape(),
    cube3: new createjs.Shape(),
    lines: new createjs.Shape(),
    positions: [],

    init: function() {
        JDM.stage.addChild(this.mapContainer);

        this.cube0.graphics.setStrokeStyle(4).beginStroke('#f00').beginFill('#fff').drawRect(0, 0, 600, 600);
        this.cube1.graphics.setStrokeStyle(3).beginStroke('#000').drawRect(50, 75, 500, 500);
        this.cube2.graphics.setStrokeStyle(3).beginStroke('#000').drawRect(125, 150, 350, 350);
        this.cube3.graphics.setStrokeStyle(3).beginStroke('#000').drawRect(200, 225, 200, 200);
        this.lines.graphics.setStrokeStyle(3).beginStroke('#000');
        this.lines.graphics.moveTo(50, 325);
        this.lines.graphics.lineTo(200, 325);
        this.lines.graphics.moveTo(400, 325);
        this.lines.graphics.lineTo(550, 325);
        this.lines.graphics.moveTo(300, 75);
        this.lines.graphics.lineTo(300, 225);
        this.lines.graphics.moveTo(300, 425);
        this.lines.graphics.lineTo(300, 575);

        this.mapContainer.addChild(this.cube0);
        this.mapContainer.addChild(this.cube1);
        this.mapContainer.addChild(this.cube2);
        this.mapContainer.addChild(this.cube3);
        this.mapContainer.addChild(this.lines);
    }
};
