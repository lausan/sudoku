"use strict";

// APP MODULES
var Emitter = require( "./emitter" );

// PRIMARY MODULE CLASS

// BoardController mediates the interaction between a Board model
// and a BoardView

function BoardController ( board, view ) {
  this.board = board;
  this.view = view;
  this.view.render( this.board.asArray() );
  this.view.on( "ui-change", function ( x, y, value ) {
    this.updateModel( x, y, value );
  }.bind( this ) );

  this.board.on( "data-change", function ( x, y, value ) {
    this.updateView( x, y, value );
    this.syncValidity();
  }.bind( this ) );

  this.view.render( this.board.asArray() );
}

BoardController.prototype = Object.create( Emitter.prototype );
BoardController.prototype.constructor = BoardController;

BoardController.prototype.updateModel = function ( x, y, value ) {
  this.board.set( x, y, value );
};

BoardController.prototype.updateView = function ( x, y, value ) {
  this.view.updateCell( x, y, value );
};

BoardController.prototype.syncValidity = function () {
  this.view.updateStyle({
    "row": this.board.rowValidity(),
    "column": this.board.columnValidity(),
    "sub-board": this.board.subBoardValidity()
  });
};

module.exports = BoardController;
