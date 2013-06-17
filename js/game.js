var PLACEMENT = 1;

var JDM = {
    canvas: null,
    stage: null,
    step: 0,
    piecesToPlace: 9,
    update: false,
    turn: 1,
    deletePiece: false,
    winner: 0,
    flying: {
        human: false,
        ia: false
    },

    tick: function() {
        if (JDM.update) {
            JDM.update = false;
            JDM.Menu.update();
            JDM.stage.update();
        }
    }
};
