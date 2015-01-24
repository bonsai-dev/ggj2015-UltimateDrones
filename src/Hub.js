function Hub(x, y, game, sprite){
    this.game = game;
    this.sprite = this.game.add.sprite(x,y, sprite);
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
            position: {x:this.sprite.x, y:this.sprite.y},
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