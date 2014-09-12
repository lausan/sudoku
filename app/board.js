"use strict";

// APP MODULES
var util = require( "./util" );
var Emitter = require( "./emitter" );

// MODULE CONSTANTS
var BOARD_SIZE = 9;
var SUB_BOARD_SIZE = 3;

// MODULE HELPERS
function validValue ( value ) {
  return value === null || (
    !isNaN( Number( value ) ) &&
    Number( value ) % 1 === 0 &&
    Number( value ) > 0 &&
    Number( value ) < 10
  );
}

// null for empty string
// number for numeric string
// value for any other value
function standardizeValue ( value ) {
  var num = Number( value );
  if ( value === "" ) {
    return null;
  }
  if ( typeof value === "string" && !isNaN( num ) ) {
    return num;
  }
  return value;
}

// PRIMARY MODULE CLASS
//
// The Board model is the single source of truth for the state of the game.

function Board ( board ) {
  this._board = board.map( util.sliceOne );
  this.on( "set", function () {
    if ( this.isComplete() ) {
      this.emit( "complete" );
    }
  }.bind( this ) );
}

Board.prototype = Object.create( Emitter.prototype );
Board.prototype.constructor = Board;

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
  var val = standardizeValue( value );
  var prev = this.get( x, y );
  if ( prev !== val ) {
    this._board[y][x] = standardizeValue( value );
    this.emit( "data-change", x, y, this.get( x, y ) );
  }
  if ( this.isComplete() ) {
    this.emit( "complete" );
  }
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

// Returns an array of values for a given
Board.prototype.subBoardValues = function ( i ) {
  if ( i > BOARD_SIZE - 1 ) {
    throw new Error( "Attempting to read sub-board out of range" );
  }
  var values = [];
  var y = i % SUB_BOARD_SIZE;
  var x = Math.floor( i / SUB_BOARD_SIZE );
  var startX = x * SUB_BOARD_SIZE;
  var endX = startX + SUB_BOARD_SIZE;
  var startY = y * SUB_BOARD_SIZE;
  var endY = startY + SUB_BOARD_SIZE;
  for ( var j = startX; j < endX; j++ ) {
    for ( var k = startY; k < endY; k++ ) {
      values.push( this.get( k, j ) );
    }
  }
  return values;
};

// Internal method for mapping rows, columns, or sub-boards
Board.prototype._mapGroup = function ( fn, which ) {
  var method = which + "Values";
  var results = [];
  for ( var i = 0; i < BOARD_SIZE; i++ ) {
    results.push( fn( this[method]( i ) ) );
  }
  return results;
};

// Calls `fn` with each row and returns the result.
Board.prototype.mapRows = function ( fn ) {
  return this._mapGroup( fn, "row" );
};

// Calls `fn` with each column and returns the result.
Board.prototype.mapColumns = function ( fn ) {
  return this._mapGroup( fn, "column" );
};

// Calls `fn` with each sub-board and returns the result.
Board.prototype.mapSubBoards = function ( fn ) {
  return this._mapGroup( fn, "subBoard" );
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

// Returns whether or not the board is in a valid solution state
Board.prototype.isComplete = function () {
  return this.mapRows( Board.isFullyValid )
    .concat( this.mapColumns( Board.isFullyValid ) )
    .concat( this.mapSubBoards( Board.isFullyValid ) )
    .every( util.identity );
};

// Returns a copy of the board's underlying 2d array
Board.prototype.asArray = function () {
  return this._board.map( util.sliceOne );
};

// Returns a flattened version of the underlying 2d array
Board.prototype.flatten = function () {
  return util.flatten( this._board );
};

// Checks if an array contains only 1, 2, 3, 4, 5, 6, 7, 8, 9, or null
Board.isPartiallyValid = function ( arr ) {
  var allValid = arr.every( validValue );
  var withoutNull = arr.filter( util.identity );
  return allValid && withoutNull.length === util.unique( withoutNull ).length;
};

// Checks if an array contains exactly 1, 2, 3, 4, 5, 6, 7, 8, 9
Board.isFullyValid = function ( arr ) {
  return util.unique( arr ).length === arr.length &&
    arr.length === BOARD_SIZE &&
    arr.every( validValue );
};

module.exports = Board;
