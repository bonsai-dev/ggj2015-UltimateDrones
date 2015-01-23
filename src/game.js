var game = new Phaser.Game(1280, 800, Phaser.AUTO, 'Ultimate Drones');


var playState = new Play();
var menuState = new Menu();

game.state.add('play', playState);
game.state.add('menu', menuState);
game.state.start('menu');