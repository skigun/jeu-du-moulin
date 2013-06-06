JDM.Board = {
    positions: [],
    piecesContainer: new createjs.Container(),

    init: function () {
        for (var i = 0; i < 3; i++) {
            this.positions[i] = [0, 0, 0, 0, null, 0, 0, 0, 0];
        }

        this.addPieces();

        this.piecesContainer.y = 25;
        JDM.stage.addChild(this.piecesContainer);
    },

    placement: function() {
        JDM.Map.addEventListener('click', function () {

        });
    },

    translatePositionToPixel: function(position) {
        if (position.num < 0 || position.num == 4 || position.num > 8 ) {
            throw new Error('Wrong position, set to ' + position.num);
        }

        if (position.tab < 0 || position.tab > 2) {
            throw new Error('Wrong tab, set to ' + position.tab);
        }

        var x = 0, y = 0;

        if (position.tab == 0) {
            x = 50 + position.num % 3 * 250;
            y = 75 + Math.floor(position.num / 3) * 250;
        } else if (position.tab == 1) {
            x = 125 + position.num % 3 * 175;
            y = 150 + Math.floor(position.num / 3) * 175;
        } else {
            x = 200 + position.num % 3 * 100;
            y = 225  + Math.floor(position.num / 3) * 100;
        }

        return {x: x, y: y};
    },

    addPieces: function() {
        for(var i = 0; i < 9; i++){
            JDM.piece({x: i*25 + 25, y: 50}, 1);
        }

        for(var i = 0; i < 9; i++){
            JDM.piece({x: i*25 + 375, y: 50}, 2);
        }
    }
};