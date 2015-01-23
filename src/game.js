var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    resDisplay.preload();
}

function create() {
    ResourceStorage.resource1 = 0;
    ResourceStorage.resource2 = 0;
    ResourceStorage.resource3 = 0;
    resDisplay.create();
}

function update() {
    ResourceStorage.resource1 +=1;
    ResourceStorage.resource2 +=0.5;
    resDisplay.update();
}

var hub = new Hub();
var resDisplay = new ResourceDisplay();
hub.setSprite('test');

console.log(hub.sprite);