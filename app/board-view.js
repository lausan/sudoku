var $ = require( "jquery" );

function BoardView ( board ) {
  this.boardInstance = board;
  this.element = $( "<div class='board'>" );
  this.element.on( "change", function ( evt ) {
    console.log( evt );
  });
  this.render();
}

BoardView.prototype.render = function () {
  var html = "";
  var value;
  for ( var i = 0; i < this.boardInstance._board.length; i++ ) {
    html += "<ul class='row'>";
    for ( var j = 0; j < this.boardInstance._board[i].length; j++ ) {
      value = this.boardInstance.get( j, i ) || "";
      html += "<li id='" + j + "-" + i + "' class='cell'>";
      html += "<input class='cell--input' type='tel' value='" + value + "'>";
      html += "</li>";
    }
    html += "</ul>";
  }
  this.element.html( html );
};

module.exports = BoardView;
