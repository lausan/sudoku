var fixtures = require( "./fixture" )();
console.log(Object.keys(fixtures));
module.exports = {
  Board: require( "./board" ),
  BoardView: require( "./board-view" ),
  solution: fixtures.solution,
  problem: fixtures.problem
};
