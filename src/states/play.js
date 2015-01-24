'use strict';

function Play(){
    this.resDisplay = null;
    this.resStorage = null;
}

Play.prototype = {
    preload: function(){
        this.game.load.image('bg', 'assets/tile.jpg');
        this.game.load.image('spacer', 'assets/spacer.jpg');
    },

    create: function(){
        this.resDisplay = new ResourceDisplay(game);
        this.resStorage = new ResourceStorage();

        //world setup
        this.game.world.setBounds(0, 0, 2048, 2048); //2000x2000
        this.land = this.game.add.tileSprite(0, 0, 2000, 2000, 'bg');
        //this.land.fixedToCamera = true;

        //set start resources
        this.resStorage.resource1 = 0;
        this.resStorage.resource2 = 0;
        this.resStorage.resource3 = 0;

        this.resDisplay.create(this.resStorage);
        this.drone1 = new Drone(10, 10, this.game);
        this.drone1.move(300, 300);
        this.drone2 = new Drone(10, 10, this.game);
        this.drone2.move(600, 600);
    },
    update: function(){
        this.resStorage.resource1 +=1;
        this.resStorage.resource2 +=0.5;
        this.resDisplay.update();


        if (this.game.input.activePointer.isDown) {
            if (this.game.origDragPoint) {

                this.game.camera.x += this.game.origDragPoint.x - this.game.input.activePointer.position.x;
                this.game.camera.y += this.game.origDragPoint.y - this.game.input.activePointer.position.y;
            }
            //first tick, save current location
            this.game.origDragPoint = this.game.input.activePointer.position.clone();
        }
        else {
            this.game.origDragPoint = null;
        }

    }
}