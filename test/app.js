"use strict";

var $ = require( "jquery" );
require( "chai" ).should();

var main = $( "<div class='main'></div>" );
$( "body" ).append( main );

var app = require( "../app/app.js" );

// function identity ( x ) { return x; }

describe( "newGame()", function () {
  it( "generates a new random game board", function () {
    app.newGame();
    var board1 = app._game.board.flatten();
    main.find( ".board" ).length.should.equal( 1 );
    [].every.call( main.find( "input" ), function ( el ) {
      return el.value;
    }).should.equal( false );
    app.newGame();
    var board2 = app._game.board.flatten();
    board1.should.not.deep.equal( board2 );
  });
});

describe( "newSolvedGame()", function () {
  it( "generates a fixed solved board", function () {
    app.newSolvedGame();
    var board1 = app._game.board.flatten();
    [].every.call( main.find( "input" ), function ( el ) {
      return el.value;
    }).should.equal( true );
    app.newSolvedGame();
    var board2 = app._game.board.flatten();
    board1.should.deep.equal( board2 );
  });
  app.newSolvedGame();

});
