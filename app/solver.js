function SudokuSolver(board) {

  var n = board.length;
  var sn = Math.sqrt(n);
  var solved;

  (function solve () {
    if (solved) return;
    var next = firstMissing(board);
    var values, r, c;
    if (next === null) {
      // copy the board
      solved = board.map(function(row) {
        return row.map(id);
      });
      return;
    }
    r = next[0];
    c = next[1];
    values = set(row(board, r).concat(column(board, c),
                                      subsquare(board, Math.floor(r / sn), Math.floor(c / sn))));
    for (var val = 1; val <= n; val++) {
      if (!values[val]) {
        board[r][c] = val;
        solve();
        board[r][c] = null;
      }
    }
  })()

  return solved;

}

function id(x) {
  return x;
}

function set(arr) {
  return arr.reduce(function(memo, item) {
    memo[item] = true;
    return memo;
  }, {});
}

function column(board, c) {
  return board.map(function(row) {
    return row[c];
  });
}

function row(board, r) {
  return board[r];
}

function subsquare(board, i, j) {
  var n = board.length;
  var sn = Math.sqrt(n);
  var row = i * 3, col = j * 3;
  var result = [];

  for (var r = row; r < row + sn; r++) {
    for (var c = col; c < col + sn; c++) {
      result.push(board[r][c]);
    }
  }

  return result;

}

function firstMissing(board) {
  var c;
  for (var r = 0; r < board.length; r++) {
    c = board[r].indexOf(null);
    if (c !== -1) break;
  }
  if (r === board.length && c === -1) {
    // no missing values
    return null;
  } else {
    return [r, c];
  }
}


module.exports = SudokuSolver;
