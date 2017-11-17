$(function() { //jquery handler

        var grid = [
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', 'red', '', '', '', '', ''],
        ],

        //get canvas and access to draw on it
        canvas = document.getElementById('connect4');
        context = canvas.getContext('2d');

        //Draw grid (white circles)
        function createGrid() {
          //Starting coordinates, 50 for circles or 5 for squares
          var xCoord = 50;
          var yCoord = 50;

          //Fill every square with white to make a grid, canvas is 700x600 so draw every 100 pixels
          for(row = 0; row < grid.length; row++) {
            for(col = 0; col < grid[row].length; col++) {

                //context.rect(xCoord,yCoord,90,90);
                //context.beginPath();
                //context.arc(xCoord, yCoord, 45, 0, 2 * Math.PI, false);

                //context.fillStyle = "white";
                //context.fill();

                createCircle(col, row, grid[row][col]);

                xCoord = xCoord + 100;
            }
            xCoord = 50;
            yCoord = yCoord + 100;
          }
        }
        //Draw circle, parameters: x and y coordinates and colour
        function createCircle(x, y, fillColour) {

            if(fillColour == '')
            {
              fillColour = 'white';
            }

            context.beginPath();
            //Draw circle, x and y are the middle coordinates for the circle, third parameter is radius
            context.arc(x, y, 45, 0, 2 * Math.PI, false);
            context.fillStyle = fillColour;
            context.fill();
        }
        //Calculate the row and column into exact coordinates on canvas
        function drawCircle(col, row, name) {
          //cx = center x y coordinates calculated from column and row number
          var cx = (canvas.width / 7) * col - 50;
          var cy = canvas.height - ((canvas.height / 6) * row - 50);

          if(name == "playerRed")
          {
            createCircle(cx, cy, 'red');
          }
          else if(name == "playerYel")
          {
            createCircle(cx, cy, 'yellow');
          }
          else
          {
            createCircle(cx, cy, 'white');
          }

        }
        grid[0][2] = 'yellow';

        createGrid();



} (jQuery));
