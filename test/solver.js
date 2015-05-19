"use strict";

require("chai").should();

var SudokuSolver = require("../app/solver");

// the sudoku library has a solve method
var sudoku = require("sudoku");

var ntest = 10;

function makeBoard (puzzle) {
  // generator creates values 0-8 rather than 1-9
  var generated = puzzle.map( function ( item ) {
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

describe( "SudokuSolver", function() {
  it( "should match the output of sudoku.solvepuzzle" , function() {
    for (var i = 0; i < ntest; i++) {
      var puzzle = sudoku.makepuzzle();
      var board = makeBoard(puzzle);
      var solution = makeBoard(sudoku.solvepuzzle(puzzle));
      SudokuSolver(board).should.equal(solution);
    }
  });
});
