"use strict";

require( "chai" ).should();
var $ = require( "jquery" );

var Board = require( "../app/board" );
var BoardView = require( "../app/board-view" );
var fixtures = require( "./fixtures" )();

var view;
var board;

beforeEach( function () {
  view = new BoardView();
  board = new Board( fixtures.solution );
  view.render( board.asArray() );
});

describe( "event listening behavior", function () {
  it( "should emit a 'ui-change' event when a descendant input has an 'input' event", function () {
    var bool = false;
    view.on( "ui-change", function () {
      bool = true;
    });
    view.element.find( "input" ).eq( 20 ).trigger( "input" );
    bool.should.equal( true );
  });

  // phantomJS doesn't seem to support .focus() very well
  // however, an equivalent test works fine in the browser
  //
  // it( "should allow navigation between cells via ⌘+← and similar key combos", function () {
  //   var focused;
  //   var e = $.Event( "keydown" );
  //   e.which = 39;
  //   e.metaKey = true;
  //   view.cellAt( 0, 0 ).find( "input" ).trigger( e );
  //   focused = document.activeElement;
  //   view.cellAt( 1, 0 ).find( "input" )[0].should.equal( focused );
  // });

});

describe( "instance methods", function () {
  describe( ".render()", function () {
    it( "renders the provided 2d array as a sudoku board", function () {
      view.element.find( "input" ).eq( 0 ).val().should.equal( "5" );
      board.set( 0, 0, 1 );
      view.render( board.asArray() );
      view.element.find( "input" ).eq( 0 ).val().should.equal( "1" );
    });
    it( "builds elements with the correct CSS classes", function () {
      [].every.call( view.element.find( "ul" ), function ( ul ) {
        return $( ul ).is( ".row" );
      }).should.equal( true );
      var cell = view.element.find( "ul" ).eq( 3 ).find( "li" ).eq( 2 );
      cell.is( ".cell" ).should.equal( true );
      cell.is( ".column-2" ).should.equal( true );
      cell.is( ".row-3" ).should.equal( true );
      cell.is( ".sub-board-3" ).should.equal( true );
    });
  });

  describe( ".cellAt()", function () {
    it( "returns a jQuery selection of the cell at the provided coordinates", function () {
      var cell = view.cellAt( 2, 3 );
      cell.find( "input" ).val().should.equal( "9" );
    });
  });

  describe( ".updateCell()", function () {
    it( "changes the value of the input for the cell at the provided coordinates", function () {
      view.updateCell( 2, 3, 1 );
      view.cellAt( 2, 3 ).find( "input" ).val().should.equal( "1" );
    });
  });

  describe( ".updateStyle()", function () {
    it( "updates the <style> element to provide contextual help for invalid components", function () {
      board.set( 2, 3, 1 );
      var validity = {
        "row": board.rowValidity(),
        "column": board.columnValidity(),
        "sub-board": board.subBoardValidity()
      };
      view.updateStyle( validity );
      view.style.html().should.equal( ".row-3,.column-2,.sub-board-3{ background-color: rgba(231, 76, 60, .5 ); }" );
    });
  });

  describe( ".toggleInvalid()", function () {
    it( "toggles '.cell--invalid' on a given cell", function () {
      view.toggleInvalid( 0, 0, true );
      view.cellAt( 0, 0 ).is( ".cell--invalid" ).should.equal( true );
      view.toggleInvalid( 0, 0, false );
      view.cellAt( 0, 0 ).is( ".cell--invalid" ).should.equal( false );
    });
  });

});
