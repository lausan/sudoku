var should = require( "chai" ).should();

var Board = require( "../app/board" );
var fixtures = require( "../app/fixture" )();

var unsolved;
var solved;

var fourthColumn = [ 7, 9, 4, 6, 5, 2, 3, 1, 8 ];
var fourthRow = [ 4, 2, 6, 8, 5, 3, 7, 9, 1 ];
var fourthSubBoard = [ 7, 6, 1, 8, 5, 3, 9, 2, 4 ];

function last ( arr ) {
  return arr[ arr.length - 1 ];
}

function identity ( x ) {
  return x;
}

describe( "Constructor" , function () {
  it( "Should copy the board rather than hold reference to original", function () {
    var board = new Board( fixtures.solution );
    board._board.should.not.equal( fixtures.solution );
    board._board.should.deep.equal( fixtures.solution );
  });
});

beforeEach( function () {
  unsolved = new Board( fixtures.problem );
  solved = new Board( fixtures.solution );
});

describe( "instance event listening behavior", function () {
  it( "should emit a 'complete' event after 'set' if .isComplete()", function () {
    var bool = false;
    solved.on( "complete", function () {
      bool = true;
    });
    solved.set( 0, 0, 5 );
    bool.should.equal( true );
  });
});

describe( "instance methods", function () {
  describe( ".get()", function () {
    it( "should get value at coordinates", function () {
      solved.get( 0, 0 ).should.equal( 5 );
      solved.get( 8, 8 ).should.equal( 9 );
    });
  });

  describe( ".set()", function () {
    it( "should set value at coordinates", function () {
      solved.set( 0, 0, 8 );
      solved.get( 0, 0 ).should.equal( 8 );
    });
  });

  describe( ".columnValues()", function () {
    it( "should return an array of all values in a column", function () {
      solved.columnValues( 4 ).should.deep.equal( fourthColumn );
    });
  });

  describe( ".rowValues()", function () {
    it( "should return a copy of a row array", function () {
      solved.rowValues( 4 ).should.deep.equal( fourthRow );
      solved.rowValues( 4 ).should.not.equal( solved._board[4] );
    });
  });

  describe( ".subBoardValues()", function () {
    it( "should return an array of all values in a sub-board", function () {
      solved.subBoardValues( 4 ).should.deep.equal( fourthSubBoard );
    });
  });

  describe( ".mapColumns()", function () {
    it( "should return an array of the results of running the callback on each column", function () {
      solved.mapColumns( last ).should.deep.equal( last( fixtures.solution ) );
    });
  });

  describe( ".mapRows()", function () {
    it( "should return an array of the results of running the callback on each row", function () {
      solved.mapRows( last ).should.deep.equal([ 2, 8, 7, 3, 1, 6, 4, 5, 9, ]);
    });
  });

  describe( ".mapSubBoards()", function () {
    it( "should return an array of the results of running the callback on each sub-board", function () {
      solved.mapSubBoards( last ).should.deep.equal([ 8, 2, 7, 3, 4, 6, 5, 6, 9 ]);
    });
  });

  describe( ".rowValidity()", function () {
    it( "Should map over the rows returning whether they're valid (tolerating incomplete)", function () {
      solved.rowValidity().every( identity ).should.equal( true );
      solved.set( 4, 1, 1 );
      solved.rowValidity()[1].should.equal( false );
    });
  });

  describe( ".columnValidity()", function () {
    it( "Should map over the rows returning whether they're valid (tolerating incomplete)", function () {
      solved.columnValidity().every( identity ).should.equal( true );
      solved.set( 4, 1, 1 );
      solved.columnValidity()[4].should.equal( false );
    });
  });

  describe( ".subBoardValidity()", function () {
    it( "Should map over the rows returning whether they're valid (tolerating incomplete)", function () {
      solved.subBoardValidity().every( identity ).should.equal( true );
      solved.set( 4, 1, 1 );
      solved.subBoardValidity()[1].should.equal( false );
    });
  });

  // var validities = {
  //   "rows": "rowValidity",
  //   "columns": "columnValidity",
  //   "subBoards": "subBoardValidity"
  // };

  // Object.keys( validities ).forEach( function ( key ) {
  //   describe( "." + validities[key] + "()", function () {
  //     it( "Should map over the" + key + "returning whether they're valid (tolerating incomplete)", function () {
  //       solved.rowValidity().every( identity ).should.equal( true );
  //       solved.set( 0, 0, 1 );
  //       solved.rowValidity()[0].should.equal( false );
  //     });
  //   });
  // });

  describe( ".isComplete()", function () {
    it( "Should return true if the board is solved, otherwise false", function () {
      solved.isComplete().should.equal( true );
      unsolved.isComplete().should.equal( false );
      solved.set( 0, 0, 1);
      solved.isComplete().should.equal( false );
    });
  });

  describe( ".asArray()", function () {
    it( "Shoud return a copy of the board", function () {
      var arr = solved.asArray();
      solved.set( 0, 0, 1 );
      solved.get( 0, 0 ).should.equal( 1 );
      arr[0][0].should.equal( 5 );
    });
  });

  describe( ".flatten()", function () {
    it( "Should return a flat copy of the board", function () {
      var arr = solved.flatten();
      arr.length.should.equal( 81 );
    });
  });
});

describe( "static methods", function () {
  describe( "Board.isPartiallyValid()", function () {
    it( "Should check if an array contains only 1-9 or null, and if it's non-null values are unique", function () {
      Board.isPartiallyValid([ 9, 6, 3, 2, 4, 7 ]).should.equal( true );
      Board.isPartiallyValid([ 1, 2, 3, 4, null ]).should.equal( true );
      Board.isPartiallyValid([ 1, 1, 3, 4, null ]).should.equal( false );
      Board.isPartiallyValid([ 1, 2, 3, 4, 0 ]).should.equal( false );
    });
  });
  describe( "Board.isPartiallyValid()", function () {
    it( "Should check if an array contains exactly the values 1-9", function () {
      Board.isPartiallyValid([ 9, 8, 7, 6, 5, 4, 3, 2, 1 ]).should.equal( true );
      Board.isPartiallyValid([ 9, 8, 7, 6, 6, 4, 3, 2, 1 ]).should.equal( false );
    });
  });
});
