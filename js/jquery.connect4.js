$(function() { //jquery handler

        var grid = [
            ['', '', 'red', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
        ],

        //get canvas and access to draw on it
        canvas = document.getElementById('connect4');
        context = canvas.getContext('2d');

        //Draw grid (white circles)
        function refreshGrid() {
          for(row = 0; row < grid.length; row++) {
            for(col = 0; col < grid[row].length; col++) {
                drawCircle(col, row, grid[row][col]);
            }
          }
        }
        //Draw circle, parameters: x and y coordinates and colour
        function createCircle(x, y, fillColour) {

            context.beginPath();
            //Draw circle, x and y are the middle coordinates for the circle, third parameter is radius
            context.arc(x, y, 45, 0, 2 * Math.PI, false);
            context.fillStyle = fillColour;
            context.fill();
        }
        //Calculate the row and column into exact coordinates on canvas
        function drawCircle(col, row, name) {
          //cx = center x y coordinates calculated from column and row number
          var cx = (canvas.width / 7) * (col + 1) - 50;
          var cy = canvas.height - ((canvas.height / 6) * (row + 1) - 50);

          if(name == "red")
          {
            createCircle(cx, cy, 'red');
          }
          else if(name == "yellow")
          {
            createCircle(cx, cy, 'yellow');
          }
          else
          {
            createCircle(cx, cy, 'white');
          }

        }
        grid[0][1] = 'yellow';

        refreshGrid();



} (jQuery));
