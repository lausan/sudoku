var slice = require( "./util" ).slice;

// Each method guards against this._events being undefined
// Allows us to avoid constructor logic
// and thus can omit `Emitter.call(this)` when subtyping
//
function Emitter () {}

// Add an event handler for a given event name
Emitter.prototype.on = function ( name, method ) {
  if ( !this._events ) {
    this._events = {};
  }
  if ( !this._events[name] ) {
    this._events[name] = [];
  }
  this._events[name].push( method );
  return this;
};

// Arguments after first are applied to the handlers.
// This implementation allows the same handler to be
// added more than once.
Emitter.prototype.emit = function ( name ) {
  var args;
  if ( !this._events ) {
    this._events = {};
  }
  if ( this._events[name] ) {
    args = slice( arguments, 1 );
    this._events[name].forEach( function ( method ) {
      method.apply( this, args );
    }.bind( this ) );
  }
  return this;
};

// Called without arguments: removes all handlers
// Called with name argument: removes all handlers for name
// Called with name and method: removes all handlers === method for name
Emitter.prototype.off = function ( name, method ) {
  var i;
  if ( !this._events ) {
    this._events = {};
  }
  if ( arguments.length === 0 ) {
    this._events = {};
  } else if ( arguments.length === 1 ) {
    this._events[name] = [];
  } else {
    if ( this._events[name] ) {
      i = this._events[name].indexOf( method );
      while ( i > -1 ) {
        this._events[name].splice( i, 1 );
        i = this._events[name].indexOf( method );
      }
    }
  }
};

module.exports = Emitter;
