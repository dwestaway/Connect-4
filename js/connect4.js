$(function() { //jquery handler

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

        var grid = [
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
        ],

        //get canvas and access to draw on it
        canvas = document.getElementById('connect4');
        context = canvas.getContext('2d');

        var AI = true;

        //Draw grid, loop through every item in grid array and call calculateCircle
        function refreshGrid() {
          for(row = 0; row < grid.length; row++) {
            for(col = 0; col < grid[row].length; col++) {
                calculateCircle(col, row, grid[row][col]);
            }
          }
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
          else
          {
              createCircle(centerX, centerY, 'white');
          }

        }

        //Draw circle, parameters: x and y coordinates and colour
        function createCircle(x, y, circleColour) {

            context.beginPath();
            //Draw circle, x and y are the middle coordinates for the circle, third parameter is radius
            context.arc(x, y, 45, 0, 2 * Math.PI, false);
            context.fillStyle = circleColour;
            context.fill();
        }

        //Add circle colour into grid array
        //loop through rows on the column parameter and check if its empty, first empty row add the circle of chosen colour and end loop
        function drawCircle(column, colour) {
            for (var row = 0; row < grid.length; row++)
            {
                if(grid[row][column] == '')
                {
                    grid[row][column] = colour;

                    checkForWin(row, column, colour);

                    if(AI == true)
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

        var turn = 'red';
        var firstMove = true;
        var bestMove = false;
        var freeSpace = false;
        var columnFull = false;
        var AIcol = 0;
        var AIlastMoveCol = 0;
        var AIlastMoveRow = 0;

        //use player location for AI close to winner check

        //Mouse click listener
        canvas.addEventListener('click', function(evt) {

            text = document.getElementById('text');

            //swap turns, change text and place circle on each click
            if(turn == 'red')
            {
                if(AI == false)
                {

                    text.innerHTML = "Yellow Player's Turn";
                    text.style.color = "yellow";
                    turn = 'yellow';

                    drawCircle(getColumnClick(event), 'red');
                }
                else if(AI == true)
                {
                    drawCircle(getColumnClick(event), 'red');

                    var column;

                    bestMove = false;
                    freeSpace = false;

                    AIcol = 0;

                    AIfindBestMove('red'); //check if player is 1 from a 4 in a row
                    AIfindBestMove('yellow'); //check if AI is 1 from a 4 in a row, this will favor over the above

                    //If no best moves were round, and not first turn, check for next best move
                    if(bestMove == false && firstMove == false)
                    {
                        AIfindNextBestMove(AIlastMoveRow, AIlastMoveCol);
                    }

                    firstMove = false;

                    if(bestMove == true)
                    {
                        column = AIcol + 1;

                    }
                    else if(freeSpace == true)
                    {
                        column = AIcol + 1;
                    }
                    else
                    {
                        //console.log('random');
                        //column = 1;
                        //This only happens on first turn and if no space near previous turn
                        column = Math.floor((Math.random() * 7) + 1);
                    }

                    drawCircle(column - 1, 'yellow');
                }

            }
            else if(turn == 'yellow')
            {
                text.innerHTML = "Red Player's Turn";
                text.style.color = "red";

                drawCircle(getColumnClick(event), 'yellow');

                if(AI == false)
                {
                    turn = 'red';
                }
            }

            refreshGrid();
        });

        //Find out which column is clicked
        function getColumnClick(event) {
            var rect = canvas.getBoundingClientRect();
            var x = event.clientX - rect.left;

            return Math.floor(x / 100); //divide by 100 because canvas is 700x600 and grid is 7x6, then round down
        }
        function AIfindBestMove(colour) {

            var row;

            //loop through all columns
            for(var col = 0; col < 7; col++)
            {
                columnFull = false;

                row = getFirstEmpty(col);

                //if a best move is found, do not continue searching
                if(columnFull == false && bestMove == false)
                {
                  //Check for 3 up
                  if(row > 1)
                  {
                    //check for 2 upwards, replace AIcol if there is 3 upwards
                    if(grid[row-1][col] == colour && grid[row-2][col] == colour)
                    {
                      //AIcol = col;
                      //bestMove = true;

                      if(row > 2 && grid[row-3][col] == colour)
                      {
                        AIcol = col;
                        bestMove = true;
                      }
                    }
                  }
                  //Check for 3 to the right
                  //XOOO//
                  if(grid[row][col+1] == colour && grid[row][col+2] == colour && grid[row][col+3] == colour)
                  {
                      AIcol = col;
                      bestMove = true;
                  }
                  //Check for 3 to the left
                  //OOOX//
                  if(grid[row][col-1] == colour && grid[row][col-2] == colour && grid[row][col-3] == colour)
                  {
                      AIcol = col;
                      bestMove = true;
                  }
                  //OOXO//
                  if(grid[row][col+1] == colour && grid[row][col-1] == colour && grid[row][col-2] == colour)
                  {
                      AIcol = col;
                      bestMove = true;
                  }
                  //OXOO//
                  if(grid[row][col-1] == colour && grid[row][col+1] == colour && grid[row][col+2] == colour)
                  {
                      AIcol = col;
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
                        AIcol = col;
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
                        AIcol = col;
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
                        AIcol = col;
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
                        AIcol = col;
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
                        AIcol = col;
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
                        AIcol = col;
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
                        AIcol = col;
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
                        AIcol = col;
                        counterMove = true;
                    }
                  }
                }
            }
        }

        //find first empty row in the column
        function getFirstEmpty(column)
        {
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
        }

        //Check for free spaces next to the previous move
        function AIfindNextBestMove(row, col)
        {
           //Check if row is less than 3 to avoid going upwards when only space for 3
           if(row < 3 && grid[row+1][col] == '')
           {
              AIcol = col;
              freeSpace = true;
              return true;
           }
           else if(grid[row][col-1] == '' && grid[row-1][col-1] != '')
           {
              AIcol = col - 1;
              freeSpace = true;
              return true;
           }
           else if(grid[row][col+1] == '' && grid[row-1][col+1] != '')
           {
              AIcol = col + 1;
              freeSpace = true;
              return true;
           }
           else if(grid[row+1][col-1] == '' && grid[row][col-1] != '')
           {
              AIcol = col - 1;
              freeSpace = true;
              return true;
           }
           else if(grid[row+1][col+1] == '' && grid[row][col+1] != '')
           {
              AIcol = col + 1;
              freeSpace = true;
              return true;
           }
           else if(grid[row-1][col+1] == '' )
           {
              AIcol = col + 1;
              freeSpace = true;
              return true;
           }
           else if(grid[row-1][col-1] == '')
           {
              AIcol = col + 1;
              freeSpace = true;
              return true;
           }

           return false;
        }



        refreshGrid();



} (jQuery));
