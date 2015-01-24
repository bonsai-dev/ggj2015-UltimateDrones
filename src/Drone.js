function Drone(x, y, game){

    this.inventory = null;
    this.x = x;
    this.y = y;
    this.game = game;
    this.sprite = game.add.sprite(x,y, 'spacer');
    this.moveSpeed = 0.2;

}



Drone.prototype = {
  move: function (mX, mY) {
      var tweenSpeed = Math.sqrt((this.sprite.x-mX)*(this.sprite.x-mX)+(this.sprite.y-mY)+(this.sprite.y-mY))/this.moveSpeed;
      console.log(tweenSpeed);
      this.game.add.tween(this.sprite).to({x: mX, y: mY}, tweenSpeed, Phaser.Easing.Linear.None, true);
  }
};