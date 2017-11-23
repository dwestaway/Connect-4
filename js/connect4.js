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
                        if(colour == 'red')
                        {
                            playerCol = column;
                            playerRow = row;
                        }
                        if(colour == 'yellow')
                        {
                            //AIcheckFor3InRow();
                        }
                    }

                    return true;
                }
            }
            return false;

        }

        var turn = 'red';
        var AIrandom = true;
        var AIcol = 0;
        var playerCol = 0;
        var playerRow = 0;

        //use player location for AI close to winner check

        //Mouse click listener
        canvas.addEventListener('click', function(evt) {

            text = document.getElementById('text');

            //swap turns, change text and place circle on each click
            if(turn == 'red')
            {
                text.innerHTML = "Yellow Player's Turn";
                text.style.color = "yellow";

                AIrandom = true;

                drawCircle(getColumnClick(event), 'red');

                if(AI == false)
                {
                    turn = 'yellow';
                }
                else if(AI == true)
                {
                    var column;

                    AIrandom = true;

                    AIcheckForCounterMove(playerRow,playerCol);

                    //AIcheckForFreeSpace();

                    if(AIrandom == true)
                    {
                        column = 1;

                        //column = Math.floor((Math.random() * 7) + 1);
                    }
                    else if(AIrandom == false)
                    {
                        column = AIcol + 1;

                        alert('countered lol');
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
        function AIcheckForCounterMove(row, col) {

          //Check for 3 up
          if(row > 1)
          {
            if(grid[row][col] == grid[row-1][col])
            {
              if(grid[row][col] == grid[row-2][col])
              {
                  AIcol = col;
                  AIrandom = false;
              }
            }
          }
          //Check for 2 matches to the right and left empty
          ///V////
          //XOOO//
          if(grid[row][col] == grid[row][col+1])
          {
            if(grid[row][col] == grid[row][col+2])
            {
                if(grid[row][col-1] == '')
                {
                    AIcol = col;
                    AIrandom = false;
                }

            }
          }
          //Check for 2 matches to the left and right empty
          ////V///
          //OOOX//
          if(grid[row][col] == grid[row][col-1])
          {
            if(grid[row][col] == grid[row][col-2])
            {
                if(grid[row][col+1] == '')
                {
                    AIcol = col + 1;
                    AIrandom = false;
                }

            }
          }
          //V/////
          //OXOO//
          if(grid[row][col+1] == '')
          {
            if(grid[row][col] == grid[row][col+2])
            {
              if(grid[row][col] == grid[row][col+3])
              {
                  AIcol = col + 1;
                  AIrandom = false;
              }
            }
          }
          ////V///
          //OXOO//
          if(grid[row][col-1] == '')
          {
            if(grid[row][col] == grid[row][col+1])
            {
              if(grid[row][col] == grid[row][col-2])
              {
                  AIcol = col - 1;
                  AIrandom = false;
              }
            }
          }
          /////V//
          //OXOO//
          if(grid[row][col-2] == '')
          {
            if(grid[row][col] == grid[row][col-1])
            {
              if(grid[row][col] == grid[row][col-3])
              {
                  AIcol = col - 2;
                  AIrandom = false;
              }
            }
          }
          /////V//
          //OOXO//
          if(grid[row][col-1] == '')
          {
            if(grid[row][col] == grid[row][col-2])
            {
              if(grid[row][col] == grid[row][col-3])
              {
                  AIcol = col - 1;
                  AIrandom = false;
              }
            }
          }
          ///V////
          //OOXO//
          if(grid[row][col+1] == '')
          {
            if(grid[row][col] == grid[row][col-1])
            {
              if(grid[row][col] == grid[row][col-3])
              {
                  AIcol = col + 1;
                  AIrandom = false;
              }
            }
          }
          //V/////
          //OOXO//
          if(grid[row][col+2] == '')
          {
            if(grid[row][col] == grid[row][col+1])
            {
              if(grid[row][col] == grid[row][col+3])
              {
                  AIcol = col + 2;
                  AIrandom = false;
              }
            }
          }
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



        refreshGrid();



} (jQuery));
