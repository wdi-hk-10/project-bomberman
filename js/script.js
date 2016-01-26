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

var setup = [
  ['R','R','R','R','R','R','R','R','R','R','R','R','R','R','R'],
  ['R','p1','p1',null,null,null,null,null,null,null,null,null,null,null,'R'],
  ['R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R'],
  ['R',null,null,null,null,null,null,null,null,null,null,null,null,null,'R'],
  ['R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R'],
  ['R',null,null,null,null,null,null,null,null,null,null,null,null,null,'R'],
  ['R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R'],
  ['R',null,null,null,null,null,null,null,null,null,null,null,null,null,'R'],
  ['R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R'],
  ['R',null,null,null,null,null,null,null,null,null,null,null,null,null,'R'],
  ['R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R',null,'R'],
  ['R',null,null,null,null,null,null,null,null,null,null,null,null,'p2','R'],
  ['R','R','R','R','R','R','R','R','R','R','R','R','R','R','R'],
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
        row: 1,
        column: 1
      },
      newPos: {
        row: 1,
        column: 1
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
    // check if there is two pos if not then continue
      if (action=="left" && setup[playerR][playerC - 1]!=='R'){
        var newPos = $player.position().left - 1;
        $player.css("left", newPos + "px");
      }
      if (action=="right" && setup[playerR][playerC + 1]!=='R'){
        var newPos = $player.position().left + 1;
        $player.css("left", newPos + "px");
      }
      if (action=="up"){
        if (playerT > (((playerR - 1) * 40) + 40)){
          var newPos = $player.position().top - 1;
          $player.css("top", newPos + "px");
        } else if (setup[playerR-1][playerC] !== "R") {
          var newPos = $player.position().top - 1;
          $player.css("top", newPos + "px");
        }
      }
      if (action=="down" && (playerT + 36) < (((playerR) * 40) + 40)){
        var newPos = $player.position().top + 1;
        $player.css("top", newPos + "px");
      }
  }

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