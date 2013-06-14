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
        JDM.Ia.iaPlay();
        if (JDM.update) {
            JDM.update = false;
            JDM.stage.update();
        }
    }
};
