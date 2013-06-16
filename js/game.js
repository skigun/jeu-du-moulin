var PLACEMENT = 1;

var JDM = {
    canvas: null,
    stage: null,
    step: 0,
    piecesToPlace: 9,
    update: false,
    turn: 1,
    delete: false,

    tick: function() {
        if (JDM.update) {
            JDM.update = false;
            JDM.Menu.update();
            JDM.stage.update();
        }
    }
};
