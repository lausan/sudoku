var util = require( "./util" );

var BOARD_SIZE = 9;
var SUB_BOARD_SIZE = 3;

function validValue ( value ) {
  return (
    Number( value ) === value &&
    value % 1 === 0 &&
    value > 0 &&
    value < 10
  );
}

function Board ( board ) {
  if ( board == null ) {
    board = [];
    for ( var i = 0; i < BOARD_SIZE; i++ ) {
      board.push( new Array( BOARD_SIZE ) );
      // for ( var j = 0; j < BOARD_SIZE; j++ ) {
      //   board[i].push( "" );
      // }
    }
  }
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
  this._board[y][x] = value;
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

Board.prototype.mapRows = function ( fn ) {
  var results = [];
  for ( var i = 0; i < BOARD_SIZE; i++ ) {
    results.push( fn( this.rowValues( i ) ) );
  }
  return results;
};

Board.prototype.mapColumns = function ( fn ) {
  var results = [];
  for ( var i = 0; i < BOARD_SIZE; i++ ) {
    results.push( fn( this.columnValues( i ) ) );
  }
  return results;
};

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

Board.prototype.isComplete = function ( fn ) {
  return this.mapRows( Board.isFullyValid )
    .concat( this.mapColumns( Board.isFullyValid ) )
    .concat( this.mapSubBoards( Board.isFullyValid ) )
    .every( util.identity );
};

Board.prototype.flatten = function () {
  return util.flatten( this._board );
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
