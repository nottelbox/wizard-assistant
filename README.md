# wizard-assistant

This is an interactive web application for counting points in the card game "wizard".
Currently it is a prototype which can be executed and allows fundamental use.
Wizard is a card game where the players give forecasts and try to fullfill them.
The number of cards equals the number of the round.
The sum of the forecasts must not be balanced. Therefore the last person to guess his or her result is probably restricted in choosing a forecast.

# Setup and Execution

This application uses a node.js backend. Therefore node.js is required for execution.
To run the app, clone this repository, install the dependencies with the node package manager ("npm install") and use the
command "node app.js" to host the webpage on port 3000 on your local machine.
Access the webpage under "localhost:3000" in your browser and start playing a round of wizard with your friends.

# Basic usage

1. On the landing page, register 3-6 players with their names in the order of play and select the first dealer or choose to get a random first dealer.
2. After hitting "Start Game", a dashboard appears which displays the dealer and prompts for inputs.
3. The dealer provides the cards.
4. Insert all forecasts from the players using the yellow buttons at the top. Forbidden numbers disappear.
5. Play the round.
6. Insert all results from the round. Forbidden numbers disappear. The result from the dealer is not prompted and will be calculated.
7. Check all displayed forecasts and results and delete if necessary with the red buttons. In this cases they are prompted again.
8. Confirm the round with the green button. The points are calculated and saved in the backend. An updated version of the dashboard will be delivered.
9. Repeat steps 3-8 until the final round.

# To Dos and Ideas

-Limit maximum amount of rounds and give a final view after completing a whole match
-Enable the restart of a game
-Fix indentation of numbers in the dashboard
-individual sites for different clients, each for one player
