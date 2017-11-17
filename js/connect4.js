$(function() { //jquery handler

        //circle object
        var circle = {
            yellow:
            {
                name: 'yellowPlayer',
                colour: 'yellow',
            },
            red:
            {
                name: 'redPlayer',
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
        //Draw circle, parameters: x and y coordinates and colour
        function createCircle(x, y, circleColour) {

            context.beginPath();
            //Draw circle, x and y are the middle coordinates for the circle, third parameter is radius
            context.arc(x, y, 45, 0, 2 * Math.PI, false);
            context.fillStyle = circleColour;
            context.fill();
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

        //Add circle colour into grid array
        //loop through rows on the column parameter and check if its empty, first empty row add the circle of chosen colour and end loop
        function drawCircle(column, colour) {
            for (var row = 0; row < grid.length; row++)
            {
                if(grid[row][column] == '')
                {
                    grid[row][column] = colour;

                    return true;
                }
            }
            return false;

        }
        
        var turn = 'red';

        canvas.addEventListener('click', function(evt) {

            if(turn == 'red')
            {
                drawCircle(getColumnClick(event), 'red');
                turn = 'yellow';
            }
            else
            {
                drawCircle(getColumnClick(event), 'yellow');
                turn = 'red';
            }

            refreshGrid();
        });

        function getColumnClick(event) {
            var rect = canvas.getBoundingClientRect();
            var x = event.clientX - rect.left;

            return Math.floor(x / 100);
        }


        refreshGrid();



} (jQuery));
