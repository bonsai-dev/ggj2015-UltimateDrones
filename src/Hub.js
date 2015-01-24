function Hub(x, y, game, sprite){
    this.game = game;
    this.sprite = this.game.add.sprite(x,y, sprite);
    this.assignedWorkers = [];

    this.text = this.game.add.text(x, y, this.storage, this.textStyle);

    this.storedEnergy = 0;
    this.maxStoredEnergy = 100;
    this.energyRegeneration = 0.1;

    this.reloadSlots = {
        slot1: {x:x-10, y:y-10, worker: null},
        slot2: {x:x-10, y:y, worker: null},
        slot3: {x:x, y:y-10, worker: null},
        slot4: {x:x, y:y-20, worker: null}
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
        var freeSlot = this.getFreeSlot();
        if(freeSlot === null)
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
    },

    getFreeSlot: function () {
        if(slot1.worker === null) {
            return slot1;
        }
        if(slot2.worker === null) {
            return slot2;
        }
        if(slot3.worker === null) {
            return slot3;
        }
        if(slot4.worker === null) {
            return slot4;
        }
        return null;
    }

};