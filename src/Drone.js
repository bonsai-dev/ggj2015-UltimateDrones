function Drone(x, y, game){

    this.inventory = null;
    this.maxInventory = 5;
    this.status = 'idle';

    this.textStyle =  {font: '25px Arial', fill: '#ffffff', align: 'left'};

    this.energy = 100;
    this.health = 100;

    //Very important attributes
    this.age = chance.age();
    this.ssn = chance.ssn();
    this.name = chance.name({prefix: Math.random()<0.5, middle: Math.random()<0.5});

    this.energyText = game.add.text(x, y+ 60, this.energy+"%", this.textStyle);

    this.game = game;
    this.sprite = game.add.sprite(x,y, 'dronex1');
    this.sprite.inputEnabled = true;
    var parent = this;
    this.sprite.events.onInputDown.add(function(sprite, pointer){
        game.state.getCurrentState().setSelectedUnit(parent);
    }, this);
    this.moveSpeed = 0.15;
    this.collectSpeed = 1;
    this.reloadSpeed = 1;
    this.tween = this.game.add.tween(this.sprite);
    this.task = null;

}



Drone.prototype = {
  move: function (mX, mY, callback) {
      var tweenSpeed = Math.sqrt((this.sprite.x-mX)*(this.sprite.x-mX)+(this.sprite.y-mY)*(this.sprite.y-mY))/this.moveSpeed;
      //console.log(tweenSpeed);

      this.tween.stop(false);
      this.game.add.tween(this.energyText).to({x: mX, y: mY + 60}, tweenSpeed, Phaser.Easing.Linear.None, true);
      this.tween = this.game.add.tween(this.sprite).to({x: mX, y: mY}, tweenSpeed, Phaser.Easing.Linear.None, true);
      this.tween.onComplete.add(callback, this);

  },
  tick: function()
  {
      if(this.task !== null) {
          if(this.task.type === "collectResource") {
              if(this.status === 'idle') {
                  //console.log("assigning move task");

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

                                      that.energy -= 1;
                                      that.energyText.setText(that.energy + "%");

                                      that.inventory += 0.5;
                                      //console.log("collecting", that.inventory);
                                      //console.log("returning to idle");
                                      that.status = 'idle';

                                  }, this);

                              } else {
                                  console.log("inventory full, delivering");
                                  that.move(that.task.dropOff.x, that.task.dropOff.y, function() {
                                      that.inventory = that.maxInventory;
                                      that.task.delivery(that.inventory);
                                      that.inventory = 0;
                                      //console.log("returning to idle");
                                      that.status = 'idle';
                                  });
                              }

                          };
                          return closuredTask;
                      }(this)
                  );
                  this.status = 'moving';
              }

          } else if(this.task.type === "reloadFromHub") {
              if(this.status === 'idle') {
                  this.move(
                      this.task.slot.x,
                      this.task.slot.y,
                      function (that) {
                          var closuredTask = function() {
                              that.status = 'loading';
                              console.log("arrived at loading slot!");
                          };
                          return closuredTask;
                      }(this)
                  );
                  this.status = 'moving';
                  /*console.log("set status to loading");
                  this.status = 'isLoading';
                  var acceptEnergy = function (that) {
                      return function (transferredEnergy) {
                          that.game.time.events.add(Phaser.Timer.SECOND * that.reloadSpeed, function () {
                              that.energy += transferredEnergy;
                              that.energyText.setText(that.energy + "%");
                              var plusOne = that.game.add.text(that.sprite.x, that.sprite.y, '+' + transferredEnergy + "%", {
                                  font: '25px Arial',
                                  fill: '#3333ff',
                                  align: 'left'
                              });
                              var moveUp = that.game.add.tween(plusOne).to({y: that.sprite.y - 50}, 1000, Phaser.Easing.Linear.None, true);
                              var fade = that.game.add.tween(plusOne).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
                              fade.onComplete.add(function () {
                                  plusOne, moveUp, fade = null;
                              }, this);
                              console.log("return from load to idle");
                              that.status = 'idle';
                          });
                      }
                  }(this);
                  this.task.energySource(acceptEnergy);*/
              }
          } else  {
              this.task();
          }
      }
  },
  assignTask: function (task) {
      this.task = task;
  },
    getDisplayNames: function()
    {
        return [
            {name: 'Name', var: 'name'},
            {name: 'Age', var: 'age'},
            {name: 'SSN', var: 'ssn'},
            {name: 'Energy', var: 'energy'},
            {name: 'Health', var: 'health'},
            {name: 'Movespeed', var: 'moveSpeed'},
            {name: 'Collectspeed', var: 'collectSpeed'},
            {name: 'Reloadspeed', var: 'reloadSpeed'}

        ];
    }

};

function randomBetween(min, max) {
    return Math.floor(min + Math.random()*(max-min));
};