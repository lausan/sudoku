"use strict";

// APP MODULES
var Emitter = require( "./emitter" );
var util = require( "./util" );

// PRIMARY MODULE CLASS

// BoardController mediates the interaction between a Board model
// and a BoardView

function BoardController ( board, view ) {
  this.board = board;
  this.view = view;
  this.view.render( this.board.asArray() );

  util.bindAll( this, "updateModel", "updateView", "updateInvalid" );

  this.view.on( "ui-change", this.updateModel );
  this.board.on( "data-change", this.updateView );
  this.board.on( "data-invalid", this.updateInvalid );

  this.view.render( this.board.asArray() );
}

BoardController.prototype = Object.create( Emitter.prototype );
BoardController.prototype.constructor = BoardController;

BoardController.prototype.updateModel = function ( x, y, value ) {
  this.board.set( x, y, value );
};

BoardController.prototype.updateView = function ( x, y, value ) {
  this.view.updateCell( x, y, value );
  this.view.updateStyle({
    "row": this.board.rowValidity(),
    "column": this.board.columnValidity(),
    "sub-board": this.board.subBoardValidity()
  });
};

BoardController.prototype.updateInvalid = function ( x, y, bool ) {
  this.view.toggleInvalid( x, y, bool );
};

BoardController.prototype.syncValidity = function () {

};

module.exports = BoardController;
