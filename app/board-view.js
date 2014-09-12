// npm modules
var $ = require( "jquery" );

// app modules
var util = require( "./util" );
var Emitter = require( "./emitter" );

// module constants
var BOARD_SIZE = 9;
var SUB_BOARD_SIZE = 3;
var UP;
var DOWN;
var LEFT;
var RIGHT;
var INVALID_STYLE = "{ background-color: rgba(255, 0, 0, .2); }";

// module helpers
var counter = (function() {
  var num = 0;
  return function () {
    return ++num;
  };
})();

function calculateSubBoard ( x, y ) {
  return Math.floor( x / SUB_BOARD_SIZE ) * SUB_BOARD_SIZE + Math.floor( y / SUB_BOARD_SIZE );
}

function makeLi ( x, y ) {
  return [
    "<li class='cell column-",
    x,
    " row-",
    y,
    " sub-board-",
    calculateSubBoard( x, y ),
    "'>"
  ].join( "" );
}

function makeInput ( x, y, value ) {
  return [
    "<input maxlength='1' class='cell--input' id='",
    x,
    "-",
    y,
    "' type='tel' value='",
    value,
    "'>"
  ].join( "" );
}

// primary module class

// constructor & inheritance boilerplate
function BoardView () {
  this.element = $( "<div class='board'>" );
  this.style = $( "<style>" ).appendTo( document.head );
  this.element.on( "change", "input", this.emit.bind( this, "change" ) );
}

BoardView.prototype = Object.create( Emitter.prototype );
BoardView.prototype.constructor = BoardView;

// instance Methods
BoardView.prototype.setBoard = function ( board ) {
  this.board = board;
};

BoardView.prototype.render = function ( data ) {
  var html = "";
  var value;
  for ( var y = 0; y < BOARD_SIZE; y++ ) {
    html += "<ul class='row'>";
    for ( var x = 0; x < BOARD_SIZE; x++ ) {
      value = data[y][x] || "";
      html += makeLi( x, y );
      html += makeInput( x, y, value );
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

BoardView.prototype.updateCell = function ( x, y, value ) {
  var input = this.cellAt( x, y ).children().val( value );
};

BoardView.prototype.updateStyle = function ( validity ) {
  var selectors = Object.keys( validity ).reduce( function ( selectors, key ) {
    return selectors.concat(
      validity[key]
        .map( function ( bool, i ) {
          return bool ? false : "." + key + "-" + i;
        })
        .filter( util.identity )
    );
  }, [] );
  var style = selectors.length ?
    selectors.join( ",\n" ) + INVALID_STYLE :
    " ";
  this.style.html( style );
};

module.exports = BoardView;
