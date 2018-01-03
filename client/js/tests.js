var grid = [
    ['red', '', '', '', '', '', ''],
    ['red', '', '', '', '', '', ''],
    ['red', '', '', '', '', '', ''],
    ['red', '', '', '', '', '', ''],
    ['red', 'red', '', 'yellow', '', '', ''],
    ['red', 'red', '', 'yellow', '', '', ''],
];

var columnnFull = false;

QUnit.test( "Find first empty in column test", function( assert ) {
  assert.equal(drawCircle(1,'red'), true, 'Column 2 row 3 is empty');
  assert.equal(drawCircle(0,'red'), false, 'Column 1 is full');
});
QUnit.test( "Draw circle function test", function( assert ) {
  assert.equal(drawCircle(2,'red'), grid[0][2] == 'red', 'Red circle drawn in column 3');
});
QUnit.test( "Check for free space next to position in grid", function( assert ) {
  assert.equal(AIfindNextBestMove(0,1), true, 'Space is free');
});
QUnit.test( "Test if AI finds winning move", function( assert ) {
  assert.equal(AIfindBestMove('yellow'), false, 'No possible winning moves');
});
