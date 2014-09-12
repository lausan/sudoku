var util = require( "./util" );

var BOARD_SIZE = 9;
var SUB_BOARD_SIZE = 3;

function validValue ( value ) {
  return value === null || (
    !isNaN( Number( value ) ) &&
    Number( value ) % 1 === 0 &&
    Number( value ) > 0 &&
    Number( value ) < 10
  );
}

function Board ( board ) {
  this._board = board;
}

Board.prototype.get = function ( x, y ) {
  if ( this._board[y] ) {
    return this._board[y][x];
  }
  return null;
};

Board.prototype.set = function ( x, y, value ) {
  if ( y >= this._board.length || x >= this._board[0].length ) {
    throw new Error( "Attempting to set cell out of range" );
  }
  if ( !validValue( value ) ) {
    throw new Error( "Attempting to set invalid value in board" );
  }
  this._board[y][x] = value === null ? value : Number( value );
  return this;
};

Board.prototype.columnValues = function ( i ) {
  return this._board.map( function ( row ) {
    return row[i];
  });
};

Board.prototype.rowValues = function ( i ) {
  return this._board[i].slice();
};

Board.prototype.subBoardValues = function ( x, y ) {
  if ( x > BOARD_SIZE / SUB_BOARD_SIZE - 1 || y > BOARD_SIZE / SUB_BOARD_SIZE - 1 ) {
    throw new Error( "Attempting to read sub-board out of range" );
  }
  var values = [];
  var startX = x * SUB_BOARD_SIZE;
  var endX = startX + SUB_BOARD_SIZE;
  var startY = y * SUB_BOARD_SIZE;
  var endY = startY + SUB_BOARD_SIZE;
  for ( var i = startX; i < endX; i++ ) {
    for ( var j = startY; j < endY; j++ ) {
      values.push( this.get( i, j ) );
    }
  }
  return values;
};

Board.prototype._mapRowsOrColumns = function ( fn, which ) {
  var method = which === "rows" ? "rowValues" : "columnValues";
  var results = [];
  for ( var i = 0; i < BOARD_SIZE; i++ ) {
    results.push( fn( this[method]( i ) ) );
  }
  return results;
}

// Calls `fn` with each row and returns the result.
Board.prototype.mapRows = function ( fn ) {
  var results = [];
  for ( var i = 0; i < BOARD_SIZE; i++ ) {
    results.push( fn( this.rowValues( i ) ) );
  }
  return results;
};

// Calls `fn` with each column and returns the result.
Board.prototype.mapColumns = function ( fn ) {
  var results = [];
  for ( var i = 0; i < BOARD_SIZE; i++ ) {
    results.push( fn( this.columnValues( i ) ) );
  }
  return results;
};

// Calls `fn` with each sub-board and returns the result.
Board.prototype.mapSubBoards = function ( fn ) {
  var results = [];
  var max = BOARD_SIZE / SUB_BOARD_SIZE;
  for ( var i = 0; i < max; i++ ) {
    for ( var j = 0; j < max; j++ ) {
      results.push( fn( this.subBoardValues( i, j ) ) );
    }
  }
  return results;
};

// Returns whether or not the board is in a valid solution state
Board.prototype.isComplete = function () {
  return this.mapRows( Board.isFullyValid )
    .concat( this.mapColumns( Board.isFullyValid ) )
    .concat( this.mapSubBoards( Board.isFullyValid ) )
    .every( util.identity );
};

// Returns a copy of the board's underlying 2d array
Board.prototype.asArray = function () {
  return this._board.map( function ( row ) {
    return row.slice();
  });
};

// Returns a flattened version of the underlying 2d array
Board.prototype.flatten = function () {
  return util.flatten( this._board );
};

// Returns an array with the validity of each row
Board.prototype.rowValidity = function () {
  return this.mapRows( Board.isPartiallyValid );
};

// Returns an array with the validity of each column
Board.prototype.columnValidity = function () {
  return this.mapColumns( Board.isPartiallyValid );
};

// Returns an array with the validity of each sub-board
Board.prototype.subBoardValidity = function () {
  return this.mapSubBoards( Board.isPartiallyValid );
};

// Checks if an array contains only 1, 2, 3, 4, 5, 6, 7, 8, 9, or falsy
Board.isPartiallyValid = function ( arr ) {
  arr = arr.filter( util.identity );
  return util.unique( arr ).length === arr.length &&
    arr.every( validValue );
};

// Checks if an array contains exactly 1, 2, 3, 4, 5, 6, 7, 8, 9
Board.isFullyValid = function ( arr ) {
  return util.unique( arr ).length === arr.length &&
    arr.length === BOARD_SIZE &&
    arr.every( validValue );
};

module.exports = Board;
