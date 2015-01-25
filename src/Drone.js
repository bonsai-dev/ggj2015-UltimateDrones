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
    this.upgradePrice = {resource1: 100,resource2: 0, resource3: 0};
}



Drone.prototype = {
  move: function (mX, mY, callback) {
      var tweenSpeed = Math.sqrt((this.sprite.x-mX)*(this.sprite.x-mX)+(this.sprite.y-mY)*(this.sprite.y-mY))/this.moveSpeed;

      this.tween.stop(false);
      this.game.add.tween(this.energyText).to({x: mX, y: mY + 60}, tweenSpeed, Phaser.Easing.Linear.None, true);
      this.tween = this.game.add.tween(this.sprite).to({x: mX, y: mY}, tweenSpeed, Phaser.Easing.Linear.None, true);
      this.tween.onComplete.add(callback, this);

  },
  tick: function()
  {
      if(this.energy <= 0){
        return;
      }

      if(this.task !== null) {
          if(this.task.type === "collectResource") {
              if(this.status === 'idle') {

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

                                      that.changeEnergy(-1);
                                      that.energyText.setText(that.energy + "%");

                                      that.inventory += 0.5;
                                      that.status = 'idle';

                                  }, this);

                              } else {
                                  console.log("inventory full, delivering");
                                  that.move(that.task.dropOff.x, that.task.dropOff.y, function() {
                                      that.inventory = that.maxInventory;
                                      that.task.delivery(that.inventory);
                                      that.inventory = 0;
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
                  if(Math.abs(this.task.slot.x-this.sprite.x) < 5 && Math.abs(this.task.slot.y-this.sprite.y)<5) {
                      this.status = 'atLoading';
                      return;
                  }
                  this.move(
                      this.task.slot.x,
                      this.task.slot.y,
                      function (that) {
                          var closuredTask = function() {
                              that.status = 'atLoading';
                              //console.log("arrived at loading slot!");
                          };
                          return closuredTask;
                      }(this)
                  );
                  this.status = 'moving';
              } else if(this.status === 'atLoading') {
                  var acceptEnergy = function (that) {
                      return function (transferredEnergy) {
                          that.game.time.events.add(Phaser.Timer.SECOND * that.reloadSpeed, function () {
                          that.changeEnergy(transferredEnergy);
                          that.energyText.setText(that.energy + "%");
                          var plusOne = that.game.add.text(that.sprite.x, that.sprite.y, '+' + transferredEnergy + "%", {
                            font: '25px Arial',
                            fill: '#3333ff',
                            align: 'left'
                      });
                      var moveUp = that.game.add.tween(plusOne).to({y: that.sprite.y - 50}, 1000, Phaser.Easing.Linear.None, true);
                      var fade = that.game.add.tween(plusOne).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
                      fade.onComplete.add(function () {
                          plusOne = undefined;
                          moveUp = undefined;
                          fade = undefined;
                      }, this);

                      that.status = 'idle';
                      });
                  }
                  }(this);
                  this.task.energySource(acceptEnergy);
                  this.status = 'isLoading'
              }
          } else  {
              this.task();
          }
      }
  },
  assignTask: function (task) {
      if(this.task != null) {
          if(this.task.unregister != null) {
              this.task.unregister();
          }
          this.task = null;
          this.task = 'idle';
      }
      this.task = task;
  },
    getDisplayNames: function()
    {
        return [
            {name: 'Name', var: 'name'},
            {name: 'Age', var: 'age'},
            {name: 'SSN', var: 'ssn'},
            {name: 'Energy', var: 'energy', type: 'd'},
            {name: 'Health', var: 'health', type: 'd'},
            {name: 'Movespeed', var: 'moveSpeed', type: '2f'},
            {name: 'Collectspeed', var: 'collectSpeed', type: '2f'},
            {name: 'Reloadspeed', var: 'reloadSpeed', type: '2f'}

        ];
    },
    getUpgrades: function()
    {
        return [
            {name: 'Movespeed', var: 'moveSpeed', add: 0.01},
            {name: 'Collectspeed', var: 'collectSpeed', add: -0.01},
            {name: 'reloadSpeed', var: 'reloadSpeed', add: 0.01},
        ];
    },
    changeEnergy: function (amount) {
        this.energy += amount;
        if(this.energy<1) {
            this.sprite.loadTexture('dronex4');
        } else if(this.energy>=1 && this.energy <25) {
            this.sprite.loadTexture('dronex3');
        } else if(this.energy>=25 && this.energy <50) {
            this.sprite.loadTexture('dronex2');
        } else {
            this.sprite.loadTexture('dronex1');
        }
    }
};

function randomBetween(min, max) {
    return Math.floor(min + Math.random()*(max-min));
};