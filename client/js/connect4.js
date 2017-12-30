////////////////////////
//Socket/node.js stuff
////////////////////////
var socket = io();

//update grid from server
socket.on('updateGrid', function(data) {

    if(online == true)
    {
        grid = data;

        refreshGrid();
    }

});
//update current turn from server
socket.on('updateTurn', function(data) {

    if(online == true)
    {
        turn = data;

        if(gameOver == false)
        {
            if(turn == 'red')
            {
                text.innerHTML = "Red Player's Turn";
                text.style.color = "red";

            }
            else if(turn == 'yellow')
            {
                text.innerHTML = "Yellow Player's Turn";
                text.style.color = "yellow";
            }
        }


    }
});
//update gameOver state from server
socket.on('updateGameOver', function(data) {

    if(online == true)
    {
        gameOver = data;

        if(gameOver == true && turn == 'yellow')
        {
            text.innerHTML = "Red Player is the winner!";
            text.style.color = "red";
        }
        else if(gameOver == true && turn == 'red')
        {
            text.innerHTML = "Yellow Player is the winner!";
            text.style.color = "yellow";
        }
    }
});
////////////////////////

        //circle object
        var circle = {
            yellow:
            {
                name: 'Yellow Player',
                colour: 'yellow',
            },
            red:
            {
                name: 'Red Player',
                colour: 'red',
            }
        };

        //game grid
        var grid = [
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
        ];

        var ai = false; //player vs AI mode
        var online = false; //online mode

        var turn = 'red'; //current turn
        var firstMove = true;
        var bestMove = false; //if best move is found for the AI
        var freeSpace = false; //if free space near previous AI move is available
        var columnFull = false;
        var aiCol = 0; //column of AI's current move
        var AIlastMoveCol = 0; //column of AI's previous move
        var AIlastMoveRow = 0; //row of AI's previous move
        var gameOver = false; //game over state

        text = document.getElementById('text'); //get text above the canvas
        gmText = document.getElementById('gameModeText'); //get gamemode text above buttons

        //get canvas and access to draw on it
        canvas = document.getElementById('connect4');
        context = canvas.getContext('2d');

        //Mouse click listener
        canvas.addEventListener('click', function(evt) {

            var column = 0;

            if(gameOver == false)
            {
              if(turn == 'red')
              {
                  if(ai == false)
                  {

                      column = getColumnClick(event); //Find which column was clicked on
                      checkColumn(column); //Check if column is full

                      if(columnFull == false)
                      {
                          //change text to allow players to see whos turn it is
                          text.innerHTML = "Yellow Player's Turn";
                          text.style.color = "yellow";
                          //change players turn to yellow
                          turn = 'yellow';

                          drawCircle(column, 'red');

                      }
                      else if(columnFull == true)
                      {
                         text.innerHTML = "Column is Full"
                      }

                  }
                  else if(ai == true)
                  {
                      column = getColumnClick(event); //Find which column was clicked on
                      checkColumn(column); //Check if column is full

                      if(columnFull == false)
                      {
                          drawCircle(column, 'red');

                          if(gameOver != true)
                          {
                              var column;

                              bestMove = false;
                              freeSpace = false;
                              aiCol = 0;

                              AIfindBestMove('yellow'); //check if AI is 1 from a 4 in a row, this will favor over the above
                              AIfindBestMove('red'); //check if player is 1 from a 4 in a row

                              //If no best moves were round, and not first turn, check for next best move
                              if(bestMove == false && firstMove == false)
                              {
                                  AIfindNextBestMove(AIlastMoveRow, AIlastMoveCol);
                              }

                              firstMove = false; //first AI move is no longer true

                              if(bestMove == true)
                              {
                                  column = aiCol + 1;
                              }
                              //check if free space near previous turn is true, and column is not out of grid range
                              else if(freeSpace == true && aiCol < 7)
                              {
                                  column = aiCol + 1;
                              }
                              else
                              {
                                  //This only happens on first turn and if no space near previous turn
                                  column = Math.floor((Math.random() * 7) + 1);
                              }

                          //reset text back, in case it was change by column being full
                          text.innerHTML = "Red Player's Turn";

                          drawCircle(column - 1, 'yellow');

                          }
                      }
                      else if(columnFull == true)
                      {
                          text.innerHTML = "Column is Full"
                      }

                  }

              }
              else if(turn == 'yellow')
              {

                  column = getColumnClick(event);
                  checkColumn(column);

                  if(columnFull == false)
                  {
                      text.innerHTML = "Red Player's Turn";
                      text.style.color = "red";
                      turn = 'red';

                      drawCircle(column, 'yellow');
                  }
                  else if(columnFull == true)
                  {
                      text.innerHTML = "Column is Full"
                  }
              }

              refreshGrid();

              if(online == true)
              {
                  //send current grid and turn to the server
                  socket.emit('sendGrid',grid);
                  socket.emit('sendTurn',turn);
              }
            }
        });

        //Draw grid, loop through every item in grid array and call calculateCircle
        function refreshGrid() {
          for(row = 0; row < grid.length; row++) {
            for(col = 0; col < grid[row].length; col++) {
                calculateCircle(col, row, grid[row][col]);
            }
          }
        }
        //set all items in the grid array to blank
        function resetGrid() {
          for(row = 0; row < grid.length; row++) {
            for(col = 0; col < grid[row].length; col++) {
                grid[row][col] = '';
            }
          }
          resetGame();
        }

        //reset all global variables locally and on server
        function resetGame() {
          //make sure game starts on red players turn after reset
          turn = 'red';

          //tell the server that the turn is reset
          socket.emit('sendTurn',turn);

          //reset gameOver state
          gameOver = false;
          //tell the server that gameOver is back to false
          socket.emit('sendGameOver',gameOver);

          firstMove = true;

          text.innerHTML = "Red Player's Turn";
          text.style.color = "red";

          refreshGrid();
        }

        //Calculate the row and column into exact coordinates on canvas
        function calculateCircle(col, row, name) {

          //cx = center x y coordinates calculated from column and row number
          var centerX = (canvas.width / 7) * (col + 1) - 50;
          var centerY = canvas.height - ((canvas.height / 6) * (row + 1) - 50);

          if(name == "red")
          {
              createCircle(centerX, centerY, circle.red.colour);
          }
          else if(name == "yellow")
          {
              createCircle(centerX, centerY, circle.yellow.colour);
          }
          //if no name is specificied, for example if it is blank, fill with white circle, this is done for all empty circles
          else
          {
              createCircle(centerX, centerY, 'white');
          }
        }

        //Draw circle, parameters: x and y coordinates and colour
        function createCircle(x, y, circleColour) {

            context.beginPath();
            context.arc(x, y, 45, 0, 2 * Math.PI, false); //Draw circle, x and y are the middle coordinates for the circle, third parameter is radius, arc is the shape used for a circle
            context.fillStyle = circleColour;
            context.fill();
        }

        //Add circle colour into grid array
        //loop through rows on the column and check if its empty, first empty row add the circle of chosen colour and end loop
        function drawCircle(column, colour) {
            for (var row = 0; row < grid.length; row++)
            {
                if(grid[row][column] == '')
                {
                    grid[row][column] = colour;

                    checkForWin(row, column, colour);

                    if(ai == true)
                    {
                        if(colour == 'yellow')
                        {
                            AIlastMoveCol = column;
                            AIlastMoveRow = row;
                        }
                    }

                    return true;
                }
            }
            return false;

        }

        //Find out which column is clicked
        function getColumnClick(event) {
            //get the horizontal coordinates of the click on canvas
            var rect = canvas.getBoundingClientRect();
            var x = event.clientX - rect.left;

            //divide the x coordinate by 100 because canvas is 700 pixels wide and grid is 7 wide, then round down (this will give number from 1-7)
            return Math.floor(x / 100);
        }

        //Find the best move for the AI, this checks for 3 in a rows of either colour
        function AIfindBestMove(colour) {

            var row;

            //loop through all columns
            for(var col = 0; col < 7; col++)
            {
                //get the first empty row in the column
                row = checkColumn(col);

                //if a best move is found, do not continue searching
                if(columnFull == false)
                {
                  //Check for 3 up
                  if(row > 1)
                  {
                    //check for 2 upwards, replace aiCol if there is 3 upwards
                    if(grid[row-1][col] == colour && grid[row-2][col] == colour)
                    {
                      //aiCol = col;
                      //bestMove = true;

                      if(row > 2 && grid[row-3][col] == colour)
                      {
                        aiCol = col;
                        bestMove = true;
                      }
                    }
                  }
                  //Check for 3 to the right
                  //XOOO//
                  if(grid[row][col+1] == colour && grid[row][col+2] == colour && grid[row][col+3] == colour)
                  {
                      aiCol = col;
                      bestMove = true;
                  }
                  //Check for 3 to the left
                  //OOOX//
                  if(grid[row][col-1] == colour && grid[row][col-2] == colour && grid[row][col-3] == colour)
                  {
                      aiCol = col;
                      bestMove = true;
                  }
                  //OOXO//
                  if(grid[row][col+1] == colour && grid[row][col-1] == colour && grid[row][col-2] == colour)
                  {
                      aiCol = col;
                      bestMove = true;
                  }
                  //OXOO//
                  if(grid[row][col-1] == colour && grid[row][col+1] == colour && grid[row][col+2] == colour)
                  {
                      aiCol = col;
                      bestMove = true;
                  }
                  /////O//
                  ////O///
                  ///O////
                  //X/////
                  if (row < 3)
                  {
                    if(grid[row+1][col+1] == colour && grid[row+2][col+2] == colour && grid[row+3][col+3] == colour)
                    {
                        aiCol = col;
                        bestMove = true;
                    }
                  }
                  /////X//
                  ////O///
                  ///O////
                  //O/////
                  if (row > 2)
                  {
                    if(grid[row-1][col-1] == colour && grid[row-2][col-2] == colour && grid[row-3][col-3] == colour)
                    {
                        aiCol = col;
                        bestMove = true;
                    }
                  }
                  //O/////
                  ///O////
                  ////O///
                  /////X//
                  if (row < 3)
                  {
                    if(grid[row+1][col-1] == colour && grid[row+2][col-2] == colour && grid[row+3][col-3] == colour)
                    {
                        aiCol = col;
                        bestMove = true;
                    }
                  }
                  //X/////
                  ///O////
                  ////O///
                  /////O//
                  if (row > 2)
                  {
                    if(grid[row-1][col+1] == colour && grid[row-2][col+2] == colour && grid[row-3][col+3] == colour)
                    {
                        aiCol = col;
                        bestMove = true;
                    }
                  }
                  /////O//
                  ////O///
                  ///X////
                  //O/////
                  if(row > 0 && row < 4)
                  {
                    if(grid[row-1][col-1] == colour && grid[row+1][col+1] == colour && grid[row+2][col+2] == colour)
                    {
                        aiCol = col;
                        counterMove = true;
                    }
                  }
                  /////O//
                  ////X///
                  ///O////
                  //O/////
                  if(row > 1 && row < 5)
                  {
                    if(grid[row-1][col-1] == colour && grid[row-2][col-2] == colour && grid[row+1][col+1] == colour)
                    {
                        aiCol = col;
                        counterMove = true;
                    }
                  }
                  //O/////
                  ///O////
                  ////X///
                  /////O//
                  if(row > 0 && row < 4)
                  {
                    if(grid[row-1][col+1] == colour && grid[row+1][col-1] == colour && grid[row+2][col-2] == colour)
                    {
                        aiCol = col;
                        counterMove = true;
                    }
                  }
                  //O/////
                  ///X////
                  ////O///
                  /////O//
                  if(row > 1 && row < 5)
                  {
                    if(grid[row-1][col+1] == colour && grid[row-2][col+2] == colour && grid[row+1][col-1] == colour)
                    {
                        aiCol = col;
                        counterMove = true;
                    }
                  }
                }
            }
        }

        //find first empty row in the column, or find out if column is full
        function checkColumn(column)
        {
            columnFull = false;

            for (var row = 0; row < grid.length; row++)
            {
                if(grid[row][column] == '')
                {
                    return row;
                }
            }
            columnFull = true;

            return false;
        }

        function checkForWin(row, col, colour) {

          //Check for 4 up
          //check row height is above third row or index will be out of range
          if(row > 2)
          {
            if(grid[row][col] == grid[row-1][col])
            {
              if(grid[row][col] == grid[row-2][col])
              {
                if(grid[row][col] == grid[row-3][col])
                {
                    winner(colour);
                }
              }
            }
          }

          //Check for 3 matches to the right
          //XOOO//
          if(grid[row][col] == grid[row][col+1])
          {
            if(grid[row][col] == grid[row][col+2])
            {
              if(grid[row][col] == grid[row][col+3])
              {
                  winner(colour);
              }
            }
          }

          //Check for 3 matches to the left
          //OOOX//
          if(grid[row][col] == grid[row][col-1])
          {
            if(grid[row][col] == grid[row][col-2])
            {
              if(grid[row][col] == grid[row][col-3])
              {
                  winner(colour);
              }
            }
          }

          //Check for 1 match left and 2 right
          //OXOO//
          if(grid[row][col] == grid[row][col-1])
          {
            if(grid[row][col] == grid[row][col+1])
            {
              if(grid[row][col] == grid[row][col+2])
              {
                  winner(colour);
              }
            }
          }
          //Check for 2 matches left and 1 right
          //OOXO//
          if(grid[row][col] == grid[row][col-1])
          {
            if(grid[row][col] == grid[row][col-2])
            {
              if(grid[row][col] == grid[row][col+1])
              {
                  winner(colour);
              }
            }
          }

          ////////////////////////
          //Diagonal 4 in a rows//
          ////////////////////////

          //Check for bottom left to top right
          /////O//
          ////O///
          ///O////
          //X/////
          //check if row is lower than 4th row, no need to check for this diagonal if it is higher
          if(row < 3)
          {
            if(grid[row][col] == grid[row+1][col+1])
            {
              if(grid[row][col] == grid[row+2][col+2])
              {
                if(grid[row][col] == grid[row+3][col+3])
                {
                    winner(colour);
                }
              }
            }
          }

          //Check for top right to bottom left
          /////X//
          ////O///
          ///O////
          //O/////
          if(row > 2)
          {
            if(grid[row][col] == grid[row-1][col-1])
            {
              if(grid[row][col] == grid[row-2][col-2])
              {
                if(grid[row][col] == grid[row-3][col-3])
                {
                    winner(colour);
                }
              }
            }
          }

          //Check for bottom right to top left
          //O/////
          ///O////
          ////O///
          /////X//
          //check if row is lower than 4th row, no need to check for this diagonal if it is higher
          if(row < 3)
          {
            if(grid[row][col] == grid[row+1][col-1])
            {
              if(grid[row][col] == grid[row+2][col-2])
              {
                if(grid[row][col] == grid[row+3][col-3])
                {
                    winner(colour);
                }
              }
            }
          }

          //Check for top left to bottom right
          //X/////
          ///O////
          ////O///
          /////O//
          if(row > 2)
          {
            if(grid[row][col] == grid[row-1][col+1])
            {
              if(grid[row][col] == grid[row-2][col+2])
              {
                if(grid[row][col] == grid[row-3][col+3])
                {
                    winner(colour);
                }
              }
            }
          }

          //O/////
          ///X////
          ////O///
          /////O//
          //check if row is between 1 and 5, no need to check for this diagonal out of that range
          if(row > 1 && row < 5)
          {
            if(grid[row][col] == grid[row+1][col-1])
            {
              if(grid[row][col] == grid[row-1][col+1])
              {
                if(grid[row][col] == grid[row-2][col+2])
                {
                  winner(colour);
                }
              }
            }
          }

          //O/////
          ///O////
          ////X///
          /////O//
          //check if row is between 1 and 4, no need to check for this diagonal out of that range
          if(row > 0 && row < 4)
          {
            if(grid[row][col] == grid[row+1][col-1])
            {
              if(grid[row][col] == grid[row+2][col-2])
              {
                if(grid[row][col] == grid[row-1][col+1])
                {
                    winner(colour);
                }
              }
            }

          }

          /////O//
          ////X///
          ///O////
          //O/////
          //check if row is between 1 and 5, no need to check for this diagonal out of that range
          if(row > 1 && row < 5)
          {
            if(grid[row][col] == grid[row+1][col+1])
            {
              if(grid[row][col] == grid[row-1][col-1])
              {
                if(grid[row][col] == grid[row-2][col-2])
                {
                    winner(colour);
                }
              }
            }
          }

          /////O//
          ////O///
          ///X////
          //O/////
          //check if row is between 1 and 4, no need to check for this diagonal out of that range
          if(row > 0 && row < 4)
          {
            if(grid[row][col] == grid[row+1][col+1])
            {
              if(grid[row][col] == grid[row+2][col+2])
              {
                if(grid[row][col] == grid[row-1][col-1])
                {
                    winner(colour);
                }
              }
            }
          }
        }

        //add reset grid function

        //Change text and colour to display the winner
        function winner(colour)
        {
            text = document.getElementById('text');

            var winner;

            if(colour == 'red')
            {
                winner = circle.red.name;
            }
            else if (colour == 'yellow')
            {
                winner = circle.yellow.name;
            }

            text.innerHTML = winner + ' is the winner!';
            text.style.color = colour;

            gameOver = true;
            //tell the server that the game is over
            socket.emit('sendGameOver',gameOver);
        }

        //Check for free spaces next to the previous move
        function AIfindNextBestMove(row, col)
        {
           //Check if row is less than 3 to avoid going upwards when only space for 3
           if(row < 3 && grid[row+1][col] == '')
           {
              aiCol = col;
              freeSpace = true;
              return true;
           }
           else if(grid[row][col-1] == '' && grid[row-1][col-1] != '')
           {
              aiCol = col - 1;
              freeSpace = true;
              return true;
           }
           else if(grid[row][col+1] == '' && grid[row-1][col+1] != '')
           {
              aiCol = col + 1;
              freeSpace = true;
              return true;
           }
           else if(grid[row+1][col-1] == '' && grid[row][col-1] != '')
           {
              aiCol = col - 1;
              freeSpace = true;
              return true;
           }
           else if(grid[row+1][col+1] == '' && grid[row][col+1] != '')
           {
              aiCol = col + 1;
              freeSpace = true;
              return true;
           }
           else if(row > 0 && grid[row-1][col+1] == '')
           {
              aiCol = col + 1;
              freeSpace = true;
              return true;
           }
           else if(row > 0 && grid[row-1][col-1] == '')
           {
              aiCol = col + 1;
              freeSpace = true;
              return true;
           }

           return false;
        }

        var buttonPVP = document.getElementById("pvpButton");
        var buttonAI = document.getElementById("aiButton");
        var buttonReset = document.getElementById("resetButton");
        var buttonOnline = document.getElementById("onlineButton")

        buttonPVP.onclick = function() {
            ai = false;
            online = false;
            resetGrid();
            gmText.innerHTML = "GAME MODE: Local Player vs Player"
        };
        buttonAI.onclick = function() {
            ai = true;
            online = false;
            resetGrid();
            gmText.innerHTML = "GAME MODE: Player vs AI"
        };
        buttonReset.onclick = function() {
            resetGrid();
            socket.emit('sendGrid',grid); //send the resetted grid to the server
        };
        buttonOnline.onclick = function() {
            ai = false;
            online = true;
            resetGrid();
            gmText.innerHTML = "GAME MODE: Online Player vs Player"
        };

        //qunit practice
        function sum(a,b)
        {
          return a+b;
        }

        refreshGrid();
