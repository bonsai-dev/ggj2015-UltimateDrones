function Building(x, y, game){
    this.game = game;
    this.sprite = this.game.add.sprite(x,y, 'spacer');
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.game.physics.arcade.enableBody(this.sprite);
    this.sprite.body.customSeparateX = true;
    this.sprite.body.customSeparateY = true;
    this.sprite.body.immovable = true;
    this.storage = 0;
    this.maximumStorage = 20;
    this.productionRate = 0.01;
    this.textStyle =  {font: '25px Arial', fill: '#ffffff', align: 'left'};
    this.text = this.game.add.text(x, y, this.storage, this.textStyle);
}

Building.prototype =
{
    setSprite: function(sprite) {
        this.sprite = sprite;
    },
    tick: function()
    {
        this.storage += this.productionRate;
        this.text.setText(Math.min(Math.floor(this.storage),this.maximumStorage));
    }
}