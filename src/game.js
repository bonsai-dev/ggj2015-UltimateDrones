var game = new Phaser.Game(1280, 800, Phaser.AUTO, 'Ultimate Drones');


var playState = new Play();
var menuState = new Menu();
var highscoreState = new HighScore();

game.state.add('play', playState);
game.state.add('menu', menuState);
game.state.add('highscore', highscoreState);
game.state.start('menu');