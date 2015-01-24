function Drone(x, y, game){

    this.inventory = null;
    this.game = game;
    this.sprite = game.add.sprite(x,y, 'spacer');
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.game.physics.arcade.enableBody(this.sprite);
    this.sprite.body.customSeparateX = true;
    this.sprite.body.customSeparateY = true;
    this.sprite.body.immovable = true;
    this.moveSpeed = 0.2;
    this.tween = this.game.add.tween(this.sprite);
}



Drone.prototype = {
  move: function (mX, mY) {
      var tweenSpeed = Math.sqrt((this.sprite.body.x-mX)*(this.sprite.body.x-mX)+(this.sprite.body.y-mY)*(this.sprite.body.y-mY))/this.moveSpeed;
      console.log(tweenSpeed);

      //Das Tween macht vielleicht ich Probleme mit der Kollisionserkennung.
      this.tween.stop(false);
      this.tween = this.game.add.tween(this.sprite.body).to({x: mX, y: mY}, tweenSpeed, Phaser.Easing.Linear.None, true);
  },
  tick: function()
  {

  },
    harvest: function(drone, factory)
    {
        console.log("Collision happened");
    }
};