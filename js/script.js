var debug;
var gridSize   = 40;
var playerSize = 26;
var winCondition = 1;
var killCount = 0;

var Binding = function () {
  this["65"]  = {player: "p1", action: "left", active: false};
  this["87"]  = {player: "p1", action: "up", active: false};
  this["68"]  = {player: "p1", action: "right", active: false};
  this["83"]  = {player: "p1", action: "down", active: false};
  this["17"]  = {player: "p1", action: "bomb", active: false};
  this["70"]  = {player: "p2", action: "left", active: false};
  this["84"]  = {player: "p2", action: "up", active: false};
  this["72"] = {player: "p2", action: "right", active: false};
  this["71"] = {player: "p2", action: "down", active: false};
  this["32"]  = {player: "p2", action: "bomb", active: false};
  this["74"]  = {player: "p3", action: "left", active: false};
  this["73"]  = {player: "p3", action: "up", active: false};
  this["76"] = {player: "p3", action: "right", active: false};
  this["75"] = {player: "p3", action: "down", active: false};
  this["18"]  = {player: "p3", action: "bomb", active: false};
  this["186"]  = {player: "p4", action: "left", active: false};
  this["219"]  = {player: "p4", action: "up", active: false};
  this["13"] = {player: "p4", action: "right", active: false};
  this["222"] = {player: "p4", action: "down", active: false};
  this["191"]  = {player: "p4", action: "bomb", active: false};
};

var PlayerConstructor = function(name, elem, row, column) {
  this.name = name,
  this.elem = elem,
  this.defaultTop = elem.position().top,
  this.defaultLeft = elem.position().left,
  this.defaultOffsetTop = (gridSize * row),
  this.defaultOffsetLeft = (gridSize * column),
  this.originPos = {
    row: row,
    column: column
  },
  this.newPos = null,
  this.availableBombs = 3,
  this.blastRadius = 2,
  this.alive = true
}

var CellConstructor = function(obstacle, item){
  this.obstacle = obstacle;
  this.item = item;
};

var items = [{
    name: "add bomb",
    player: null,
    ability: function() {
      var pName = this[0].player;
      players.pName.availableBombs++;
    }
  }, {
    name: "add power",
    player: null,
    ability: function() {
      var pName = this[1].player;
      players.pName.blastRadius++;
    }
  }
];

var BombConstructor = function(row, column, power, P, playerName) {
  this.blastRadius = power;
  this.bombRow = row;
  this.bombColumn = column;

  this.killSurroundingAndAnimate = function () {
    // check the P to see whether the player original and new position is within the blast zone

    var checkNorth = true;
    var checkEast  = true;
    var checkSouth = true;
    var checkWest  = true;

    $('tr').eq(this.bombRow).find('td').eq(this.bombColumn).addClass('boom');
    this.killPlayer(this.bombRow, this.bombColumn)

    for (var i=1; i <= this.blastRadius; i++) {
      var north = this.bombRow + i;
      var east  = this.bombColumn + i;
      var south = this.bombRow - i;
      var west  = this.bombColumn - i;

      checkNorth = this.checkObstacle(north       , this.bombColumn, checkNorth);
      checkEast  = this.checkObstacle(this.bombRow, east           , checkEast);
      checkSouth = this.checkObstacle(south       , this.bombColumn, checkSouth);
      checkWest  = this.checkObstacle(this.bombRow, west           , checkWest);
    }
  };

  this.checkPlayerPos = function (pos, row, column) {
    if (pos) {
      if (pos.row == row && pos.column == column){
        return true;
      } else {
        return false;
      }
    }
    return false;
  };

  this.killPlayer = function (row, column) {
    for (var key in P) {
      var playerDetected = this.checkPlayerPos(P[key].originPos, row, column) || this.checkPlayerPos(P[key].newPos, row, column) || false;
      if (playerDetected && P[key].alive){
        P[key].elem.hide();
        P[key].alive = false;
        killCount++;
      }
    }
  }

  this.checkObstacle = function (row, column, continueDirection) {
    if (0 <= row && row <= 12 && 0 <= column && column <= 14){
      if (setup[row][column].obstacle !== "R" && continueDirection){
        if (continueDirection){
          this.killPlayer(row, column);
        }

        continueDirection = setup[row][column].obstacle == "W" ? false : true ;

        var $cellElem = $('tr').eq(row).find('td').eq(column);
        var $playerElem = $cellElem.find('.character').length != 0 ? $cellElem.find('.character') : null ;
        var $newElem = $cellElem.clone(true);

        if ($playerElem) {
          $newElem.find('.character').remove();
          $newElem.append($playerElem);
        }
        $cellElem.before($newElem);
        $cellElem.remove();

        $newElem.removeClass('wood').addClass('boom');

        setup[row][column].obstacle = "E";
        return continueDirection;
      } else {
        return false;
      }
    }

    return false;
  }

  this.activateBomb = function () {
    var bombObj = this;

    var timeout = setTimeout(function(){
      $('tr').eq(bombObj.bombRow).find('td').eq(bombObj.bombColumn).removeClass('bomb');
      setup[bombObj.bombRow][bombObj.bombColumn].obstacle = 'E';
      P[playerName].availableBombs++;

      bombObj.killSurroundingAndAnimate();

      clearTimeout(timeout);
    }, 2000);
  };

  this.activateBomb();
};

