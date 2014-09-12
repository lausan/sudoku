var should = require( "chai" ).should();
var $ = require( "jquery" );

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
  it( "Should respond to 'change' events on the view by updating the model", function () {
    view.element.find( "input" ).eq( 0 ).val( 1 ).trigger( "input" );
    board.get( 0, 0 ).should.equal( 1 );
  });
});

describe( "instance methods", function () {
  describe( "syncCell", function () {
    it( "Should update the state of the model and view with the given value", function () {
      ctrl.syncCell( 0, 0, 1 );
      board.get( 0, 0 ).should.equal( 1 );
      view.element.find( "input" ).eq( 0 ).val().should.equal( "1" );
    });
  });
  describe( "syncValidity", function () {
    it( "Should send validation information to the view", function () {
      ctrl.syncValidity();
      view.style.html().should.equal( "/* all valid */" );
    });
  });
});
