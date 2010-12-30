/*
 * simple implementation of game of life http://en.wikipedia.org/wiki/Conway's_Game_of_Life
 * Copyright 2010 Michal Kuklis
 * Released under the MIT and GPL licenses.
 */

// cell constructor
function Cell(props) {
  var that = this,
    ui = props.ui,
    x = props.x,
    y = props.y,
    _populated = false,
    _tmpPopulated = false,
    _tmpDie = false,
    neighbors = [
      {x:x-1, y:y-1}, 
      {x:x-1, y:y}, 
      {x:x-1, y:y+1}, 
      {x:x, y:y-1},
      {x:x, y:y+1},
      {x:x+1, y:y-1},
      {x:x+1, y:y},
      {x:x+1, y:y+1}];

  function tmpPop() {
    _tmpPopulated = true;
  }

  function tmpDie() {
    _tmpDie = true;
  }

  function checkRules() { 
    var alive = 0;
    $.each(neighbors, function(index, c) {
      var cell = $('#cell_' + c.x + "_" + c.y).data('cell');
      if (cell != undefined) {
        if (cell.populated()) {
          alive++;
        }
      }
    });

    if (that.populated()) {
      // cell dies from being lonely or from overpopulation :(
      if (alive <= 1 || alive >= 4) tmpDie();
    }
    else {
      // perfect conditions for being alive :)
      if (alive == 3) tmpPop();
    } 
  }
  
  this.die = function() {
    _populated = false;
    _tmpDie = false;
    ui.removeClass('populated');
  }

  this.populate = function() {
    _populated = true;
    _tmpPopulated = false;
    ui.addClass('populated');  
  }

  this.isTmpPopulated = function() {
    if (_tmpPopulated) {
      that.populate();
    }
  }

  this.isTmpDead = function() {
    if (_tmpDie == true) {
      that.die();
    }
  }

  this.populated = function() {
    return _populated;
  }

  ui.bind('tick', function() {
    checkRules();
  });

  ui.bind('click', function() {
    _populated = true;
    _tmpPopulated = true;
    ui.addClass('populated');   
  });
}

// game constructor
function Game() {
  var board = [],
  // game tick
  tick = function() {
    $('.cell').each(function(){
      var cell = $(this).data('cell');
      cell.isTmpPopulated();
      cell.isTmpDead();
    });
    $.event.trigger('tick');
  };
  
  // draw board
  for (var i = 0; i < 35; i++) {
    board[i] = [];
    for (var j = 0; j < 80; j++) {
      var ui = $('<div id="cell_' + i +'_' + j + '" class="cell"></div>'),
        cell = new Cell({ui: ui, x: i, y: j});
      ui.data('cell', cell);
      $('#game').append(ui); 
      board[i][j] = cell;
    }  
  }

  setInterval(tick, 1000);
  
  // populate few cells
  board[15][14].populate();
  board[15][15].populate();
  board[14][15].populate();
  board[15][16].populate();

  board[15][44].populate();
  board[15][45].populate();
  board[14][45].populate();
  board[13][45].populate();
  board[12][45].populate();
  board[15][46].populate();
  
  board[30][29].populate();
  board[30][30].populate();
  board[29][30].populate();
}

$(function() { new Game(); });
