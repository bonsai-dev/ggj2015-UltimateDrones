/**
 * Created by jwasc_000 on 24.01.2015.
 */
'use strict'

function HighScore(){
    this.url = 'http://localhost:8080/';
    this.scores = null;
    this.textStyle =  {font: '25px Arial', fill: '#ffffff', align: 'left'};
    this.scoreText =  null;
    this.isSubmittedtText =  null;
    this.isSubmitted = false;
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
        this.post("Success", Math.floor(Math.random()*99999)%99999);
        this.get();
        this.scoreText = this.game.add.text(20, 60, "", this.textStyle);
        this.isSubmittedtText = this.game.add.text(20, 20, "", this.textStyle);
    },
    update: function(){
        var parent = this;
        if(this.scores === null)
            return;

        var scoresString = '';
        this.scores.forEach(function(entry) {
            scoresString += entry.name+' | '+entry.date+' | '+entry.score+"\n";
            //console.log(entry);
        });
        this.scoreText.setText(scoresString);
        this.isSubmittedtText.setText("Submitted: "+this.isSubmitted)

    }
}