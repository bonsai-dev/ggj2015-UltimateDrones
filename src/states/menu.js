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

    },

    create: function(){
        this.titleText = this.game.add.text(this.game.world.centerX, 80, 'Ultimate Drones', this.titleStyle);
        this.titleText.anchor.setTo(0.5, 0.5);
        this.playText = this.game.add.text(this.game.world.centerX, this.game.world.centerY, 'Play', this.buttonStyle);
        this.playText.anchor.setTo(0.5, 0.5);
        this.highscoreText = this.game.add.text(this.game.world.centerX, this.game.world.centerY + 30, 'Highscore', this.buttonStyle);
        this.highscoreText.anchor.setTo(0.5, 0.5);
    },
    
    update: function(){
        this.game.input.onDown.addOnce(this.startGame, this);
    },

    startGame: function(){
        this.game.state.start('play');
    }
}