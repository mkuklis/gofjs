/*
 * simple implementation of game of life http://en.wikipedia.org/wiki/Conway's_Game_of_Life
 * Copyright 2010 Michal Kuklis
 * Released under the MIT and GPL licenses.
 */

// TODO explore http://en.wikipedia.org/wiki/Hashlife

// cell constructor
function Cell(props) {

 var x = props.x,
    y = props.y,
    that = this,
    neighbors = [
      {x:x-1, y:y-1}, 
      {x:x-1, y:y}, 
      {x:x-1, y:y+1}, 
      {x:x, y:y-1},
      {x:x, y:y+1},
      {x:x+1, y:y-1},
      {x:x+1, y:y},
      {x:x+1, y:y+1}];
  
  this.ui = props.ui;   
  this._populated = false;
  this._tmpPopulated = false;
  this._tmpDie = false;
  
  function tmpPop() {
    that._tmpPopulated = true;
  }

  function tmpDie() {
    that._tmpDie = true;
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

  this.ui.bind('tick', function() {
    checkRules();
  });

  this.ui.bind('click', function() {
    that._populated = true;
    that._tmpPopulated = true;
    that.ui.addClass('populated');   
  });
}

// Cell prototype
Cell.prototype = {
  // set constructor
  constructor: Cell,
  
  die: function() {
    this._populated = false;
    this._tmpDie = false;
    this.ui.removeClass('populated');
  },

  populate: function() {
    this._populated = true;
    this._tmpPopulated = false;
    this.ui.addClass('populated');  
  },

  isTmpPopulated: function() {
    if (this._tmpPopulated) {
      this.populate();
    }
  },

  isTmpDead: function() {
    if (this._tmpDie == true) {
      this.die();
    }
  },

  populated: function() {
    return this._populated;
  }
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

  // sets Gospers glider gun
  
  // populate few cells
  board[9][3].populate();
  board[9][4].populate();
  board[10][3].populate();
  board[10][4].populate();

  board[7][43].populate();
  board[7][44].populate();
  board[8][43].populate();
  board[8][44].populate();

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
