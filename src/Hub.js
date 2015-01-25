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
        {x:x+128-32, y:y, worker: null, id:1},
        {x:x+256-64, y:y+128-32, worker: null, id:2},
        {x:x, y:y+128-32, worker: null, id:3},
        {x:x+128-32, y:y+256-64, worker: null, id:4}
    ];

    this.sprite.inputEnabled = true;
    var parent = this;
    this.sprite.events.onInputDown.add(function(sprite, pointer){
        if(game.state.getCurrentState().selectedUnit instanceof Drone)
        {
            console.log("Assign Drone to Hub");
            parent.assignWorker(game.state.getCurrentState().selectedUnit);
            game.state.getCurrentState().selectedUnit = null;
            return;
        }
        if(game.state.getCurrentState().selectedUnit == null)
        {
            game.state.getCurrentState().selectedUnit = parent;
        }
    }, this);

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
            energySource: this.giveEnergy()
        });
        console.log("assigned worker to slot ", this.reloadSlots[freeSlotId]);
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
            {name: 'Storage', var: 'storedEnergy'},
            {name: 'Maximum storage', var: 'maxStoredEnergy'},
            {name: 'Regeneration rate', var: 'energyRegeneration'}
        ];
    }

};