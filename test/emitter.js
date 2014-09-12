var should = require( "chai" ).should();

var Emitter = require( "../app/emitter" );

var thing;
var multiply;
var add;
var results;
var recorder;

beforeEach( function () {
  results = [];
  thing = new Emitter();
  multiply = function ( a, b ) { results.push( a * b ); };
  add = function ( a, b ) { results.push( a + b ); };
  recorder = function () {
    recorder.called = true;
  };
  recorder.called = false;
});

// In general, running tests on "private" properties is no good,
// however this implementation is pretty standard, and, more
// importantly, there's not really another good way to  test
// these methods in isolation.

describe( ".on()", function () {
  it( "registers an event listener", function () {
    thing.on( "math", multiply );
    thing.on( "math", add );
    thing._events.math[0].should.equal( multiply );
    thing._events.math[1].should.equal( add );
    thing.on( "math", multiply );
    thing._events.math.length.should.equal( 3 );
  });
});

describe( ".emit()", function () {
  it( "calls registered listeners", function () {
    thing.on( "boom", recorder );
    recorder.called.should.equal( false );
    thing.emit( "boom" );
    recorder.called.should.equal( true );
  });
  it( "passes arguments to registered listeners", function () {
    thing.on( "math", multiply );
    thing.on( "math", add );
    thing.emit( "math", 3, 4 );
    results.should.deep.equal([ 12, 7 ]);
  });
});

describe( ".off()", function () {
  it( "removes all listeners when called with no arguments", function () {
    thing.on( "a", add );
    thing.on( "b", multiply );
    should.exist( thing._events.a );
    should.exist( thing._events.b );
    thing.off();
    should.not.exist( thing._events.a );
    should.not.exist( thing._events.b );
  });
  it( "removes all listeners of a type when called with one argument", function () {
    thing.on( "a", add );
    thing.on( "b", multiply );
    should.exist( thing._events.a );
    should.exist( thing._events.b );
    thing.off( "a" );
    should.not.exist( thing._events.a );
    should.exist( thing._events.b );
  });
  it( "removes specific listener functions when called with two arguments", function () {
    thing.on( "math", add );
    thing.on( "math", add );
    thing.on( "math", multiply );
    thing._events.math.length.should.equal( 3 );
    thing.off( "math", add );
    thing._events.math.length.should.equal( 1 );
    thing._events.math[0].should.equal( multiply );
  });
});
