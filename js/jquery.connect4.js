$(function() { //jquery handler

        var squares = [
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
            ['', '', '', '', '', '', ''],
        ],



        canvas = document.getElementById('connect4');
        context = canvas.getContext('2d');

        function createGrid() {

          var xCoord = 5;
          var yCoord = 5;

          //Fill every square with white to make a grid, canvas is 700x600 so draw rect every 100 pixels
          for(j = 0; j < 6; j++) {
            for(i = 0; i < 7; i++) {

                context.rect(xCoord,yCoord,90,90);

                context.fillStyle = "white";
                context.fill();

                xCoord = xCoord + 100;
            }
            xCoord = 5;
            yCoord = yCoord + 100;
          }
        }



        //Draw circle, x and y are the middle coordinates for the circle
        function createCircle(x, y, fillColour) {
            context.beginPath();
            context.arc(x, y, 45, 0, 2 * Math.PI, false);

            context.fillStyle = fillColour;
            context.fill();

        }

        createGrid();

        createCircle(150, 550, 'red');
        createCircle(50, 550, 'yellow')


} (jQuery));
