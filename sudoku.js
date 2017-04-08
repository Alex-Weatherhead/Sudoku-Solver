/*
  ~Sudoku~
  Author: Alex Weatherhead
  Date: Wednesday, April 5, 2017
*/

const VALUES = ['1','2','3','4','5','6','7','8','9'];
const GRID_SIZE = 9;
const GRID_ROWS = "ABCDEFGHI";
const GRID_COLUMNS = "123456789";
const PEERS_BY_SQUARE = getPeers();
  
function getUnits () {
  
  const SUBGRID_SIZE = 3;
  const SUBGRID_ROWS = ["ABC", "DEF", "GHI"];
  const SUBGRID_COLUMNS = ["123", "456", "789"];
  
  function cross (rows, columns) {
    
    var cross = [];
    
    let index = 0;
    for (let r = 0; r < rows.length; r ++){
      for (let c = 0; c < columns.length; c ++){
        cross[index++] = (rows[r] + columns[c]);
      }
    }

    return cross;
    
  }
  
  var units = [];
  
  let index = 0;
  for (let gn = 0; gn < GRID_SIZE; gn ++) {
    units[index++] = cross(GRID_ROWS[gn], GRID_COLUMNS);
    units[index++] = cross(GRID_ROWS, GRID_COLUMNS[gn]);
  }
  for (let sgr = 0; sgr < SUBGRID_SIZE; sgr ++) {
    for (let sgc = 0; sgc < SUBGRID_SIZE; sgc ++) {
      units[index++] = cross(SUBGRID_ROWS[sgr], SUBGRID_COLUMNS[sgc]);
    }
  }
  
  return units;
  
}
function getPeers () {

  var peers = {};
  var units = getUnits();
  
  let numberOfUnits = (units.length);
  
  let key, value;
  for (let gr = 0; gr < GRID_SIZE; gr ++) {
    for (let gc = 0; gc < GRID_SIZE; gc ++) {
     
      key = (GRID_ROWS[gr] + GRID_COLUMNS[gc]);
      value = [];
      
      for (let un = 0; un < numberOfUnits; un ++) {
      
        let unit = units[un].slice();
        let index = unit.indexOf(key);
        
        if (index >= 0){
          unit.splice(index, 1);
          value = value.concat(unit);
        }
        
      }
      
      peers[key] = value;
      
    }
  }

  return peers;
  
}

function initializeSudoku (hints) {
  
  const BLANK_SQUARE = "X";
  
  var assigned = {};
  var unassigned = [];
  
  let key, value;
  let index = 0;
  for (let gr = 0; gr < GRID_SIZE; gr ++) {
    for (let gc = 0; gc < GRID_SIZE; gc ++) {
      
      key = GRID_ROWS[gr] + GRID_COLUMNS[gc];
      value = hints[gr][gc];
      
      if (value === BLANK_SQUARE) {
        unassigned[index++] = key;
      }
      else {
        assigned[key] = value;
      }
       
    }
  }
  
  return {
    assigned,
    unassigned
  };
  
}
function solveSudoku (hints) {
  
  var sudoku = initializeSudoku(hints);
  
  let assigned = sudoku.assigned;
  let unassigned = sudoku.unassigned;
  
  return backtrack (unassigned, assigned);
  
}
function printSolvedSudoku (assigned) {
  
  var sudoku = "";
  for (let gr = 0; gr < GRID_SIZE; gr ++) {
    
    for (let gc = 0; gc < GRID_SIZE; gc ++) {
     
      let key = GRID_ROWS[gr] + GRID_COLUMNS[gc];
      let value = assigned[key];
      
      sudoku += value;
      
      if ((gc+1) % 3 === 0 && (gc+1) !== GRID_SIZE){
        sudoku += "|";
      }
      
    }
  
    if ((gr+1) % 3 === 0 && (gr+1) !== GRID_SIZE){
      sudoku += "\n";
      sudoku += "---+---+---"
    }
    
    sudoku += "\n";
    
  }
  
  console.log(sudoku);
  
}

function getPossibleValues (square, assigned) {

  var impossibleValues = [];
  
  var peers = PEERS_BY_SQUARE[square];
  
  var numberOfPeers = peers.length;
  
  let key, value;
  let index = 0;
  for (let p = 0; p < numberOfPeers; p ++) {
    
    key = peers[p];
    value = assigned[key];
    
    if (typeof value !== 'undefined')
      impossibleValues[index++] = value;
    
  }
  
  return VALUES.filter(function (value) {
    
    if (!impossibleValues.includes(value)){
      return value;
    }
    
  });

}
function minimumPossibleValues (unassigned, assigned) {

  var values = Infinity;
  var square = null;
  
  let key, value;
  for (let u = 0; u < unassigned.length; u ++) {
    
    key = unassigned[u];
    value = getPossibleValues(key, assigned);
    
    if (value.length < values){
      values = value.length;
      square = key;
    }
    
  }
  
  return square;
  
}

function backtrack (unassigned, assigned) {

  let square = minimumPossibleValues(unassigned, assigned);
  
  if (unassigned.length === 0){
    
    printSolvedSudoku(assigned);
    return true;
    
  }
  
  let values = getPossibleValues(square, assigned);
        
  if (values.length !== 0) {
    
    for (let v = 0; v < values.length; v ++) {
      
      let ua = unassigned.slice();
      ua.splice(unassigned.indexOf(square),1);
      
      let a = JSON.parse(JSON.stringify(assigned));
      a[square] = values[v];
      
      if (backtrack(ua, a)){
        return true;
      }
       
    }
    
  }
  
  return false;
  
}

module.exports.solveSudoku = solveSudoku;