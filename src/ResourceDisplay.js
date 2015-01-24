'use strict';

function ResourceDisplay(game){
    this.game = game;

    this.res1Text = null;
    this.res1Image = null;
    this.res2Text = null;
    this.res2Image = null;
    this.res3Text = null;
    this.res3Image = null;

    this.initText = "0";
    this.initStyle = { font: "20px Arial", fill: "#ff0044", align: "left" };
    this.resStorage = null;
}


ResourceDisplay.prototype.create = function (resStorage) {
    this.resStorage = resStorage;

    this.res1Text = this.game.add.text(35, 8, this.initText, this.initStyle);
    this.res1Text.fixedToCamera = true;
    this.res1Image = this.game.add.image(0,0, 'crystal');
    this.res1Image.fixedToCamera = true;
    this.res1Image.scale = new PIXI.Point(0.5, 0.5);

    this.res2Text = this.game.add.text(250, 8, this.initText, this.initStyle);
    this.res2Text.fixedToCamera = true;
    this.res2Image = this.game.add.image(215,0, 'crystal');
    this.res2Image.fixedToCamera = true;
    this.res2Image.scale = new PIXI.Point(0.5, 0.5);

    this.res3Text = this.game.add.text(500, 8, this.initText, this.initStyle);
    this.res3Text.fixedToCamera = true;
    this.res3Image = this.game.add.image(465,0, 'crystal');
    this.res3Image.fixedToCamera = true;
    this.res3Image.scale = new PIXI.Point(0.5, 0.5);

};

ResourceDisplay.prototype.update = function () {
    this.res1Text.setText(Static.Strings.Resources.resource1Name + ": " +  this.resStorage.resource1);
    this.res2Text.setText(Static.Strings.Resources.resource2Name + ": " +  this.resStorage.resource2);
    this.res3Text.setText(Static.Strings.Resources.resource3Name + ": " +  this.resStorage.resource3);
};