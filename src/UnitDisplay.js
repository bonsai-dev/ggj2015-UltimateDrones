/**
 * Created by jwasc_000 on 24.01.2015.
 */
function UnitDisplay(x, y, game){
    this.game = game;
    this.rectangle = game.add.graphics(0, 0);
    this.rectangle.fixedToCamera = true;
    this.textValue = '';
    this.style = { font: "18px Arial", fill: "#ff0044", align: "left" };
    this.textObject = this.game.add.text(0, 0, this.textValue, this.style);
    this.textObject.fixedToCamera = true;
    this.unit = null;

    this.closeButton = game.add.button(0, 0, 'close', this.closeButtonClicked, this);
    this.closeButton.fixedToCamera = true;
    this.closeButton.cameraOffset.x = 15;
    this.closeButton.cameraOffset.y = this.game.camera.height-this.closeButton.height-10;
    this.closeButton.tint = 0x555555;

    this.upgradeButton = game.add.button(0, 0, 'up', this.upgradeButtonClicked, this);
    this.upgradeButton.fixedToCamera = true;
    this.upgradeButton.cameraOffset.x = 15 + this.closeButton.width + 15 ;
    this.upgradeButton.cameraOffset.y = this.game.camera.height-this.closeButton.height-10;
    this.upgradeButton.tint = 0x555555;

    this.bouncingArrow = null;
    this.bouncingArrowYOffset = 0;
    this.game.add.tween(this).to({bouncingArrowYOffset: 25}, 1000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
}

UnitDisplay.prototype =
{
    show: function()
    {
        this.setDisplayText();
        this.upgradeButton.tint = 0x555555;
        if(this.unit == null) {
            if (this.bouncingArrow != null) {
                this.bouncingArrow.kill();
                this.bouncingArrow = null;
            }
            return;
        }
        if(!(this.unit.upgradePrice.resource1 > this.game.state.getCurrentState().resStorage.resource1 ||
            this.unit.upgradePrice.resource2 > this.game.state.getCurrentState().resStorage.resource2 ||
            this.unit.upgradePrice.resource2 > this.game.state.getCurrentState().resStorage.resource2
        ))
        {
            this.upgradeButton.tint = 0xffffff;
        }

        //bouncy arrow
        if(this.bouncingArrow === null) {
            this.bouncingArrow = this.game.add.sprite(this.unit.sprite.x, this.unit.sprite.y, 'arrow');
            this.bouncingArrow.scale = new PIXI.Point(0.5, 0.5);
        }
        var anchorX = this.unit.sprite.x+(Math.round(this.unit.sprite.width/2)-(this.bouncingArrow.width/2));
        var anchorY = this.unit.sprite.y-10-this.bouncingArrowYOffset;
        this.bouncingArrow.x = anchorX;
        this.bouncingArrow.y = anchorY;

    },
    setDisplayText: function()
    {
        if (this.unit == null) {
            this.textObject.setText(' ');
            return;
        }
        var parent = this;
        if(!this.unit.__proto__.hasOwnProperty('getDisplayNames'))
            return;
        var varNames = this.unit.getDisplayNames();
        var text = '';
        varNames.forEach(
            function(prop){
                if(!parent.unit.hasOwnProperty(prop.var))
                    return;
                var value = parent.unit[prop.var];
                if(prop.type == 'count')
                    value = parent.unit[prop.var].length;
                if(prop.type == '2f')
                    value = Math.round(parent.unit[prop.var] * 100) / 100;
                if(prop.type == 'd')
                    value = Math.round(parent.unit[prop.var]);
                text+= prop.name + ': ' + value.toString() + '\n';
            }
        );
        text+= "\nUpgrade prices: " + '\n'
        + Static.Strings.Resources.resource1Name + ": " +  this.unit.upgradePrice.resource1 + '\n'
        + Static.Strings.Resources.resource2Name + ": " +  this.unit.upgradePrice.resource2 + '\n'
        + Static.Strings.Resources.resource3Name + ": " +  this.unit.upgradePrice.resource3 + '\n'
        ;
        this.textObject.setText(text);
        this.textObject.cameraOffset.x = this.rectangle.cameraOffset.x = 20;
        this.textObject.cameraOffset.y = this.rectangle.cameraOffset.y = this.game.camera.height-this.rectangle.height-50;
    },

    setUnit: function(unit)
    {
        this.unit = unit;
        this.rectangle.clear();
        this.setDisplayText();
        this.closeButton.tint = 0x555555;
        this.upgradeButton.tint = 0x555555
        if(this.unit == null)
            return;
        this.rectangle.lineStyle(2, 0x000000, 1);
        this.rectangle.beginFill(0xffffff, 1);
        this.rectangle.drawRoundedRect( -5,  -5, this.textObject.width+10, this.textObject.height+10,10);
        this.closeButton.tint = 0xffffff;
        this.upgradeButton.tint = 0xffffff;
    },
    closeButtonClicked: function()
    {
        this.game.state.getCurrentState().setSelectedUnit(null);
        this.closeButton.tint = 0x555555;
        this.upgradeButton.tint = 0x555555;
    },
    upgradeButtonClicked: function() {
        var parent = this;
        if (this.unit == null)
            return;
        if (!this.unit.__proto__.hasOwnProperty('getUpgrades'))
            return;

        if( this.unit.upgradePrice.resource1 > this.game.state.getCurrentState().resStorage.resource1 ||
            this.unit.upgradePrice.resource2 > this.game.state.getCurrentState().resStorage.resource2 ||
            this.unit.upgradePrice.resource2 > this.game.state.getCurrentState().resStorage.resource2
        )
        {
            //Upgrade zu teuer
            return;
        }

        var upgrades = this.unit.getUpgrades();
        upgrades.forEach(
            function (prop) {
                if (!parent.unit.hasOwnProperty(prop.var))
                    return;
                parent.unit[prop.var]+=prop.add;
            }
        );
        this.game.state.getCurrentState().resStorage.resource1 -= this.unit.upgradePrice.resource1;
        this.game.state.getCurrentState().resStorage.resource2 -= this.unit.upgradePrice.resource2;
        this.game.state.getCurrentState().resStorage.resource3 -= this.unit.upgradePrice.resource3;
        this.unit.upgradePrice.resource1*=2;
        this.unit.upgradePrice.resource2*=2;
        this.unit.upgradePrice.resource3*=2;

    }
};