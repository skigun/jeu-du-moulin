window.onload = function() {
    JDM.canvas = document.getElementById('jeu-du-moulin');
    JDM.stage = new createjs.Stage(JDM.canvas);

    JDM.stage.snapToPixelEnabled = true;

    JDM.canvas.width = 800;
    JDM.canvas.height = 600;
    JDM.canvas.getContext('2d');

    JDM.mapContainer = new createjs.Container();
    JDM.stage.addChild(JDM.mapContainer);

    var welcome = new createjs.Text('Bienvenu sur le Jeu du Moulin', '24px Arial');
    welcome.x = 235;
    welcome.y = 250;
    JDM.mapContainer.addChild(welcome);

    JDM.stage.update();
};
