var $ = require( "jquery" );
var Emitter = require( "./emitter" );

var BOARD_SIZE = 9;
var ENTER = 13;

function flatIndexFromXY ( x, y ) {
  return y * BOARD_SIZE + x - 1;
}

function BoardView ( board ) {
  this.board = board;
  this.element = $( "<div class='board'>" );
  this._inputs = $();
  this.element.on( "change", "input", this.emit.bind( this, "change" ) );
}

BoardView.prototype = Object.create( Emitter.prototype );
BoardView.prototype.constructor = BoardView;

BoardView.prototype.setBoard = function ( board ) {
  this.board = board;
};

BoardView.prototype.render = function () {
  var html = "";
  var value;
  if ( !this.board ) {
    throw new Error( "No board registered for this view" );
  }
  for ( var i = 0; i < BOARD_SIZE; i++ ) {
    html += "<ul class='row'>";
    for ( var j = 0; j < BOARD_SIZE; j++ ) {
      value = this.board.get( j, i ) || "";
      html += "<li id='" + j + "-" + i + "' class='cell column-" + j + " row-" + i + "'>";
      html += "<input maxlength='1' class='cell--input' type='tel' value='" + value + "'>";
      html += "</li>";
    }
    html += "</ul>";
  }
  this.element.html( html );
};

BoardView.prototype.cellAt = function ( x, y ) {
  return this.element
    .find( ".row" )
    .eq( y )
    .find( ".cell" )
    .eq( x );
};

BoardView.prototype.update = function ( x, y, value, quiet ) {
  var input = this.cellAt( x, y ).children().val( value );
};

module.exports = BoardView;
