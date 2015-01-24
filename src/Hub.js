function Hub(x, y, game){
    this.game = game;


    //sprites
    this.body = this.game.add.sprite(x,y, 'hubBody');
    this.body.scale = new PIXI.Point(2, 2);
    this.ring = this.game.add.sprite(x,y, 'hubRing', 3);
    this.ring.scale = new PIXI.Point(2, 2);
    this.ringOverlay = this.game.add.sprite(x,y, 'hubOver', 3);
    this.ringOverlay.scale = new PIXI.Point(2, 2);

    //this.ringOverlay.alpha = 0.5;
    //this.ringOverlay.blendMode = PIXI.blendModes.HUE;
    game.add.tween(this.ringOverlay).to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true, 0, 1000, true);


    this.assignedWorkers = [];

    this.text = this.game.add.text(x, y, this.storage, this.textStyle);

    this.storedEnergy = 0;
    this.maxStoredEnergy = 100;
    this.energyRegeneration = 0.1;

    this.reloadSlots = {
      slot1: null,
      slot2: null,
      slot3: null
    };

    this.sprite.inputEnabled = true;
    var parent = this;
    this.sprite.events.onInputDown.add(function(sprite, pointer){
        if(game.selectedUnit instanceof Drone)
        {
            console.log("Assign Drone to Hub")
            parent.assignWorker(game.selectedUnit);
            game.selectedUnit = null;
        }
        if(game.selectedUnit == null)
        {
            game.selectedUnit = parent;
        }
    }, this);

}

Hub.prototype =
{

    tick: function(){

        //regeneration
        if(this.storedEnergy <= this.maxStoredEnergy){
            this.storedEnergy += this.energyRegeneration;
        }


    },

    assignWorker: function (worker) {
        this.assignedWorkers.push(worker);
        worker.assignTask({
            type:"reloadFromHub",
            position: {},
            slot: null,
            energySource: this.giveEnergy()
        });
    },

    giveEnergy: function() {
        var that = this;
        return function (acceptEnergy) {
            console.log("accessing energy source");
            if(that.storedEnergy >= 1) {
                that.storedEnergy -= 1;
                acceptEnergy(1);
            } else {
                acceptEnergy(0);
            }
        }
    }

};