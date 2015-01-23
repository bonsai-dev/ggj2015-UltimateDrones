'use strict';

function ResourceDisplay(){
    this.game;

    this.res1Text = null;
    this.res2Text = null;
    this.res3Text = null;
    this.initText = "0";
    this.initStyle = { font: "20px Arial", fill: "#ff0044", align: "left" };
    this.resStorage = null;
}

ResourceDisplay.prototype.preload = function () {
    //do nothing yet
};

ResourceDisplay.prototype.create = function (resStorage) {
    this.resStorage = resStorage;

    this.res1Text = this.game.add.text(game.world.centerX-300, 0, this.initText, this.initStyle);
    this.res2Text = this.game.add.text(game.world.centerX+100, 0, this.initText, this.initStyle);
};

ResourceDisplay.prototype.update = function () {
    this.res1Text.setText("Resource 1: " +  this.resStorage.resource1);
    this.res2Text.setText("Resource 2: " +  this.resStorage.resource2);
    //this.res1Text.setText(ResourceStorage.resource1);
};