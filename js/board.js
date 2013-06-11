JDM.Board = {
    positions: [],
    iaPieces: [],
    piecesContainer: new createjs.Container(),
    arrayTranslatePositionToPixel: [],

    setPositions: function() {
        for (var j = 0; j < 3; j++) {
            this.arrayTranslatePositionToPixel[j] = [];
            for (var i = 0; i < 9; i++) {
                if (i != 4) {
                    this.arrayTranslatePositionToPixel[j][i] = this.translatePositionToPixel({num: i, tab: j});
                }
            }
        }
    },

    init: function () {
        for (var i = 0; i < 3; i++) {
            this.positions[i] = [0, 0, 0, 0, null, 0, 0, 0, 0];
        }

        this.addPieces();

        this.piecesContainer.y = 25;
        JDM.stage.addChild(this.piecesContainer);
    },

    translatePositionToPixel: function(position) {
        if (position.num < 0 || position.num == 4 || position.num > 8) {
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
        for (var i = 0; i < 9; i++) {
            new JDM.Piece({x: i * 25 + 25, y: 25, num: null, tab: null}, 1);
            new JDM.Piece({x: i * 25 + 375, y: 25, num: null, tab: null}, 2);
        }
    },

    checkAndAdjustPosition: function(positionPixel) {
        var area = 40, returnPosition = null;

        this.forEachPieces(this.arrayTranslatePositionToPixel, function(translatePosition, position) {
            if (positionPixel.x >= (translatePosition.x - area) &&
                positionPixel.x <= (translatePosition.x + area) &&
                positionPixel.y >= (translatePosition.y - area) &&
                positionPixel.y <= (translatePosition.y + area))
            {
                returnPosition = position;
            }
        });

        if (returnPosition) {
            return returnPosition;
        }

        return false;
    },

    forEachPieces: function(_array, callback) {
        for (var j = 0; j < 3; j++) {
            for (var i = 0; i < 9; i++) {
                if (i != 4) {
                    callback(_array[j][i], {num: i, tab: j});
                }
            }
        }
    },

    drawGame: function(stateofthegame) {
        this.forEachPieces(stateofthegame, function(value, position) {
            if(value != 0) {
                JDM.Piece.prototype.draw(position, value);
            }
        });
    }
};
