'use strict'

function Menu(){
    this.buttonStyle =  {font: '25px Arial', fill: '#ffffff', align: 'center'};
    this.titleStyle =  {font: '65px Arial', fill: '#ffffff', align: 'center'};
    
    this.titleText = null;
    this.playText = null;
    this.highscoreText = null;

}

Menu.prototype = {
    preload: function(){
        this.game.load.image('title', 'assets/title.png');
        this.game.load.image('titleback', 'assets/titleback.png');
        this.game.load.image('drones', 'assets/drones.png');

        this.game.load.spritesheet('start', 'assets/start.png', 263, 61);
        this.game.load.spritesheet('highscore', 'assets/high.png', 421, 52);


    },

    create: function(){
        var titleback = this.game.add.sprite(640, 180, 'titleback');
        titleback.anchor.setTo(0.5, 0.5);

        var drone = this.game.add.sprite(850, 440, 'drones');
        drone.anchor.setTo(0.5, 0.5);

        var title = this.game.add.sprite(640, 180, 'title');
        title.anchor.setTo(0.5, 0.5);

        game.add.tween(drone).to( { y: 470 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
        game.add.tween(title.scale).to( { x: 1.1, y: 1.1 }, 1300, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);


        var startButton = this.game.add.button(150, 550, 'start', this.startGame, this, 1, 0);
        var scoreButton = this.game.add.button(150, 620, 'highscore', this.startGame, this, 1, 0);

        startButton.events.onInputOver.add(function(btn){
            btn.scale.x = 1.1;
            btn.scale.y = 1.1;

        }, this);

        startButton.events.onInputOut.add(function(btn){
            btn.scale.x = 1;
            btn.scale.y = 1;

        }, this);

        scoreButton.events.onInputOver.add(function(btn){
            btn.scale.x = 1.1;
            btn.scale.y = 1.1;

        }, this);

        scoreButton.events.onInputOut.add(function(btn){
            btn.scale.x = 1;
            btn.scale.y = 1;

        }, this);



    },
    
    update: function(){
        //this.game.input.onDown.addOnce(this.startGame, this);
    },

    startGame: function(){
        this.game.state.start('play');
    }
}