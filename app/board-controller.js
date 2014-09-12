// APP MODULES
var Emitter = require( "./emitter" );
var BoardView = require( "./board-view" );

// PRIMARY MODULE CLASS

// BoardController mediates the interaction between a Board model
// and a BoardView

function BoardController ( board, view ) {
  this.board = board;
  this.view = view || new BoardView();
  this.view.render( this.board.asArray() );
  this.view.on( "change", function ( evt ) {
    var coord = evt.target.id.split( "-" );
    this.syncCell( coord[0], coord[1], evt.target.value );
    this.syncValidity();
  }.bind( this ) );
}

BoardController.prototype = Object.create( Emitter.prototype );
BoardController.prototype.constructor = BoardController;

//
BoardController.prototype.syncCell = function ( x, y, value ) {
  this.board.set( x, y, value || null );
  this.view.updateCell( x, y, this.board.get( x, y ) );
};

BoardController.prototype.syncValidity = function () {
  this.view.updateStyle({
    "row": this.board.rowValidity(),
    "column": this.board.columnValidity(),
    "sub-board": this.board.subBoardValidity()
  });
};

module.exports = BoardController;
