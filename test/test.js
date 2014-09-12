"use strict";

// phantomJS doesn't have bind
Function.prototype.bind = Function.prototype.bind || require( "function-bind" );

require( "./app" );
require( "./emitter" );
require( "./board" );
require( "./board-controller" );
require( "./board-view" );
