/**
 * Created by jwasc_000 on 25.01.2015.
 */
function MissionScore(game){

    this.game = game;
    this.humansKilled = 0;
}

MissionScore.prototype = {
    tick: function() {
        this.humansKilled+=0.15;
    },
    reset: function()
    {
        this.humansKilled+=0;
    }
};