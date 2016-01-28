var debug;
var gridSize   = 40;
var playerSize = 32;

var Binding = function () {
  this["76"]  = {player: "p2", action: "left", active: false};
  this["80"]  = {player: "p2", action: "up", active: false};
  this["222"] = {player: "p2", action: "right", active: false};
  this["186"] = {player: "p2", action: "down", active: false};
  this["13"]  = {player: "p2", action: "bomb", active: false};
  this["65"]  = {player: "p1", action: "left", active: false};
  this["87"]  = {player: "p1", action: "up", active: false};
  this["68"]  = {player: "p1", action: "right", active: false};
  this["83"]  = {player: "p1", action: "down", active: false};
  this["17"]  = {player: "p1", action: "bomb", active: false};
};

var BombObject = function(row, column, power, P, playerName) {
  this.blastRadius = power;
  this.bombRow = row;
  this.bombColumn = column;
  this.killSurrounding = function () {
    // check the P to see whether the player original and new position is within the blast zone
    for (var key in P) {
      var killPlayer = this.checkPlayerPos(P[key].originPos) || this.checkPlayerPos(P[key].newPos) || false;
      if (killPlayer){
        // add animation for background using jquery...
        // when animation is complete
        // remove player element
        // end game
        P[key].elem.remove();
      }
    }
    // check bomb surrounding inside setup to destroy "W" but ignore "R"
  };
  this.checkPlayerPos = function (pos) {
    // console.log (pos.row, pos.column)
    if (pos) {
      if (this.bombRow == pos.row) {
        for (var i = this.bombColumn - this.blastRadius; i <= (this.bombColumn+this.blastRadius); i++) {
          if (i === pos.column) {
            return true;
          }
        }
      }
      else if (this.bombColumn == pos.column) {
        for (var i = this.bombRow - this.blastRadius; i <= (this.bombRow + this.blastRadius); i++) {
          if (i === pos.row) {
            return true;
          }
        }
      }
    } return false;
      // if row is same, check column+1, return true, vice versa
      // if (playeriswithin){
      //   return true
      // } else {
      //   return false
      // }
  };

  this.explode = function () {
    var bombObj = this;
    var timeout = setTimeout(function(){
      bombObj.killSurrounding();
      $('tr').eq(bombObj.bombRow).find('td').eq(bombObj.bombColumn).removeClass('bomb');
      setup[bombObj.bombRow][bombObj.bombColumn] = null;
      P[playerName].availableBombs++;
      clearTimeout(timeout);
    }, 3000)
  };

  this.explode();
};

