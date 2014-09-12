var Emitter = require( "./emitter" );

function BoardController ( board, view ) {

}

BoardController.prototype = Object.create( Emitter.prototype );
BoardController.prototype.constructor = BoardController;
