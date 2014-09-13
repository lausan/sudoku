"use strict";

require( "chai" ).should();

var fixtures = require( "./fixtures" )();
var BoardController = require( "../app/board-controller" );
var Board = require( "../app/board" );
var BoardView = require( "../app/board-view" );

var board;
var view;
var ctrl;

beforeEach( function () {
  board = new Board( fixtures.solution );
  view = new BoardView();
  document.body.appendChild( view.element[0] );
  ctrl = new BoardController( board, view );
});

afterEach( function () {
  document.body.removeChild( view.element[0] );
});

describe( "event listening behavior", function () {
  it( "Should respond to 'ui-change' events on the view by updating the model", function () {
    view.element.find( "input" ).eq( 0 ).val( 1 ).trigger( "input" );
    board.get( 0, 0 ).should.equal( 1 );
  });
});

describe( "instance methods", function () {
  describe( ".updateModel()", function () {
    it( "Should update the state of the model and view with the given value", function () {
      ctrl.updateModel( 0, 0, 1 );
      board.get( 0, 0 ).should.equal( 1 );
      view.element.find( "input" ).eq( 0 ).val().should.equal( "1" );
    });
  });

  describe( ".updateView()", function () {
    it( "Should update the state of the model and view with the given value", function () {
      ctrl.updateView( 0, 0, 1 );
      view.element.find( "input" ).eq( 0 ).val().should.equal( "1" );
    });
    it( "Should also update the style of the view", function () {
      ctrl.updateView( 0, 0, 5 );
      view.style.html().should.equal( "/* all valid */" );
    });
  });

  describe( ".updateInvalid()", function () {
    it( "Should notify a view that a cell has become valid or invalid", function () {
      ctrl.updateInvalid( 0, 0, true );
      view.cellAt( 0, 0 ).is( ".cell--invalid" ).should.equal( true );
      ctrl.updateInvalid( 0, 0, false );
      view.cellAt( 0, 0 ).is( ".cell--invalid" ).should.equal( false );
    });
  });
});
