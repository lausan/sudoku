// phantomJS doesn't have bind
Function.prototype.bind = Function.prototype.bind || require( "function-bind" );

require( "./emitter" );
require( "./board" );
require( "./controller" );
require( "./board-view" );
