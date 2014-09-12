function unique ( arr ) {
  return arr.reduce( function ( result, item ) {
    if ( result.indexOf( item ) === -1 ) {
      result.push( item );
    }
    return result;
  }, [] );
}

function flatten ( arr ) {
  return arr.reduce( function ( result, item ) {
    [].push.apply( result, Array.isArray( item ) ? flatten( item ) : [ item ] );
    return result;
  }, [] );
}

function identity ( obj ) {
  return obj;
}

function validValue ( value ) {
  return (
    Number( value ) === value &&
    value % 1 === 0 &&
    value > 0 &&
    value < 10
  );
}

function demethodize ( method ) {
  return Function.prototype.call.bind( method );
}

function opposite ( value ) {
  return !value;
}

function addArrays ( arr1, arr2 ) {
  return arr1.map( function ( item, i ) {
    return item + arr2[i];
  });
}

module.exports = {
  unique: unique,
  flatten: flatten,
  identity: identity,
  validValue: validValue,
  slice: demethodize( [].slice ),
  opposite: opposite,
  addArrays: addArrays
};