var setup = [
  ['R','R','R','R','R','R','R','R','R','R','R','R','R','R','R'],
  ['R',null,null,null,null,null,null,null,null,null,null,null,null,null,'R'],
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
      name: 'p1',
      elem: $('#player1'),
      defaultTop: $('#player1').position().top,
      defaultLeft: $('#player1').position().left,
      defaultOffsetTop: gridSize,
      defaultOffsetLeft: gridSize,
      originPos: {
        row: 1,
        column: 1
      },
      newPos: null,
      availableBombs: 1,
      blastRadius: 1
    },
    p2: {
      name: 'p2',
      elem: $('#player2'),
      defaultTop: $('#player2').position().top,
      defaultLeft: $('#player2').position().left,
      defaultOffsetTop: gridSize * 11,
      defaultOffsetLeft: gridSize * 13,
      originPos: {
        row: 11,
        column: 13
      },
      newPos: null,
      availableBombs: 1,
      blastRadius: 1
    }
  };

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
  };

  $(document).on("keydown", onKeyDown);
  $(document).on("keyup", onKeyUp);

  var addNewPos = function (p, newRow, newColumn) {
    p.newPos = {
      row: newRow,
      column: newColumn
    };
  };

  var checkTransition = function (p, posRequirement1, cutoff, posRequirement2) {
    var originalRow    = p.originPos.row;
    var originalColumn = p.originPos.column;
    var newRow         = p.newPos.row;
    var newColumn      = p.newPos.column;

    if (p.playerTopBorder >= p.blockTopBorder && p.playerRightBorder <= p.blockRightBorder && p.playerBotBorder <= p.blockBotBorder && p.playerLeftBorder >= p.blockLeftBorder) {
      p.newPos = null;
    }
    else if (p.playerTopBorder >= p.newBlockTopBorder && p.playerRightBorder <= p.newBlockRightBorder && p.playerBotBorder <= p.newBlockBotBorder && p.playerLeftBorder >= p.newBlockLeftBorder) {
      p.originPos.row = newRow;
      p.originPos.column = newColumn;
      p.newPos = null;
    }
  };

  var updatePlayerPos = function (p, direction, amount) {
    if (!!direction && !!amount) {
      p.elem.css(direction, amount + "px");
    }
    p.playerC    = p.originPos.column;
    p.playerR    = p.originPos.row;
    p.playerWindowX = p.elem.position().left;
    p.playerWindowY = p.elem.position().top;
    p.playerLeftBorder  = p.playerWindowX - p.defaultLeft + p.defaultOffsetLeft;
    p.playerRightBorder = p.playerWindowX - p.defaultLeft + p.defaultOffsetLeft + playerSize;
    p.playerTopBorder   = p.playerWindowY - p.defaultTop + p.defaultOffsetTop;
    p.playerBotBorder   = p.playerWindowY - p.defaultTop + p.defaultOffsetTop + playerSize;
    p.blockLeftBorder  = ((p.playerC - 1) * gridSize) + gridSize;
    p.blockRightBorder = (p.playerC * gridSize) + gridSize;
    p.blockTopBorder   = ((p.playerR - 1) * gridSize) + gridSize;
    p.blockBotBorder   = (p.playerR * gridSize) + gridSize;
    p.playerInTransit  = p.newPos ? true : false;
    p.newPlayerC = p.newPos ? p.newPos.column : null;
    p.newPlayerR = p.newPos ? p.newPos.row : null;
    p.newBlockLeftBorder  = p.newPos ? ((p.newPlayerC - 1) * gridSize)+ gridSize : null;
    p.newBlockRightBorder = p.newPos ? (p.newPlayerC * gridSize) + gridSize : null;
    p.newBlockTopBorder   = p.newPos ? ((p.newPlayerR - 1) * gridSize) + gridSize : null;
    p.newBlockBotBorder   = p.newPos ? (p.newPlayerR * gridSize) + gridSize : null;
  };

  var movePlayer = function (p, action) {
    updatePlayerPos(p);

    if (action =="bomb" && p.availableBombs > 0){

      var plantBombOrigin = function() {
        var newBomb = new BombObject(p.originPos.row, p.originPos.column, p.blastRadius, players, p.name);
        setup[p.originPos.row][p.originPos.column] = "B";
        $('tr').eq(p.playerR).find('td').eq(p.playerC).addClass('bomb');
      }
      var plantBombNew = function() {
        var newBomb = new BombObject(p.newPos.row, p.newPos.column, p.blastRadius, players, p.name);
        setup[p.newPos.row][p.newPos.column] = "B";
        $('tr').eq(p.newPlayerR).find('td').eq(p.newPlayerC).addClass('bomb');
      }

      if (p.playerInTransit){
        if (p.newPlayerC!==p.playerC) {
          if (Math.abs(p.playerLeftBorder - p.blockRightBorder) > Math.abs(p.playerLeftBorder - p.blockLeftBorder)) {
            plantBombOrigin();
          } else plantBombNew();
        }
        else if (Math.abs(p.playerTopBorder - p.blockBotBorder) > Math.abs(p.playerTopBorder - p.blockTopBorder)) {
          plantBombOrigin();
        }
        else {
          plantBombNew();
        }
      } else plantBombOrigin();
      p.availableBombs--;
    }

    if (action == "left"){
      currentBlockRockValidator = ((setup[p.playerR][p.playerC - 1]!=="R") && (setup[p.playerR][p.playerC - 1]!=="B"));

      if (p.playerInTransit) {
        if (p.playerLeftBorder > p.blockLeftBorder || p.playerLeftBorder > p.newBlockLeftBorder) {
          updatePlayerPos(p, "left", p.playerWindowX - 1);
          checkTransition(p);
        }
      } else {
        if (p.playerLeftBorder > p.blockLeftBorder) {
          updatePlayerPos(p, "left", p.playerWindowX - 1);
        }
        else if (currentBlockRockValidator) {
          updatePlayerPos(p, "left", p.playerWindowX - 1);
          addNewPos(p, p.playerR, p.playerC - 1);
          checkTransition(p);
        }
      }
    }

    if (action == "right"){
      currentBlockRockValidator = (setup[p.playerR][p.playerC + 1]!== "R" && setup[p.playerR][p.playerC + 1]!=="B");

      if (p.playerInTransit) {
        if (p.playerRightBorder < p.blockRightBorder || p.playerRightBorder < p.newBlockRightBorder) {
          updatePlayerPos(p, "left", p.playerWindowX + 1);
          checkTransition(p);
        }
      } else {
        if (p.playerRightBorder < p.blockRightBorder){
          updatePlayerPos(p, "left", p.playerWindowX + 1);
        }
        else if (currentBlockRockValidator) {
          updatePlayerPos(p, "left", p.playerWindowX + 1);
          addNewPos(p, p.playerR, p.playerC + 1);
          checkTransition(p);
        }
      }
    }

    if (action == "up"){
      currentBlockRockValidator = (setup[p.playerR - 1][p.playerC] !== "R" && setup[p.playerR - 1][p.playerC] !== "B");

      if (p.playerInTransit) {
        if (p.playerTopBorder > p.blockTopBorder || p.playerTopBorder > p.newBlockTopBorder) {
          updatePlayerPos(p, "top", p.playerWindowY - 1);
          checkTransition(p);
        }
      } else {
        if (p.playerTopBorder > p.blockTopBorder){
          updatePlayerPos(p, "top", p.playerWindowY - 1);
        }
        else if (currentBlockRockValidator) {
          updatePlayerPos(p, "top", p.playerWindowY - 1);
          addNewPos(p, p.playerR - 1, p.playerC);
          checkTransition(p);
        }
      }
    }

    if (action == "down"){
      currentBlockRockValidator = (setup[p.playerR + 1][p.playerC]!=="R" && setup[p.playerR + 1][p.playerC]!=="B");

      if (p.playerInTransit) {
        if (p.playerBotBorder < p.blockBotBorder || p.playerBotBorder < p.newBlockBotBorder) {
          updatePlayerPos(p, "top", p.playerWindowY + 1);
          checkTransition(p);
        }
      } else {
        if (p.playerBotBorder < p.blockBotBorder){
          updatePlayerPos(p, "top", p.playerWindowY + 1);
        }
        else if (currentBlockRockValidator){
          updatePlayerPos(p, "top", p.playerWindowY + 1);
          addNewPos(p, p.playerR + 1, p.playerC);
          checkTransition(p);
        }
      }
    }
  };

  var gameLoop = function () {
    for (var key in bindings) {
      var playerName   = bindings[key].player;
      var playerObject = players[playerName];
      var active       = bindings[key].active;
      var action       = bindings[key].action;
      if (active) {
        movePlayer(playerObject, action);
      }
    }
  };
  setInterval(gameLoop, 10);
});