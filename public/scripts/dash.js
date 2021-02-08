
let guessed = false;
let complete = false;
let counter = 0; //counts on the index of the players array
let collapsedButtonText = "0"; 
let players; // array with players' data
let round; //current round
let dealer; //stores the number (between 1 and numberOfPlayers) of the shuffler

// synchronous ajax calls to get players and round
$.ajaxSetup({async:false});
// get players array
$.get("/players", function(data, status){
    players = data;
});
// get number of current round
$.get("/round", function(data, status){
    round = data.round;
    //console.log(data);
});
// get first shuffler (number between 1 and numberOfPlayers)
$.get("/shuffler", function(data, status){
    dealer = data.firstShuffler;
});

console.log("firstShuffler from server: " + players[dealer-1].name);

//calculate current shuffler
//loop over rounds
for(let roundCounter = 1; roundCounter < round; ++roundCounter ) {
    console.log("shuffler calculator loop body executed");
    ++dealer;
    if(dealer > players.length){
        dealer = 1;
    }
}

console.log("calculated shuffler for this round: " + players[dealer-1].name);
//display shuffler
$("#shuffler").text("dealer: " + players[dealer-1].name);
/*
shuffler is not an index!
ex.:
registration: [Mari, Polli, Simon]
firstShuffler = 2 (Polli)
round - shuffler
1 - 2
2 - 3
3 - 1
4 - 2
5 - 3
*/

//sort players array to the right order for this round
//person after shuffler is asked first, shuffler is last
// [first, second, ... , shuffler]
// keep order as order of play
console.log("array before sorting:")
players.forEach(function(item, index){
    console.log("index: " + index + " name: " + item.name);
});


let cache = [];
console.log("sort array through right shifting...")
for(let i = (dealer - 1); i < players.length - 1; ++i){
    console.log("outer loop");
    cache[0] = players[players.length - 1];
    for(let j = 1; j < players.length; ++j) {
        console.log("inner loop");
        cache[j] = players[j-1];
    }
    players = cache;
    cache = [];
}

console.log("array after sorting:")
players.forEach(function(item, index){
    console.log("index: " + index + " name: " + item.name);
});



//ask for all players' forecasts then ask for all players' real wins
//put all the input in the hidden forms and post to server

//method displays current prompt in the h1 at the top of the page
function prompt(){
    if(guessed===false)
    $("#prompt").text("Tell me your future, " + players[counter].name + "!"); 
    else if(complete===false)
    $("#prompt").text("How did it turn out, " + players[counter].name + "?");
    else
    $("#prompt").text("Everything right? Please confirm!");
}
prompt();

function checkHide(){ //checks if there are buttons to hide or to show. 
                    //guessed and counter need to be updated first
    //console.log("called checkHide");
    if((guessed===false)&&(counter===(players.length-1))){//hide forbidden forecast button
        let forecastSum = 0;
        for(let guessNumber = 0; guessNumber<counter; ++guessNumber){ //loop over gathered guesses
            //sum up all the guesses
            forecastSum += parseInt($("#" + players[guessNumber].name + "guess").text());
            //console.log("forecastSum " + forecastSum);
        }
        let forbidden = /*parseInt(*/round/*)*/ - forecastSum;
        //console.log("forbidden: " + forbidden);
        if(forbidden<=round&&forbidden>=0){
            $('button:contains("' + forbidden + '")').css("visibility","hidden");
            collapsedButtonText = forbidden; //remember hidden button to show again later
        }
    } else { //show last hidden forecast button 
        $('button:contains("' + collapsedButtonText + '")').css("visibility","visible");
    }

    if(guessed===true){ //results: show only valid buttons and hide exceeding buttons
        //calculate current sum of results
        let resSum = 0;
        for(let i = 0; i < counter; ++i){
            resSum += parseInt($("#" + players[i].name + "result").text());
        }

        //show allowed and hide exceeding buttons
        for(let i = 0; i <= round; ++i){
            if((i + resSum) > round){
                //hide
                $('button:contains("' + i + '")').css("visibility", "hidden");
            } else{
                //show
                $('button:contains("' + i + '")').css("visibility", "visible");
            }
        }
    }

    //control delete buttons
    if(guessed===false&&counter===0){ //nothing there to delete, hide buttons
        $('button:contains(Delete)').css("visibility", "hidden");
    } else { //first input inserted, enable deletions
        $('button:contains(Delete)').css("visibility", "visible");
    }

    //control Confirm Button
    if(complete===false){
        $('button:contains("Confirm Round")').css("visibility","hidden");
    } else {
        $('button:contains("Confirm Round")').css("visibility","visible");
    }



};
checkHide();


