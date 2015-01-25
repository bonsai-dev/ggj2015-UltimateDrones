/**
 * Created by jwasc_000 on 25.01.2015.
 */
function MissionScore(game){

    this.game = game;
    this.humansKilled = 0;
    this.timer = null;
    this.gameTime = 600*1000; //milliseconds
    this.multiplicator = 1;
}

MissionScore.prototype = {
    tick: function() {
        this.humansKilled+=0.15*this.multiplicator;
    },
    reset: function()
    {
        var game = this.game;
        console.log("timer create");
        this.timer = this.game.time.create(false);
        console.log("timer created");
        //10 seconds left
        this.timer.add(this.gameTime-10*1000, function()
            {
                var that = game;
                var timeWarning = game.add.text(0, game.camera.height/2, '10 seconds left!!!', { font: "60px Arial", fill: "#ffffffff", align: "left" });
                timeWarning.fixedToCamera = true;
                timeWarning.cameraOffset.x = (game.camera.width/2)-timeWarning.width/2;
                var tween = game.add.tween(timeWarning);
                tween.to( { alpha: 0x00 }, 750, Phaser.Easing.Cubic.InOut, false, 750, 3);
                console.log(tween.onComplete);
                //tween.onComplete.add(function(){that.remove(timeWarning);}, this);
                tween.start();
            }
            , this)
        //Game end
        this.timer.add(this.gameTime, function()
            {
                console.log("imter expired");
                game.state.start('highscore');
            }
            , this)
        this.timer.start();
        this.humansKilled+=0;
    }
};