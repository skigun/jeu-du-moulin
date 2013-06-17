JDM.Menu = {
    message: new createjs.Text('WELCOME', '24px Arial', '#ff7700'),
    menuContainer: new createjs.Container(),

    init: function() {
        this.menuContainer.y = 600;
        JDM.stage.addChild(this.menuContainer);

        this.message.x = 20;
        this.message.y = 14;

        this.menuContainer.addChild(this.message);
    },

    update: function() {
        if (JDM.step == 1) {
            this.message.text = 'Phase 1: placing pieces';
        } else if (JDM.step == 2) {
            this.message.text = 'Phase 2: moving pieces';
        }

        if ((JDM.turn == 2 && JDM.flying.ia) || (JDM.turn == 1 && JDM.flying.human)) {
            this.message.text = 'Flying';
        }

        if (JDM.turn == 1) {
            if (JDM.deletePiece) {
                this.message.text += ' - Choose one piece to remove';
            } else {
                this.message.text += ' - Human to move';
            }
        } else if (JDM.turn == 2) {
            if (JDM.deletePiece) {
                this.message.text += ' - IA removing piece...';
            } else {
                this.message.text += ' - IA thinking...';
            }
        }

        if (JDM.step == 4) {
            console.log('update 2')
            if (JDM.winner != 0) {
                console.log('update 3')
                if (JDM.winner == 1) {
                    this.message.text = 'You win ! gratz PGM !';
                } else {
                    this.message.text = 'IA win ! looser !';
                }
            }
        }
    }
};
