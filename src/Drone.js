function Drone(x, y, game){

    this.inventory = null;
    this.maxInventory = 5;
    this.status = 'idle';
    this.assignedBuilding = 0;
    this.currentBuilding = 0;

    this.game = game;
    this.sprite = game.add.sprite(x,y, 'spacer');
    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.game.physics.arcade.enableBody(this.sprite);
    this.sprite.body.customSeparateX = true;
    this.sprite.body.customSeparateY = true;
    this.sprite.body.immovable = true;
    this.moveSpeed = 0.2;
    this.tween = this.game.add.tween(this.sprite);
    this.task = null;
}



Drone.prototype = {
  move: function (mX, mY, callback) {
      var tweenSpeed = Math.sqrt((this.sprite.body.x-mX)*(this.sprite.body.x-mX)+(this.sprite.body.y-mY)*(this.sprite.body.y-mY))/this.moveSpeed;
      //console.log(tweenSpeed);

      this.tween.stop(false);
      this.tween = this.game.add.tween(this.sprite.body).to({x: mX, y: mY}, tweenSpeed, Phaser.Easing.Linear.None, true);
      this.tween.onComplete.add(callback, this);

  },
  tick: function()
  {
      if(this.task !== null) {
          if(this.task.type === "collectResource") {
              if(this.status === 'idle') {
                  console.log("assigning move task");
                  this.move(
                      randomBetween(this.task.area.x1, this.task.area.x2),
                      randomBetween(this.task.area.y1, this.task.area.y2),
                      function (that) {
                          var closuredTask = function() {
                              if(that.inventory < that.maxInventory) {
                                  that.inventory += 0.5;
                                  console.log("collecting", that.inventory);
                                  console.log("returning to idle");
                                  that.status = 'idle';
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