//add event listeners to the buttons
$(".btn").click(function(){
if($(this).text()==="Confirm Round"){
    //send post request to server
    $("form").submit();
    
} else if($(this).text()==="Delete Last Input") {
    //remove last input and prompt it again
    if(guessed===false){ //a forecast has to be deleted
        //decrease counter
        counter--;
        //ignore html form, it will be overwritten
        //remove forecast from dashboard
        $("#" + players[counter].name + "guess").text("");
    } else if(counter===0){ //last input was the last forecast
        //update guessed and counter
        guessed = false;
        counter = players.length-1; //last array element
        //ignore html form entry
        //remove forecast from dashboard
        $("#" + players[counter].name + "guess").text("");
    } else if(complete===true){ //form was complete, delete last TWO results
        //update complete flag and counter
        complete = false;
        //counter stays the same, because it was not changed at completion
        //ignore html form entry
        //remove last two results from dashboard
        $("#" + players[counter].name + "result").text("");
        $("#" + players[counter+1].name + "result").text("");

    } else { //form was not complete, delete last result entry
        //decrease counter, which is >0
        counter--;
        //remove result from dashboard
        $("#" + players[counter].name + "result").text("");
    }
    //prompt last input again
    prompt();
    //change visibility of buttons
    checkHide();

} else if($(this).text()==="Delete Round") {
    //remove all guesses and results and prompt first forecast again
    //delete displayed values
    players.forEach(function(item, index){
        $("#" + item.name + "guess").text("");
        $("#" + item.name + "result").text("");
    });
    //ignore html form, it will be overwritten
    guessed = false;
    counter = 0;
    prompt();
    checkHide();


} else { //pressed a numbered button
    if(guessed===false){ //still forecasting...
        //save button text in hidden html form
        $("input[name =" + players[counter].name + "guess]").attr("value", $(this).text());
        //display input in dashboard
        $("#" + players[counter].name + "guess").text($(this).text());
        //update guessed-boolean and counter 
        if(counter<=(players.length-2)){ //need another forecast
            //increase counter
            counter++;
        }
        else{ //forecasts finished, go for results
            guessed = true;
            counter = 0;
        }
        
    } else { //entering round results...
        //check if input valid -> do this with button hide in hideCheck()

        //save button text in hidden html form
        $("input[name =" + players[counter].name + "result]").attr("value", $(this).text());
        //display button text in dashboard
        $("#" + players[counter].name + "result").text($(this).text());
        
        //check if complete else update counter
        //last result is not necessary, it is calculated
        if(counter<=(players.length-3)){ //need another result
            counter++;
        } else { //calculate last result and change boolean complete
            let resultSum = 0; //calculate value
            for(let p = 0;p<=counter; ++p){ 
                resultSum += parseInt($("#" + players[p].name + "result").text());
            }
            let lastResult = round - resultSum;
            //save lastResult in hidden html form
            $("input[name =" + players[players.length-1].name + "result]").attr("value", lastResult);
            //display lastResult in dashboard
            $("#" + players[players.length-1].name + "result").text(lastResult);
            complete = true;
        }
        
        }
        //prompt next
        prompt();

        //hide or show buttons
        checkHide();
}
}
);


