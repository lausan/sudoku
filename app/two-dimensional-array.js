function TwoDimensionalArray ( height, width, fill ) {
  var arr;
  var value;
  this._array = [];
  for ( var i = 0; i < height; i++ ) {
    arr = [];
    for ( var j = 0; j < width; j++ ) {
      value = typeof fill !== "function" ?
        fill :
        fill( i, j );
      arr.push( value );
    }
    this._array.push( arr );
  }
}

TwoDimensionalArray.prototype.sum = function () {
  var total = 0;
  this._array.forEach( function ( row ) {
    row.forEach( function ( cell ) {
      total += cell;
    });
  });
  return total;
};
