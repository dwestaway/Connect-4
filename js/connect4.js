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

                    return true;
                }
            }
            return false;

        }

        var turn = 'red';

        //Mouse click listener
        canvas.addEventListener('click', function(evt) {

            text = document.getElementById('text');

            //swap turns, change text and place circle on each click
            if(turn == 'red')
            {
                drawCircle(getColumnClick(event), 'red');
                turn = 'yellow';

                text.innerHTML = "Yellow Player's Turn";
                text.style.color = "yellow";
            }
            else
            {
                drawCircle(getColumnClick(event), 'yellow');
                turn = 'red';

                text.innerHTML = "Red Player's Turn";
                text.style.color = "red";
            }

            refreshGrid();

            //console.log(grid);
        });

        //Find out which column is clicked
        function getColumnClick(event) {
            var rect = canvas.getBoundingClientRect();
            var x = event.clientX - rect.left;

            return Math.floor(x / 100); //divide by 100 because canvas is 700x600 and grid is 7x6, then round down
        }

        function checkForWin(row, col, colour) {

          var winner;

          if(colour == 'red')
          {
              winner = circle.red.name;
          }
          else if (colour == 'yellow')
          {
              winner = circle.yellow.name;
          }


          //Check for 4 up
          //check if higher than third row up or row index will be out of range
          if(row > 2)
          {
            if(grid[row][col] == grid[row-1][col])
            {
              if(grid[row][col] == grid[row-2][col])
              {
                if(grid[row][col] == grid[row-3][col])
                {
                    alert(winner + ' is the winner!');
                }
              }
            }
          }

          //Check for 3 matches to the right
          if(grid[row][col] == grid[row][col+1])
          {
            if(grid[row][col] == grid[row][col+2])
            {
              if(grid[row][col] == grid[row][col+3])
              {
                  alert(winner + ' is the winner!');
              }
            }
          }

          //Check for 3 matches to the left
          if(grid[row][col] == grid[row][col-1])
          {
            if(grid[row][col] == grid[row][col-2])
            {
              if(grid[row][col] == grid[row][col-3])
              {
                  alert(winner + ' is the winner!');
              }
            }
          }

          //Check for 1 match left and 2 right
          if(grid[row][col] == grid[row][col-1])
          {
            if(grid[row][col] == grid[row][col+1])
            {
              if(grid[row][col] == grid[row][col+2])
              {
                  alert(winner + ' is the winner!');
              }
            }
          }
          //Check for 2 matches left and 1 right
          if(grid[row][col] == grid[row][col-1])
          {
            if(grid[row][col] == grid[row][col-2])
            {
              if(grid[row][col] == grid[row][col+1])
              {
                  alert(winner + ' is the winner!');
              }
            }
          }

          ///////////////////////
          //Diagonal 4 in a rows
          ///////////////////////

          //Check for bottom left to top right
          if(grid[row][col] == grid[row+1][col+1])
          {
            if(grid[row][col] == grid[row+2][col+2])
            {
              if(grid[row][col] == grid[row+3][col+3])
              {
                  alert(winner + ' is the winner!');
              }
            }
          }

          //Check for top right to bottom left
          if(row > 2)
          {
            if(grid[row][col] == grid[row-1][col-1])
            {
              if(grid[row][col] == grid[row-2][col-2])
              {
                if(grid[row][col] == grid[row-3][col-3])
                {
                    alert(winner + ' is the winner!');
                }
              }
            }
          }

          //Check for bottom right to top left
          if(grid[row][col] == grid[row+1][col-1])
          {
            if(grid[row][col] == grid[row+2][col-2])
            {
              if(grid[row][col] == grid[row+3][col-3])
              {
                  alert(winner + ' is the winner!');
              }
            }
          }

          //Check for top left to bottom right
          if(row > 2)
          {
            if(grid[row][col] == grid[row-1][col+1])
            {
              if(grid[row][col] == grid[row-2][col+2])
              {
                if(grid[row][col] == grid[row-3][col+3])
                {
                    alert(winner + ' is the winner!');
                }
              }
            }
          }

          //O/////
          ///X////
          ////O///
          /////O//
          if(row > 1)
          {
            if(grid[row][col] == grid[row+1][col-1])
            {
              if(grid[row][col] == grid[row-1][col+1])
              {
                if(grid[row][col] == grid[row-2][col+2])
                {
                    alert(winner + ' is the winner!');
                }
              }
            }
          }

          //O/////
          ///O////
          ////X///
          /////O//
          if(row > 0)
          {
            if(grid[row][col] == grid[row+1][col-1])
            {
              if(grid[row][col] == grid[row+2][col-2])
              {
                if(grid[row][col] == grid[row-1][col+1])
                {
                    alert(winner + ' is the winner!');
                }
              }
            }
          }

          /////O//
          ////X///
          ///O////
          //O/////
          if(row > 1)
          {
            if(grid[row][col] == grid[row+1][col+1])
            {
              if(grid[row][col] == grid[row-1][col-1])
              {
                if(grid[row][col] == grid[row-2][col-2])
                {
                    alert(winner + ' is the winner!');
                }
              }
            }
          }

          /////O//
          ////O///
          ///X////
          //O/////
          if(row > 0)
          {
            if(grid[row][col] == grid[row+1][col+1])
            {
              if(grid[row][col] == grid[row+2][col+2])
              {
                if(grid[row][col] == grid[row-1][col-1])
                {
                    alert(winner + ' is the winner!');
                }
              }
            }
          }
        }



        refreshGrid();



} (jQuery));
