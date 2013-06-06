JDM.Menu = {
    message: 'Welcome',
    menuContainer: new createjs.Container(),

    init: function() {
        JDM.stage.addChild(this.menuContainer);

        var message = new createjs.Text('WELCOME', '24px Arial', '#ff7700');
        message.x = 20;
        message.y = 14;

        this.menuContainer.addChild(message);
    }
};
