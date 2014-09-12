// NPM MODULES
var $ = require( "jquery" );

// APP MODULES
var util = require( "./util" );
var Emitter = require( "./emitter" );

// MODULE CONSTANTS
var BOARD_SIZE = 9;
var SUB_BOARD_SIZE = 3;
var DIR = {
  37: [-1, 0], // keycode left
  38: [0, -1], // keycode up
  39: [1, 0],  // keycode right
  40: [0, 1]   // keycode down
};
var INVALID_STYLE = "{ background-color: rgba(255, 0, 0, .2); }";

// MODULE HELPERS

// calculates which "sub-board" a cell falls in
// assuming sub-boards are indexed left to right
// and top to bottom.
function calculateSubBoard ( x, y ) {
  return Math.floor( y / SUB_BOARD_SIZE ) * SUB_BOARD_SIZE + Math.floor( x / SUB_BOARD_SIZE );
}

// returns the HTML for a cell <li> element
// given its x,y location
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

// returns the HTML for an <input> element given its
// x,y location and it's initial value
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

// PRIMARY MODULE CLASS

// constructor & inheritance boilerplate
function BoardView () {
  this.element = $( "<div class='board'>" );
  this.style = $( "<style>" ).appendTo( document.head );
  this.element
    // this handler emits change events when user enters data
    .on( "input", "input", this.emit.bind( this, "change" ) )
    // This handler lets the user navigate cells with:
    // ⌘+←, ⌘+↑, ⌘+→, ⌘+↓
    .on( "keydown", "input", function ( evt ) {
      var prev, next, cell;
      if ( evt.metaKey && DIR[evt.which] ) {
        evt.preventDefault();
        prev = evt.target.id.split( "-" ).map( Number );
        next = util.addArrays( prev, DIR[evt.which] );
        if ( next[0] > -1 && next[0] < 10 && next[1] >-1 && next[1] < 10 ) {
          this.cellAt( next[0], next[1] ).find( "input" ).focus().select();
          console.log( document.activeElement.tagName );
        }
      }
    }.bind( this ) );
}

BoardView.prototype = Object.create( Emitter.prototype );
BoardView.prototype.constructor = BoardView;


// INSTANCE METHODS

// Generate the HTML for a given board
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

// Returns a jQuery selection of the cell at the given coordinates
BoardView.prototype.cellAt = function ( x, y ) {
  return this.element
    .find( ".row" )
    .eq( y )
    .find( ".cell" )
    .eq( x );
};

// Updates the value of a cell at the given coordinates
BoardView.prototype.updateCell = function ( x, y, value ) {
  this.cellAt( x, y ).children().val( value );
};

// Updates the board's styles to reflect invalid
// rows, columns or sub-boards
BoardView.prototype.updateStyle = function ( validity ) {
  var style = "/* all valid */";
  var selectors = Object.keys( validity ).reduce( function ( selectors, key ) {
    return selectors.concat(
      validity[key]
        .map( function ( bool, i ) {
          return bool ? false : "." + key + "-" + i;
        })
        .filter( util.identity )
    );
  }, [] );
  if ( selectors.length ) {
    style = selectors.join( "," ) + INVALID_STYLE;
  }
  this.style.html( style );
};

module.exports = BoardView;
