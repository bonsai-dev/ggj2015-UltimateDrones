function Hub(x, y, game){
    this.game = game;


    //sprites
    this.sprite = this.game.add.sprite(x,y, 'hubBody');
    this.sprite.scale = new PIXI.Point(2, 2);
    this.ring = this.game.add.sprite(x,y, 'hubRing');
    this.ring.scale = new PIXI.Point(2, 2);
    this.ringOverlay = this.game.add.sprite(x,y, 'hubOver');
    this.ringOverlay.scale = new PIXI.Point(2, 2);

    //this.ringOverlay.alpha = 0.5;
    //this.ringOverlay.blendMode = PIXI.blendModes.HUE;
    game.add.tween(this.ringOverlay).to( { alpha: 0 }, 1000, Phaser.Easing.Quadratic.Out, true, 0, 1000, true);



    this.assignedWorkers = [];

    this.text = this.game.add.text(x, y, this.storage, this.textStyle);

    this.storedEnergy = 0;
    this.maxStoredEnergy = 100;
    this.energyRegeneration = 0.1;

    this.reloadSlots = [
        {x:x+128-32, y:y, worker: null, id:0},
        {x:x+256-64, y:y+128-32, worker: null, id:1},
        {x:x, y:y+128-32, worker: null, id:2},
        {x:x+128-32, y:y+256-64, worker: null, id:3}
    ];

    this.sprite.inputEnabled = true;
    var parent = this;
    this.sprite.events.onInputDown.add(function(sprite, pointer){
        if(game.state.getCurrentState().selectedUnit instanceof Drone)
        {
            parent.assignWorker(game.state.getCurrentState().selectedUnit);
            game.state.getCurrentState().setSelectedUnit(null);
            return;
        }
        if(game.state.getCurrentState().selectedUnit == null)
        {
            game.state.getCurrentState().setSelectedUnit(parent);
        }
    }, this);
    this.upgradePrice = {resource1: 100,resource2: 100, resource3: 0};

}

Hub.prototype =
{

    setRingFrame: function(frame){
        this.ring.frame = frame;
        this.ringOverlay.frame = frame;
    },

    tick: function(){

        //regeneration
        if(this.storedEnergy <= this.maxStoredEnergy){
            this.storedEnergy += this.energyRegeneration;
        }


    },

    assignWorker: function (worker) {
        var freeSlotId = this.getFreeSlotId();
        if(freeSlotId === null) {
            return;
        } else {
            this.reloadSlots[freeSlotId].worker = worker;
        }
        this.assignedWorkers.push(worker);
        worker.assignTask({
            type:"reloadFromHub",
            position: {},
            slot: this.reloadSlots[freeSlotId],
            energySource: this.giveEnergy(),
            unregister: function (mThis, mWorker) {
                var that = mThis;
                var worker = mWorker;
                return function() {
                    that.deleteWorkerFromPool(worker);
                    that.reloadSlots[worker.task.slot.id].worker = null;
                }
            }(this, worker)
        });
    },

    giveEnergy: function() {
        var that = this;
        return function (acceptEnergy) {
            if(that.storedEnergy >= 1) {
                that.storedEnergy -= 1;
                acceptEnergy(1);
            } else {
                acceptEnergy(0);
            }
        }
    },

    getFreeSlotId: function () {
        for(var i=0; i<this.reloadSlots.length; i++) {
            if(this.reloadSlots[i].worker===null) {
                return i;
            }
        }
        return null;
    },
    getDisplayNames: function()
    {
        return [
            {name: 'Assigned workers', var: 'assignedWorkers', type: 'count'},
            {name: 'Storage', var: 'storedEnergy', type: 'd'},
            {name: 'Maximum storage', var: 'maxStoredEnergy', type: 'd'},
            {name: 'Regeneration rate', var: 'energyRegeneration', type: '2f'}
        ];
    },
    getUpgrades: function()
    {
        return [
            {name: 'Maximum Energy', var: 'maxStoredEnergy', add: 1},
            {name: 'Energy regeneration', var: 'energyRegeneration', add: 0.01},
        ];
    },
    deleteWorkerFromPool: function (worker) {
        for(var i=0; i<this.assignedWorkers.length; i++) {
            if(this.assignedWorkers[i].ssn === worker.ssn) {
                this.assignedWorkers.splice(i, 1);
            }
        }
    }

};