var http = require('http');
var fs = require('fs'); //fs = file system

function onRequest(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    fs.readFile('./index.html', null, function(error, data) {
      //check if index.html exists
      if(error) {
        response.writeHead(404);
        response.write('File not found');
      }
      else {
        response.write(data);
      }
      response.end();
    });
}

http.createServer(onRequest).listen(8000);
