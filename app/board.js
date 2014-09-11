var _ = require( "lodash" );

var BOARD_WIDTH = 9;
var BOARD_HEIGHT = 9;

var SUB_BOARD_WIDTH = 3;
var SUB_BOARD_HEIGHT = 3;

function SubBoard () {
  var board = [];
  for ( var i = 0; i < SUB_BOARD_HEIGHT; i++ ) {
    board.push( [] );
    for ( var j = 0; j < SUB_BOARD_WIDTH; j++ ) {
      board[i].push( "" );
    }
  }
  this._board = board;
}

SubBoard.prototype.valid = function () {
  var values = _.flatten( this._board ).map( Number );
  if (
    values.some( isNaN ) ||
    values.length !== _.unique( values ).length
  ) {
    return false;
  }
  return true;
};
