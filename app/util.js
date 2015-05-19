"use strict";

// This file contains utility functions used throughout the app.

function unique ( arr ) {
  return arr.reduce( function ( result, item ) {
    if ( result.indexOf( item ) === -1 ) {
      result.push( item );
    }
    return result;
  }, [] );
}

// http://jsperf.com/push-flatten-vs-concat-flatten
// flattening with push.apply is faster than .concat
function flatten ( arr ) {
  return arr.reduce( function ( result, item ) {
    [].push.apply( result, Array.isArray( item ) ? flatten( item ) : [ item ] );
    return result;
  }, [] );
}

function identity ( obj ) {
  return obj;
}

function demethodize ( method ) {
  return Function.prototype.call.bind( method );
}

function demethodizeOne ( method ) {
  return function ( arg ) {
    return method.call( arg );
  };
}

function opposite ( value ) {
  return !value;
}

function addArrays ( arr1, arr2 ) {
  return arr1.map( function ( item, i ) {
    return item + arr2[i];
  });
}

function bindAll ( obj ) {
  var args = [].slice.call( arguments, 1 );
  args.forEach( function ( method ) {
    var fn = obj[method];
    obj[method] = fn.bind( obj );
  });
  return obj;
}

function set(arr) {
  return arr.reduce(function(memo, item) {
    memo[item] = true;
    return memo;
  }, {});
}

module.exports = {
  unique: unique,
  flatten: flatten,
  identity: identity,
  opposite: opposite,
  sliceOne: demethodizeOne( [].slice ),
  slice: demethodize( [].slice ),
  bindAll: bindAll,
  addArrays: addArrays,
  set: set
};
