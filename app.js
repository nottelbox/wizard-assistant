//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

let registered = false;
let numberOfPlayers;
let players=[];
let round = 1;
let firstShuffler;

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req, res){ //home route leads to register page and dashboard
    if(registered===false){
        res.render("register");
    } else {
        res.render("dashboard", {players:players, round:round});
    }
});
//ajax route for the players array
app.get("/players", function(req, res){
    res.send(players);
});

app.get("/round", function(req, res){
    res.send({round:round});
});

app.get("/shuffler", function(req, res){
    res.send({firstShuffler:firstShuffler});
});

app.post("/register", function(req, res){

    numberOfPlayers = req.body.playerCount;
    firstShuffler = req.body.shuffler;
    if(firstShuffler==="random"){
        //random number between 1 and numberOfPlayers
        firstShuffler = Math.floor(Math.random()*numberOfPlayers) + 1;
    } else {
        firstShuffler = parseInt(firstShuffler); //number between 1 and numberOfPlayers
    }
    //console.log("firstShuffler: " + firstShuffler + " type: " + typeof(firstShuffler));
    //firstShuffler contains the number of the player who shuffles in the first round
    //get player names
    for(let i = 1; i<=numberOfPlayers; ++i) {
        players.push({name:req.body["player"+i]}); //array keeps order of registering!
    }
    //console.log(players);

    registered = true;
    res.redirect("/");
});

app.post("/round", function(req, res){
    //modify players array, increase round and redirect to /
    //loop over players and add guess/result to their objects
    //console.log(req.body);

    players.forEach(player => { //loop over player array
        let points; //variable for points calculation
        let guess = req.body[player.name + "guess"];
        //console.log("guess: " + guess);
        let result = req.body[player.name + "result"];
        //console.log("result: " + result);
        if(round === 1){ //first round -> initialize variable
            points = 0;
        } else { //get last points from previous round
            points = player["round" + (round-1)].points;
        }
        if(guess===result) {// good round
            //increase points
            points += 20;
            points += result*10;
        } else { //bad round
            //decrease points
            points -= Math.abs(guess-result)*10;
        }
        player["round" + round] = {
            guess: guess,
            points: points
        };  
        
    });
    round++;
    res.redirect("/");

});

app.listen(3000, function(){
    console.log("server runs on port 3000");
});