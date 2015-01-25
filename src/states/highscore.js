/**
 * Created by jwasc_000 on 24.01.2015.
 */
'use strict'

function HighScore(){
    this.url = 'http://learned-thunder-834.appspot.com/';
    this.scores = null;
    this.textStyle =  {font: '25px Arial', fill: '#ffffff', align: 'left'};
    this.scoreText =  null;
    this.isSubmitted = false;
    this.name = "";
    this.nameText = null;
}

HighScore.prototype = {
    post: function(name, score){
        var parent = this;
        var xmlhttp;
        var data = JSON.stringify({'name': name, 'score': score});
        xmlhttp = new XMLHttpRequest();
        xmlhttp.context = this;
        xmlhttp.onreadystatechange = function(){parent.isSubmitted = true;};
        xmlhttp.open("POST", this.url, true);
        //xmlhttp.setRequestHeader('Content-Type','application/json');
        xmlhttp.send(data);
    },
    get: function()
    {
        var xmlhttp;
        xmlhttp = new XMLHttpRequest();
        xmlhttp.context = this;
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
                this.context.scores = JSON.parse(xmlhttp.responseText);
            }
        };
        xmlhttp.open("GET", this.url, true);
        xmlhttp.send();
    },

    preload: function(){
    },

    create: function(){
        this.get();
        this.scoreText = this.game.add.text(20, 60, "", this.textStyle);
        this.inputText = this.game.add.text(20, 650, "", this.textStyle);
        game.input.keyboard.addCallbacks(this, null, null, this.keyPress);
    },

    keyPress: function(char){
        if(this.isSubmitted) {
            if(char.charCodeAt(0)==13)
                game.state.start('menu');
            return;
        }
        if(char.charCodeAt(0)==13 || this.name.length > 10) { //Carriage-Return
            this.post(this.name, Math.floor(Math.random() * 99999));
            return;
        }
        if(char.charCodeAt(0)==8) { //Backspace
            this.name = this.name.slice(0, -1)
            return;
        }
        this.name += char;
    },

    update: function(){
        var parent = this;
        if(this.scores === null)
            return;
        var scoresString = '-->Highscores<--\n';
        this.scores.forEach(function(entry) {
            scoresString += entry.name+' | '+entry.country+' | '+entry.date+' | '+entry.score+"\n";
        });
        scoresString += '\n'
        + 'Congratulations. YOU killed '
        + this.game.missionScore.humansKilled
        + ' humans!';

        this.scoreText.setText(scoresString);

        var submittedText = '\n\nPress return to submit.';
        if(this.isSubmitted)
            submittedText = '\n\nScore submitted.'+' Press return to continue.';
        this.inputText.setText('Enter your name: '+this.name+' '+submittedText);

    }
}