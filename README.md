# sudoku [![Build Status](https://travis-ci.org/nickb1080/sudoku.svg)](https://travis-ci.org/nickb1080/sudoku)

This app is deployed on [GitHub Pages](https://pages.github.com/). Play a random board [here](http://nickb1080.github.io/sudoku/), or check out a [nearly finished one](http://nickb1080.github.io/sudoku/won.html) (just add "5" in the middle to win).

## App Structure
This app implements an event-driven MVC structure. This allows for sane management of game state, as well as loose coupling between components.

### `sudoku`
This app exposes a single global object, `sudoku`. `sudoku` is responsible for creating new games, and handling the associated setup and teardown. It's primary method is `newGame()`, which creates a new random board, wires up a model, view, and controller, and inserts the view into the page. An alternate method, `newSolvedGame()` is also provided, which generates a fully solved board (this method builds the same solved board each time). The `sudoku` object is exposed for inspectability in the browser console; it could easily instead be private instead.

### `Emitter`
`Emitter` is a basic, from-scratch, event-emitting class. `Board`, `BoardView`, and `BoardController` inherit from it. It allows objects to emit and listen for events, and also supports flexible listener removal.

### `Board`
`Board` is a model of the data underlying the game state. Under the hood, it uses a two-dimensional array. It implements methods for accessing values in rows, columns, as well as "sub-boards" (specific 3x3 portions of the board). It also contains data validation methods, to check whether the board is partially valid (i.e. there are no conflicts), or fully valid (i.e. completed and solved).

### `BoardView`
`BoardView` builds a user interface that represents the data of a board. It carries no reference to the board model itself. It's most significant method is `render`, which builds the HTML corresponding to a given board state. It also has methods for locating and updating specific cells once they've been rendered initially. Finally, it can generate a `<style>` element for given validity data, which provides specific styles for invalid rows, columns, or sub-boards.

### `BoardController`
`BoardController` is responsible for mediating the data flow between a view and a board. The implementation is fairly basic; simply, it updates a board model when changes occur in the UI view, and likewise updates the view when the model data changes. This allows the model and view to have no direct knowledge of the other.

## Technologies Used

### Build: Browserify
Browserify allows you to write modular client-side code with Node-style `require()`. This app uses `app/app.js` as the entry point; Browserify recursively resolves dependencies and bundles the code into a single file. The build script for this app uses the 'standalone' option to export a global variable, which is only necessary for inspecting and debugging in the browser.

## Test: Testling
Testling is an abstraction layer on top of [PhantomJS](http://phantomjs.org/), designed to work with Browserify. With minimal configuration in `package.json`, it runs the test suite in a headless browser. Each method of each class is thoroughly tested; the continuous integration status can be viewed on [Travis CI](https://travis-ci.org/nickb1080/sudoku).

