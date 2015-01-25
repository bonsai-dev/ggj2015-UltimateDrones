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
    this.closeButton = game.add.button(0, 0, 'crystal', this.closeButtonClicked, this);
    this.closeButton.fixedToCamera = true;
    this.closeButton.cameraOffset.x = 15;
    this.closeButton.cameraOffset.y = this.game.camera.height-this.closeButton.height-10;
    this.closeButton.tint = 0x555555;
}

UnitDisplay.prototype =
{
    show: function()
    {
        var parent = this;
        if(this.unit == null)
            return;
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
                text+= prop.name + ': ' + value + '\n';
            }
        );
        this.textObject.setText(text);
console.log(this.game.camera.height);
        this.textObject.cameraOffset.x = this.rectangle.cameraOffset.x = 20;
        this.textObject.cameraOffset.y = this.rectangle.cameraOffset.y = this.game.camera.height-this.rectangle.height-50;
    },
    setUnit: function(unit)
    {
        this.unit = unit;
        this.rectangle.clear();

        var parent = this;
        if(this.unit == null) {
            this.textObject.setText('');
            return;
        }
        if(!this.unit.__proto__.hasOwnProperty('getDisplayNames'))
            return;
        var varNames = this.unit.getDisplayNames();
        var text = '';
        varNames.forEach(
            function(prop){
                if(!parent.unit.hasOwnProperty(prop.var))
                    return;
                text+= prop.name + ': ' + parent.unit[prop.var] + '\n';
            }
        );
        this.textObject.setText(text);
        this.rectangle.lineStyle(2, 0x000000, 1);
        this.rectangle.beginFill(0xffffff, 1);
        this.rectangle.drawRoundedRect( -5,  -5, this.textObject.width+10, this.textObject.height+10,10);
        this.closeButton.tint = 0xffffff;
    },
    closeButtonClicked: function()
    {
        this.game.state.getCurrentState().setSelectedUnit(null);
        this.closeButton.tint = 0x555555;
    }
};