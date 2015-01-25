'use strict';

function Play(){
    this.resDisplay = null;
    this.resStorage = null;
    this.selectedUnit = null;
}

Play.prototype = {
    preload: function(){
        this.game.load.image('bg', 'assets/bg.png');
        this.game.load.image('dronex1', 'assets/dronex1.png');
        this.game.load.image('dronex2', 'assets/dronex2.png');
        this.game.load.image('dronex3', 'assets/dronex3.png');
        this.game.load.image('dronex4', 'assets/dronex4.png');
        this.game.load.image('dronex5', 'assets/dronex5.png');
        this.game.load.image('crystal', 'assets/crystal.png');
        this.game.load.image('energy', 'assets/energy.png');
        this.game.load.image('farm1', 'assets/farm1.png');
        this.game.load.image('up', 'assets/up.png');
        this.game.load.image('close', 'assets/x.png');
        this.game.load.image('hubBody', 'assets/main.png');
        this.game.load.spritesheet('hubRing', 'assets/ring.png',128,128);
        this.game.load.spritesheet('hubOver', 'assets/ringalpha.png',128, 128);
        this.game.load.spritesheet('fab1anim', 'assets/fab1anim.png', 128, 128);
        this.game.load.spritesheet('fab2', 'assets/fab2.png', 128, 128);
    },

    create: function(){
        this.resDisplay = new ResourceDisplay(game);
        this.resStorage = new ResourceStorage();

        //world setup
        this.game.world.setBounds(0, 0, 2048, 2048); //2000x2000
        this.land = this.game.add.tileSprite(0, 0, 2048, 2048, 'bg');
        //this.game.physics.startSystem(Phaser.Physics.ARCADE);
        //this.land.fixedToCamera = true;

        //set start resources
        this.resStorage.resource1 = 0;
        this.resStorage.resource2 = 0;
        this.resStorage.resource3 = 0;

        this.resDisplay.create(this.resStorage);


        this.testDrone = new Drone(50, 50, this.game);
        this.testDrone2 = new Drone(50, 50, this.game);
        this.testDrone3 = new Drone(50, 50, this.game);

        this.loadTestDrone = new Drone(100, 400, this.game);
        this.loadTestDrone.changeEnergy(-75);


        this.testFactory = new Factory(500,500,100,100,256, this.game, "fab1anim", 'farm1');
        this.testFactory.assignWorker(this.testDrone);
        this.testFactory.assignWorker(this.testDrone2);
        this.testFactory.assignWorker(this.testDrone3);

        this.EnergyFactory = new Factory(1000, 1000, 1500, 1500 ,256, this.game, "fab2", 'farm1');

       

        this.testHub = new Hub(1000, 300, this.game);
        this.testDrone.sprite.bringToTop();

        this.testDrone2.sprite.bringToTop();

        this.testDrone3.sprite.bringToTop();
        this.loadTestDrone.sprite.bringToTop();
        this.humansKilledText = this.game.add.text(0, 0, '', { font: "20px Arial", fill: "#ff0044", align: "left" });
        this.humansKilledText.fixedToCamera = true;
        this.unitDisplay = new UnitDisplay(100,100,game); //Unit Display soll über allem sein
    },


    update: function(){
        var game = this.game;
        game.missionScore.tick();
        this.humansKilledText.setText('Humans killed: '+Math.round(game.missionScore.humansKilled));
        this.humansKilledText.cameraOffset.x = this.game.camera.width - this.humansKilledText.width;
        this.humansKilledText.cameraOffset.y = 8;
        this.resStorage.resource1 +=1; //remove
        this.resStorage.resource2 +=2; //remove
        this.resDisplay.update();

        this.testDrone.tick();
        this.testDrone2.tick();
        this.testDrone3.tick();
        this.testFactory.tick();
        this.testHub.tick();
        this.loadTestDrone.tick();
        this.unitDisplay.show();
        //Objekte auswählen geht so:
        //getObjectsUnderPointer(pointer, group, callback, callbackContext)
        //if (Phaser.Rectangle.contains(seat.body, passenger.x, passenger.y))

        if (this.game.input.activePointer.isDown) {
            if (this.game.origDragPoint) {

                this.game.camera.x += this.game.origDragPoint.x - this.game.input.activePointer.position.x;
                this.game.camera.y += this.game.origDragPoint.y - this.game.input.activePointer.position.y;

                //this.drones[0].move(this.game.input.activePointer.position.x,this.game.input.activePointer.position.y);
            }
            //first tick, save current location
            this.game.origDragPoint = this.game.input.activePointer.position.clone();
        }
        else {
            this.game.origDragPoint = null;
        }

    },

    setSelectedUnit: function(unit){
        this.selectedUnit = unit;
        this.unitDisplay.setUnit(unit);
    }
};
