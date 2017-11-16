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


        //Draw circle, x and y are the middle coordinates for the circle
        function createCircle(x, y, fillColour) {
            context.beginPath();
            context.arc(x, y, 50, 0, 2 * Math.PI, false);

            context.fillStyle = fillColour;
            context.fill();

        }

        createCircle(150, 550, 'red');
        createCircle(50, 550, 'yellow')


} (jQuery));
