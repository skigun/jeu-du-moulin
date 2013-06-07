window.onload = function() {
    JDM.canvas = document.getElementById('jeu-du-moulin');
    JDM.stage = new createjs.Stage(JDM.canvas);

    JDM.stage.enableMouseOver(10);
    JDM.stage.mouseMoveOutside = true;
    JDM.stage.snapToPixelEnabled = true;

    JDM.canvas.width = 600;
    JDM.canvas.height = 600;
    JDM.canvas.getContext('2d');

    JDM.Menu.init();
    JDM.Map.init();
    JDM.Board.init();
    JDM.update = true;

    createjs.Ticker.addEventListener("tick", JDM.tick);
};
