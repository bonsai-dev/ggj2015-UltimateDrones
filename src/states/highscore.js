/**
 * Created by jwasc_000 on 24.01.2015.
 */
'use strict'

function HighScore(){
    this.url = 'http://learned-thunder-834.appspot.com/';
    this.scores = null;
    this.textStyle =  {font: '25px Arial', fill: '#ffffff', align: 'left'};
    this.scoreText =  null;
    this.isSubmittedtText =  null;
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
        this.isSubmittedtText = this.game.add.text(20, 20, "", this.textStyle);
        this.inputText = this.game.add.text(20, 400, "", this.textStyle);
        game.input.keyboard.addCallbacks(this, null, null, this.keyPress);
    },

    keyPress: function(char){
        if(this.isSubmitted)
            return;
        console.log("-"+char+"-");
        this.name += char;
        if(char=='' || this.name.length > 10)
            this.post(this.name, Math.floor(Math.random()*99999));
    },

    update: function(){
        var parent = this;
        if(this.scores === null)
            return;
        var scoresString = '';
        this.scores.forEach(function(entry) {
            scoresString += entry.name+' | '+entry.country+' | '+entry.date+' | '+entry.score+"\n";
            //console.log(entry);
        });
        this.scoreText.setText(scoresString);
        this.isSubmittedtText.setText("Submitted: "+this.isSubmitted);
        this.inputText.setText(this.name);

    }
}