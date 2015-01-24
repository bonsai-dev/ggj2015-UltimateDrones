'use strict';

function ResourceDisplay(game){
    this.game = game;

    this.res1Text = null;
    this.res2Text = null;
    this.res3Text = null;
    this.initText = "0";
    this.initStyle = { font: "20px Arial", fill: "#ff0044", align: "left" };
    this.resStorage = null;
}


ResourceDisplay.prototype.create = function (resStorage) {
    this.resStorage = resStorage;

    this.res1Text = this.game.add.text(0, 0, this.initText, this.initStyle);
    this.res1Text.fixedToCamera = true;
    this.res2Text = this.game.add.text(250, 0, this.initText, this.initStyle);
    this.res2Text.fixedToCamera = true;
    this.res3Text = this.game.add.text(500, 0, this.initText, this.initStyle);
    this.res3Text.fixedToCamera = true;
};

ResourceDisplay.prototype.update = function () {
    this.res1Text.setText(Static.Strings.Resources.resource1Name + ": " +  this.resStorage.resource1);
    this.res2Text.setText(Static.Strings.Resources.resource2Name + ": " +  this.resStorage.resource2);
    this.res3Text.setText(Static.Strings.Resources.resource3Name + ": " +  this.resStorage.resource3);
};