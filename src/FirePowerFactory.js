function FirePowerFactory(x, y, xFarm, yFarm, sizeFarm, game, sprite, farmSprite){
    this.game = game;
    this.sprite = this.game.add.sprite(x,y, sprite);
    this.sprite.animations.add('active');
    this.sprite.animations.play('active', 6, true);
    this.sprite.inputEnabled = true;
    this.assignedWorkers = [];

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

    //this.sprite.body.customSeparateX = true;
    //this.sprite.body.customSeparateY = true;
    //this.sprite.body.immovable = true;
    this.storage = 0;
    this.maximumStorage = 100;
    this.productionRate = 0.01;
    this.textStyle =  {font: '25px Arial', fill: '#ffffff', align: 'left'};
    this.text = this.game.add.text(x, y, this.storage, this.textStyle);
    this.farmCoords = {
        x1: xFarm,
        x2: xFarm+sizeFarm,
        y1: yFarm,
        y2: yFarm+sizeFarm
    }
    this.farmImage = this.game.add.tileSprite(this.farmCoords.x1, this.farmCoords.y1, sizeFarm, sizeFarm, farmSprite);
    this.upgradePrice = {resource1: 0,resource2: 100, resource3: 0};

}

FirePowerFactory.prototype =
{

    tick: function()
    {
        /*if(this.storage <= this.maximumStorage){
            this.storage += this.productionRate;
        }*/
        this.text.setText(Math.min(Math.floor(this.storage),this.maximumStorage));
        this.game.missionScore.multiplicator = this.storage/1000;

    },

    assignWorker: function (worker) {
        this.assignedWorkers.push(worker);
        worker.assignTask({
            type:"collectResource",
            area:this.farmCoords,
            dropOff: {x:this.sprite.x, y:this.sprite.y},
            delivery: this.acceptResources(),
            unregister: function (mThis, mWorker) {
                var that = mThis;
                var worker = mWorker;
                return function () {
                    that.deleteWorkerFromPool(worker);
                }
            }(this, worker)
        });
    },

    acceptResources: function() {
        var that = this;
        return function (resources) {
            that.storage += resources;
        }
    },
    getDisplayNames: function()
    {
        return [
            {name: 'Assigned workers', var: 'assignedWorkers', type: 'count'},
            {name: 'Storage', var: 'storage', type: 'd'},
            {name: 'Production rate', var: 'productionRate', type: '2f'}
        ];
    },
    getUpgrades: function()
    {
        return [
            {name: 'Collect speed', var: 'productionRate', add: 0.01},
        ];
    },
    deleteWorkerFromPool: function (worker) {
        for(var i=0; i<this.assignedWorkers.length; i++) {
            if(this.assignedWorkers[i].ssn === worker.ssn) {
                this.assignedWorkers.splice(i, 1);
                return;
            }
        }
    }


};