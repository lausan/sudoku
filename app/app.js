"use strict";

// board generator
var _sudoku = require( "sudoku" );
var $ = require( "jquery" );

var Board = require( "./board" );
var BoardView = require( "./board-view" );
var BoardController = require( "./board-controller" );
var SudokuSolver = require("./solver");

var sudoku = ( function () {
  var main = $( ".main" );
  var won = $( ".won" );

  $( ".js-new-game" ).click( function () {
    sudoku.newGame();
    won.slideUp();
  });

  $( ".js-solve" ).click( function () {
    sudoku.newGame(SudokuSolver(sudoku._game.board._board));
    onWin();
  });

  function toggleCells ( onOff ) {
    main.find( ".board .cell--input" ).prop( "disabled", onOff );
  }

  function makeBoard () {
    // generator creates values 0-8 rather than 1-9
    var generated = _sudoku.makepuzzle().map( function ( item ) {
      if ( typeof item === "number" ) {
        item += 1;
      }
      return item;
    });
    var board = [];
    while ( generated.length ) {
      board.push( generated.splice( 0, 9 ) );
    }
    return board;
  }

  function onWin () {
    toggleCells( true );
    won.slideDown();
  }

  return {
    _game: {},
    newGame: function ( b ) {
      toggleCells( false );
      main.empty();
      var board = new Board( b || makeBoard() );
      var view = new BoardView();
      var ctrl = new BoardController( board, view );
      // _game is exposed for debugging and inspection; doesn't need to be
      this._game = {
        board: board,
        view: view,
        ctrl: ctrl
      };
      main.append( view.element );
      board.on( "complete", onWin );
    },
    newSolvedGame: function () {
      this.newGame([
        [5,3,4,6,7,8,9,1,2],
        [6,7,2,1,9,5,3,4,8],
        [1,9,8,3,4,2,5,6,7],
        [8,5,9,7,6,1,4,2,3],
        [4,2,6,8,5,3,7,9,1],
        [7,1,3,9,2,4,8,5,6],
        [9,6,1,5,3,7,2,8,4],
        [2,8,7,4,1,9,6,3,5],
        [3,4,5,2,8,6,1,7,9]
      ]);
    }
  };
})();

sudoku.newGame();

// exposing sudoku object for inspection
module.exports = sudoku;
