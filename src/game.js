var game = new Phaser.Game(800, 600, Phaser.AUTO, 'Ultimate Drones');


var playState = new Play();

game.state.add('play', playState);
game.state.start('play');
