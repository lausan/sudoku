// board generator
var _sudoku = require( "sudoku" );
var $ = require( "jquery" );

var fixtures = require( "./fixture" )();

var Board = require( "./board" );
var BoardView = require( "./board-view" );
var BoardController = require( "./board-controller" );
var solution = fixtures.solution;
var problem = fixtures.problem;

var sudoku;


sudoku = ( function () {
  var main = $( ".main" );
  var won = $( ".won" );

  $( ".js-new-game" ).click( function () {
    sudoku.newGame();
    won.slideUp();
  });

    return {
    // _game is exposed for debugging and inspection; doesn't need to be
    _game: {},
    makeBoard: function () {
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
    },
    newGame: function ( b ) {
      main.empty();
      var board = new Board( b || this.makeBoard() );
      var view = new BoardView();
      var ctrl = new BoardController( board, view );
      main.append( view.element );
      this._game = {
        board: board,
        view: view,
        ctrl: ctrl
      };
      board.on( "complete", this.won.bind( this ) );
    },
    won: function () {
      won.slideDown();
    }
  };
})();

// to make this entirely encapsulated we could just do:
//
// sudoku.newGame();
//
// ... and export nothing

module.exports = sudoku;
