function Drone(x, y, game){

    this.inventory = null;
    this.maxInventory = 5;
    this.status = 'idle';

    this.textStyle =  {font: '25px Arial', fill: '#ffffff', align: 'left'};

    this.energy = 100;
    this.health = 100;

    //this.healthText = game.add.text(x, y, this.health, this.textStyle);

    this.game = game;
    this.sprite = game.add.sprite(x,y, 'spacer');
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.game.physics.arcade.enableBody(this.sprite);
    this.sprite.body.customSeparateX = true;
    this.sprite.body.customSeparateY = true;
    this.sprite.body.immovable = true;
    this.moveSpeed = 0.15;
    this.collectSpeed = 1;
    this.tween = this.game.add.tween(this.sprite);
    this.task = null;
}



Drone.prototype = {
  move: function (mX, mY, callback) {
      var tweenSpeed = Math.sqrt((this.sprite.body.x-mX)*(this.sprite.body.x-mX)+(this.sprite.body.y-mY)*(this.sprite.body.y-mY))/this.moveSpeed;
      //console.log(tweenSpeed);

      this.tween.stop(false);
      //this.tween = this.game.add.tween(this.healthText).to({x: mX, y: mY}, tweenSpeed, Phaser.Easing.Linear.None, true);
      this.tween = this.game.add.tween(this.sprite.body).to({x: mX, y: mY}, tweenSpeed, Phaser.Easing.Linear.None, true);
      this.tween.onComplete.add(callback, this);

  },
  tick: function()
  {
      if(this.task !== null) {
          if(this.task.type === "collectResource") {
              if(this.status === 'idle') {
                  console.log("assigning move task");

                  var moveX = 0;
                  var moveY = 0;
                  var clearZone = 50;

                  do {
                      moveX = randomBetween(this.task.area.x1, this.task.area.x2);
                  } while(Math.abs(moveX-this.task.dropOff.x) < clearZone);

                  do {
                      moveY = randomBetween(this.task.area.y1, this.task.area.y2);
                  } while (Math.abs(moveY - this.task.dropOff.y) < clearZone);

                  this.move(
                      moveX,
                      moveY,
                      function (that) {
                          var closuredTask = function() {
                              if(that.inventory < that.maxInventory) {

                                  that.game.time.events.add(Phaser.Timer.SECOND * that.collectSpeed, function(){

                                      var plusOne = that.game.add.text(that.sprite.x, that.sprite.y, '+1', {font: '25px Arial', fill: '#ffffff', align: 'left'});
                                      var moveUp = that.game.add.tween(plusOne).to({y: that.sprite.y - 50}, 1000, Phaser.Easing.Linear.None, true);
                                      var fade = that.game.add.tween(plusOne).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);

                                      fade.onComplete.add(function(){
                                          plusOne, moveUp, fade = null;
                                      }, this);

                                      that.inventory += 0.5;
                                      console.log("collecting", that.inventory);
                                      console.log("returning to idle");
                                      that.status = 'idle';

                                  }, this);




                              } else {
                                  console.log("inventory full, delivering");
                                  that.move(that.task.dropOff.x, that.task.dropOff.y, function() {
                                      that.inventory = that.maxInventory;
                                      that.task.delivery(that.inventory);
                                      that.inventory = 0;
                                      console.log("returning to idle");
                                      that.status = 'idle';
                                  });
                              }

                          };
                          return closuredTask;
                      }(this)
                  );
                  this.status = 'moving';
              }

          } else {
              this.task();
          }
      }
  },
  assignTask: function (task) {
      this.task = task;
  }


};

function randomBetween(min, max) {
    return Math.floor(min + Math.random()*(max-min));
};