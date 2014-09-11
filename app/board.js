var _ = require( "lodash" );

var BOARD_SIZE = 9;

var SUB_BOARD_SIZE = 3;

function Board ( board ) {
  if ( board == null ) {
    board = [];
    for ( var i = 0; i < BOARD_SIZE; i++ ) {
      board.push( [] );
      for ( var j = 0; j < BOARD_SIZE; j++ ) {
        board[i].push( "-" );
      }
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

Board.prototype.eachRow = function ( fn ) {
  for ( var i = 0; i < BOARD_SIZE; i++ ) {
    fn( this.rowValues( i ) );
  }
};

Board.prototype.eachColumn = function ( fn ) {
  for ( var i = 0; i < BOARD_SIZE; i++ ) {
    fn( this.columnValues( i ) );
  }
};

Board.prototype.eachSubBoard = function ( fn ) {
  var max = BOARD_SIZE / SUB_BOARD_SIZE - 1;
  for ( var i = 0; i < max; i++ ) {
    for ( var j = 0; j < max; j++ ) {
      fn( this.subBoardValues( i, j ) );
    }
  }
};

Board.numberSetIsValid = function ( arr ) {
  if ( arr.length !== BOARD_SIZE ) {
    return false;
  }
  return arr
    .map( Number )
    .sort( function ( a, b ) {
      return a - b;
    })
    .every( function ( value, i ) {
      return value === i + 1;
    });
};

module.exports = Board;
