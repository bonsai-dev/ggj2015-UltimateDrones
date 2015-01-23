'use strict';

function Play(){
    this.resDisplay = new ResourceDisplay();
    this.resStorage = new ResourceStorage();
}

Play.prototype = {
    preload: function(){
        this.resDisplay.preload();
        this.resDisplay.game = this.game;
    },

    create: function(){


        this.resStorage.resource1 = 0;
        this.resStorage.resource2 = 0;
        this.resStorage.resource3 = 0;

        this.resDisplay.create(this.resStorage);
    },
    update: function(){
        this.resStorage.resource1 +=1;
        this.resStorage.resource2 +=0.5;
        this.resDisplay.update();
    }
}