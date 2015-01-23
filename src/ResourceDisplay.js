function ResourceDisplay(){
    this.res1Text = null;
    this.res2Text = null;
    this.res3Text = null;
    this.initText = "0";
    this.initStyle = { font: "20px Arial", fill: "#ff0044", align: "left" };
}

ResourceDisplay.prototype.preload = function () {
    //do nothing yet
};

ResourceDisplay.prototype.create = function () {
    this.res1Text = game.add.text(game.world.centerX-300, 0, this.initText, this.initStyle);
    this.res2Text = game.add.text(game.world.centerX+100, 0, this.initText, this.initStyle);
};

ResourceDisplay.prototype.update = function () {
    this.res1Text.setText(Resource.Resource_1.name + ": " +  ResourceStorage.resource1);
    this.res2Text.setText(Resource.Resource_2.name + ": " +  ResourceStorage.resource2);
    //this.res1Text.setText(ResourceStorage.resource1);
};