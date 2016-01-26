var Binding = function () {
  this["76"] = {player: "p1", action: "left", active: false}
  this["80"] = {player: "p1", action: "up", active: false}
  this["222"] = {player: "p1", action: "right", active: false}
  this["186"] = {player: "p1", action: "down", active: false}
  this["13"] = {player: "p1", action: "bomb", active: false}
  this["65"] = {player: "p2", action: "left", active: false}
  this["87"] = {player: "p2", action: "up", active: false}
  this["68"] = {player: "p2", action: "right", active: false}
  this["83"] = {player: "p2", action: "down", active: false}
  this["20"] = {player: "p2", action: "bomb", active: false}
}

setup = [
  ['R','R','R','R','R','R','R','R','R','R','R','R','R','R','R'],
  ['R','p1',null,null,null,null,null,null,null,null,null,null,null,null,'R'],
  ['R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R'],
  ['R',null,null,null,null,null,null,null,null,null,null,null,null,null,'R'],
  ['R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R'],
  ['R',null,null,null,null,null,null,null,null,null,null,null,null,null,'R'],
  ['R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R'],
  ['R',null,null,null,null,null,null,null,null,null,null,null,null,null,'R'],
  ['R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R'],
  ['R',null,null,null,null,null,null,null,null,null,null,null,null,null,'R'],
  ['R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R'],
  ['R',null,null,null,null,null,null,null,null,null,null,null,null,null,'R'],
  ['R','R','R','R','R','R','R','R','R','R','R','R','R','R','R']
];


$(document).ready(function() {
  // Variables
  var bindings = new Binding;

  var players = {
    p1: {
      elem: $('#player1'),
      defaultTop: $('#player1').position().top,
      defaultLeft: $('#player1').position().left,
      originPos: {
        row: 2,
        column: 1
      },
      newPos: {
        row: null,
        column: null
      }
    }
  }

  var onKeyDown = function(event) {
    var action = bindings[event.keyCode] ? bindings[event.keyCode].action : undefined;
    if (action) {
      // event.preventDefault();
      bindings[event.keyCode].active = true;
    }
    return false;
  };

  var onKeyUp = function(event) {
    var action = bindings[event.keyCode] ? bindings[event.keyCode].action : undefined;
    if (action) {
      // event.preventDefault();
      bindings[event.keyCode].active = false;
    }
    return false;
  }

  $(document).on("keydown", onKeyDown);
  $(document).on("keyup", onKeyUp);

  var movePlayer = function (playerObject, action) {
    $player = playerObject.elem;
    playerT = $player.position().top - playerObject.defaultTop + 40;
    playerL = $player.position().left - playerObject.defaultLeft + 40;
    playerR = playerObject.originPos.row;
    playerC = playerObject.originPos.column;
    var counts = {};
    for (var i = 0; i < setup.length; i++){
      for (var j = 0; j < setup[i].length; j++){
        var num = setup[i][j];
        counts[num] = counts[num] ? counts[num]+1 : 1;
        if (counts['p1'] == 1){ //playerObject and playerName do not work ...
          if (action=="left"){
            //if player's left-most position is right of (col-1) right-most position
            if (playerL > (((playerC - 1) * 40)+ 40)){
              var newPos = $player.position().left - 1;
              $player.css("left", newPos + "px");
            //if (col - 1) of player is NOT a rock,
            } else if (setup[playerR][playerC-1] !== "R"){
              var newPos = $player.position().left - 1;
              $player.css("left", newPos + "px");
              playerObject.newPos.row = playerR;
              playerObject.newPos.column = playerC - 1;
            }
          }
          if (action=="right"){
            //if player's right-most position is left of its right-most cell position
            if ((playerL+36) <= ((playerC * 40) + 40)){
              console.log()
              var newPos = $player.position().left + 1;
              $player.css("left", newPos + "px");
            //if (col + 1) of player is NOT a rock,
            } else if (setup[playerR][playerC+1] !== "R"){
              var newPos = $player.position().left + 1;
              $player.css("left", newPos + "px");
              playerObject.newPos.row = playerR;
              playerObject.newPos.column = playerC + 1;
            }
          }
          if (action=="up"){
            //if player's upper-most position is below the bottom of (row-1) cell position
            if (playerT > (((playerR - 1) * 40) + 40)){
              var newPos = $player.position().top - 1;
              $player.css("top", newPos + "px");
            //if (row - 1) of player is NOT a rock,
            } else if (setup[playerR-1][playerC] !== "R") {
              var newPos = $player.position().top - 1;
              $player.css("top", newPos + "px");
              playerObject.newPos.row = playerR - 1;
              playerObject.newPos.column = playerC;
              var newRow = playerObject.newPos.row;
              var newColumn = playerObject.newPos.column;
              setup[newRow][newColumn] = 'p1';
            }
          }
          if (action=="down"){
            //if player's bottom-most position is above/equal to the bottom of its cell position
            if ((playerT + 36) <= ((playerR * 40) + 40)){
            var newPos = $player.position().top + 1;
            $player.css("top", newPos + "px");
            //if (row+1) of player is NOT a rock,
            } else if (setup[playerR+1][playerC] !== "R") {
              var newPos = $player.position().top + 1;
              $player.css("top", newPos + "px");
              playerObject.newPos.row = playerR + 1;
              playerObject.newPos.column = playerC;
            }
          }
        } else if (counts[$player]==2){ //if player is on 2 positions, create a new position
          if (action=="left"){
            //
          }



      }
        }
    }
      }
    // check if there is 2 pos

  var gameLoop = function () {
    for (var key in bindings) {
      var playerName   = bindings[key].player;
      var playerObject = players[playerName]
      var active       = bindings[key].active;
      var action       = bindings[key].action;
      if (active) {
        movePlayer(playerObject, action);
      }
    }
  }

  setInterval(gameLoop, 16);
});