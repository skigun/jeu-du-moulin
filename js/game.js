var PLACEMENT = 1;

var JDM = {
    canvas: null,
    stage: null,
    step: 0,
    update: false,

    tick: function() {
        if(JDM.update)
        JDM.stage.update();
        JDM.update = false;
    }
};
