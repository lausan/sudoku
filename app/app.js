var fixtures = require( "./fixture" )();

module.exports = {
  Board: require( "./board" ),
  BoardView: require( "./board-view" ),
  BoardController: require( "./board-controller" ),
  solution: fixtures.solution,
  problem: fixtures.problem
};