var Setup = function() {
  this.map = [
    ['R','R','R','R','R','R','R','R','R','R','R','R','R','R','R'],
    ['R','E','E','A','A','A','A','A','A','A','A','A','E','E','R'],
    ['R','E','R','A','R','A','R','A','R','A','R','A','R','E','R'],
    ['R','A','A','A','A','A','A','A','A','A','A','A','A','A','R'],
    ['R','A','R','A','R','A','R','A','R','A','R','A','R','A','R'],
    ['R','A','A','A','A','A','A','A','A','A','A','A','A','A','R'],
    ['R','A','R','A','R','A','R','A','R','A','R','A','R','A','R'],
    ['R','A','A','A','A','A','A','A','A','A','A','A','A','A','R'],
    ['R','A','R','A','R','A','R','A','R','A','R','A','R','A','R'],
    ['R','A','A','A','A','A','A','A','A','A','A','A','A','A','R'],
    ['R','E','R','A','R','A','R','A','R','A','R','A','R','E','R'],
    ['R','E','E','A','A','A','A','A','A','A','A','A','E','E','R'],
    ['R','R','R','R','R','R','R','R','R','R','R','R','R','R','R']
  ];
};

var setup;

// create a loop that scans

$(document).ready(function() {
  // Variables
  var gameLoopInterval;

  $('#replay').on("click", function () {
    $('#game-screen').show();
    $('#end-screen').hide();
    $('#title').show();
    $('#player1, #player4').show().removeAttr('style');
    killCount = 0;
    init();
  })

  var bindings = new Binding;
  var world = function(){
    for (var i = 0; i < setup.length; i++) {
      for (var j = 0; j < setup[i].length; j++) {
        if (setup[i][j] == 'R') {
          setup[i][j] = new CellConstructor('R')
        } else if (setup[i][j] == 'E') {
          setup[i][j] = new CellConstructor('E')
        } else if (setup[i][j] == 'A') {
          var includeObstacle = Math.random();
          var obstacle = includeObstacle < 0.9 ? 'W' : 'E';
          var includeItem = Math.random();
          var item = obstacle && includeItem < 0.6 ? items[Math.floor((Math.random() * items.length))] : null;
          setup[i][j] = new CellConstructor(obstacle, item);
        }
      }
    }
  }

  var populateHTML = function () {
    // your code here
    for (var i = 0; i < setup.length; i++) {
      for (var j = 0; j < setup[i].length; j++) {
        if (setup[i][j].obstacle == 'W') {
          $('tr').eq(i).find('td').eq(j).addClass('wood');
        }
        // if (setup[i][j].item == 'speed') {
        //   $('tr').eq(i).find('td').eq(j).addClass('speed');
        // }
      }
    }
  }


  var players = {

    // p2: {
    //   name: 'p2',
    //   elem: $('#player2'),
    //   defaultTop: $('#player2').position().top,
    //   defaultLeft: $('#player2').position().left,
    //   defaultOffsetTop: gridSize * 11,
    //   defaultOffsetLeft: gridSize * 1,
    //   originPos: {
    //     row: 11,
    //     column: 1
    //   },
    //   newPos: null,
    //   availableBombs: 1,
    //   blastRadius: 1,
    //   alive: true
    // },
    // p3: {
    //   name: 'p3',
    //   elem: $('#player3'),
    //   defaultTop: $('#player3').position().top,
    //   defaultLeft: $('#player3').position().left,
    //   defaultOffsetTop: gridSize * 1,
    //   defaultOffsetLeft: gridSize * 13,
    //   originPos: {
    //     row: 1,
    //     column: 13
    //   },
    //   newPos: null,
    //   availableBombs: 1,
    //   blastRadius: 1,
    //   alive: true
    // },
  };

  var bindKeyDown = function () {
    $(document).on("keydown", function(event) {
      var action = bindings[event.keyCode] ? bindings[event.keyCode].action : undefined;
      if (action) {
        // event.preventDefault();
        bindings[event.keyCode].active = true;
      }
      return false;
    });
  };

  var bindKeyUp = function () {
    $(document).on("keyup", function(event) {
      var action = bindings[event.keyCode] ? bindings[event.keyCode].action : undefined;
      if (action) {
        // event.preventDefault();
        bindings[event.keyCode].active = false;
      }
      return false;
    });
  };

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
    p.playerOrigin = setup[p.originPos.row][p.originPos.column];
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
    p.newPlayerOrigin = p.newPos ? setup[p.newPlayerR][p.newPlayerC] : null;
    p.newBlockLeftBorder  = p.newPos ? ((p.newPlayerC - 1) * gridSize)+ gridSize : null;
    p.newBlockRightBorder = p.newPos ? (p.newPlayerC * gridSize) + gridSize : null;
    p.newBlockTopBorder   = p.newPos ? ((p.newPlayerR - 1) * gridSize) + gridSize : null;
    p.newBlockBotBorder   = p.newPos ? (p.newPlayerR * gridSize) + gridSize : null;
  };

  var movePlayer = function (p, action) {
    updatePlayerPos(p);

    var bombPlantLocation = function(){
      if (p.newPlayerC!==p.playerC) {
        if (Math.abs(p.playerLeftBorder - p.blockRightBorder) > Math.abs(p.playerLeftBorder - p.blockLeftBorder)) {
          return p.playerOrigin.obstacle ;
        } else {
          return p.newPlayerOrigin.obstacle;
        }
      } else if (p.newPlayerR!==p.playerR){
        if (Math.abs(p.playerTopBorder - p.blockBotBorder) > Math.abs(p.playerTopBorder - p.blockTopBorder)) {
          return p.playerOrigin.obstacle;
        } else {
          return p.newPlayerOrigin.obstacle;
        }
      } else return p.playerOrigin.obstacle;
    }

    if (action =="bomb" && p.availableBombs > 0 && bombPlantLocation()!=="B"){
      var plantBombOrigin = function() {
        var newBomb = new BombConstructor(p.originPos.row, p.originPos.column, p.blastRadius, players, p.name);
        setup[p.originPos.row][p.originPos.column].obstacle = "B";
        $('tr').eq(p.playerR).find('td').eq(p.playerC).addClass('bomb');
      }
      var plantBombNew = function() {
        var newBomb = new BombConstructor(p.newPos.row, p.newPos.column, p.blastRadius, players, p.name);
        setup[p.newPlayerR][p.newPlayerC].obstacle = "B";
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
      currentBlockRockValidator = setup[p.playerR][p.playerC - 1].obstacle == 'E';

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
      currentBlockRockValidator = setup[p.playerR][p.playerC + 1].obstacle == 'E';

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
      currentBlockRockValidator = setup[p.playerR - 1][p.playerC].obstacle == 'E';
      console.log ()
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
      currentBlockRockValidator = setup[p.playerR + 1][p.playerC].obstacle == 'E';

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

  var gameOver = function(){
    $('#game-screen').hide();
    $('#end-screen').show();
    $('#title').hide();
  };

  var checkWinCondition = function(){
    if (killCount >= winCondition) {
      gameOver();
    }
  };

  var gameLoop = function () {
    checkWinCondition();
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

  var createPlayer = function () {
    players.p1 = new PlayerConstructor('p1', $('#player1'), 1, 1);
    players.p4 = new PlayerConstructor('p4', $('#player4'), 11, 13);
  }

  var init = function () {
    setup = (new Setup).map;
    world();
    populateHTML();
    createPlayer()
    bindKeyDown();
    bindKeyUp();
    if (gameLoopInterval) { clearInterval(gameLoopInterval) }
    gameLoopInterval = setInterval(gameLoop, 10);
  };
  init();
});