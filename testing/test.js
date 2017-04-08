var sudoku = require('../sudoku.js');
var fs = require('fs');

const PROBLEMS_DIRECTORY = "problems";

function printUnsolvedSudoku (hints) {
  
  const GRID_SIZE = 9;
  
  var sudoku = "";

  for (let gr = 0; gr < GRID_SIZE; gr ++) {
    
    let row = hints[gr];
    let columns = row.split("");
    
    for (let gc = 0; gc < GRID_SIZE; gc ++) {
     
      sudoku += columns[gc];
      
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

fs.readdir(__dirname + "/" + PROBLEMS_DIRECTORY, function(err, items) {

  for (var i = 0; i < items.length; i++) {
      
    let problem = items[i];
    fs.readFile(PROBLEMS_DIRECTORY + "/" + problem, 'utf8', function (err, hints) {
  
      if (err) {
        return console.log(err);
      }
        
      hints = hints.split("\n");
        
      console.log("\n#######SUDOKU#######");
      console.log("Problem: ", problem, "\n");
        
      console.log("UNSOLVED");
      printUnsolvedSudoku(hints);
        
      console.log("SOLVED");
      console.time("SOLVED IN");
      sudoku.solveSudoku(hints);
      console.timeEnd("SOLVED IN");

    });
      
  }
    
});