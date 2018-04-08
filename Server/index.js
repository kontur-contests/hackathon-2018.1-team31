var http = require('http');
var url = require('url');
var game = require('./game');
var fs = require('fs');
// getStartGame 
// setPos

let waitGame = 0;
let id = 0;
let arrWaitGame = [];
let arrPlayers = {};
let pos = 1;
function leaveEnemy() {

  return;
}
http.createServer(function (req, res) {
  let q = url.parse(req.url, true);
  console.log(req.url);
  switch (q.pathname) {
    case "/getId": 
      waitGame++;
      res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
      res.end(JSON.stringify({id:id}));
      arrPlayers[id] = {id:id};
      arrWaitGame.push(id);
      id++;
      break;

    case '/getStartGame':
      if(arrPlayers[q.query.id]==undefined) {
        return;
      }
      if(waitGame > 1) {// если в очереди больше 2 игроков 
        if(arrPlayers[q.query.id].enemy==undefined) { // это первый запрос и враги ещё не стоят
          let b = arrWaitGame.pop();
          if(b == q.query.id) {
            arrPlayers[q.query.id].enemy = arrWaitGame.pop();
            arrPlayers[arrPlayers[q.query.id].enemy].enemy = q.query.id;
          } else {
            arrPlayers[b].enemy = q.query.id;
            arrPlayers[q.query.id].enemy = b;
          }
        } else {
          waitGame = 0;
        }
        let respond;
        if(pos == 1) {
          arrPlayers[q.query.id].pos = 1;
          arrPlayers[q.query.id].coordinateX = 64;
          arrPlayers[q.query.id].coordinateY = 64;
          respond = {status:'game',pos:1};
          pos = 2;
        } else {
          arrPlayers[q.query.id].pos = 2;
          arrPlayers[q.query.id].coordinateX = 704;
          arrPlayers[q.query.id].coordinateY = 704;
          respond = {status:'game',pos:2};
          pos = 1;
        }
        res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
        res.end(JSON.stringify(respond));
      } else {
        let respond = {status:'wait'};
        res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
        res.end(JSON.stringify(respond));
      }
      break;

    case '/getEnemyCoordinate':// getEnemyCoordinate?id=2  respond:{x:25,y:35};
      if( arrPlayers[q.query.id]==undefined || 
          arrPlayers[q.query.id].enemy==undefined //||
          //arrPlayers[arrPlayers[q.query.id].enemy].coordinateX == undefined
        ) {
        return;
      }
      var enemy = arrPlayers[arrPlayers[q.query.id].enemy];
      var respond = {x:enemy.coordinateX,y:enemy.coordinateY};
      res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
      res.end(JSON.stringify(respond));
      break;

    case '/setMyCoordinate': // setMyCoordinate?id=2&x=2&y=25
      if(arrPlayers[q.query.id]==undefined) {
        return;
      }
      arrPlayers[q.query.id].coordinateX = q.query.x;
      arrPlayers[q.query.id].coordinateY = q.query.y;
      var enemy = arrPlayers[q.query.id];
      var respond = {x:arrPlayers[q.query.id].coordinateX,y:arrPlayers[q.query.id].coordinateY};
      res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
      res.end(JSON.stringify(respond));
      break;
    default:
      fs.readFile('../client/'+ q.pathname, function(err, data) {
        if (err) {
          res.writeHead(404, {'Content-Type': 'text/html'});
          return res.end("404 Not Found");
        }  
        //res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });
      break;
  }
}).listen(80);