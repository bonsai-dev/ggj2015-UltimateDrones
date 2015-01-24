/**
 * Created by jwasc_000 on 24.01.2015.
 */
function UnitDisplay(x, y, game){
    this.game = game;
    this.rectangle = game.add.graphics(0, 0);
    this.textValue = '';
    this.style = { font: "18px Arial", fill: "#ff0044", align: "left" };
    this.textObject = this.game.add.text(x, y, this.textValue, this.style);
    this.unit = null;
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
        this.textObject.x = this.rectangle.x = this.unit.sprite.x+this.unit.sprite.width;
        this.textObject.y = this.rectangle.y = this.unit.sprite.y-20; //this.unit.sprite.height

    },
    setUnit: function(unit)
    {
        this.unit = unit;
        this.rectangle.clear();

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
                text+= prop.name + ': ' + parent.unit[prop.var] + '\n';
            }
        );
        this.textObject.setText(text);
        this.textObject.x = this.unit.sprite.x+this.unit.sprite.width;
        this.textObject.y = this.unit.sprite.y-20; //this.unit.sprite.height


        //this.rectangle = game.add.graphics(0, 0);
        this.rectangle.lineStyle(2, 0x000000, 1);
        this.rectangle.beginFill(0xffffff, 1);
        this.rectangle.drawRoundedRect( -5,  -5, this.textObject.width+10, this.textObject.height+10,10);
        this.rectangle.alpha = 0x77;
    }
};