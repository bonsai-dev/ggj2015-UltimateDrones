function Factory(x, y, game, sprite){
    this.game = game;
    this.sprite = this.game.add.sprite(x,y, sprite);
    this.assignedWorkers = [];

    //this.sprite.body.customSeparateX = true;
    //this.sprite.body.customSeparateY = true;
    //this.sprite.body.immovable = true;
    this.storage = 0;
    this.maximumStorage = 100;
    this.productionRate = 0.01;
    this.textStyle =  {font: '25px Arial', fill: '#ffffff', align: 'left'};
    this.text = this.game.add.text(x, y, this.storage, this.textStyle);
}

Factory.prototype =
{

    tick: function()
    {
        /*if(this.storage <= this.maximumStorage){
            this.storage += this.productionRate;
        }*/
        this.text.setText(Math.min(Math.floor(this.storage),this.maximumStorage));


    },

    assignWorker: function (worker) {
        this.assignedWorkers.push(worker);
        worker.assignTask({
            type:"collectResource",
            area:{x1:100, x2:300, y1:100, y2:300},
            dropOff: {x:this.sprite.x, y:this.sprite.y},
            delivery: this.acceptResources()
        });
    },

    acceptResources: function() {
        var that = this;
        return function (resources) {
            that.storage += resources;
        }
    }

};