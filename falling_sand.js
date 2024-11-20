//function creates a 2D array and initializes all values as 0
function make2DArray(cols, rows){
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++){
        arr[i] = new Array(rows)
        for (let j = 0; j< arr[i].length; j++){
            arr[i][j] = 0;
        }
    }
    return arr
}



let grid;
let w = 10;
let cols, rows;

//Initialize sand color
let hueValue = 1;

//checks if its within column limit
function withinCols(pos){
    return pos>=0 && pos<=cols-1;
}
//checks if its within row limit
function withinRows(pos){
    return pos>=0 && pos<=rows-1;
}

function clearGrid() {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = 0;
      }
    }
  }

function exportGridAsPNG() {
    saveCanvas("falling_sand_grid", "png");
}
//Developing the window for sand falling
function setup(){
    createCanvas(550,550);

    colorMode(HSB, 360, 255, 255);
    cols = width / w;
    rows = height / w ;
    grid = make2DArray(cols,rows);
}

//Defines the mouse movement action
function mouseMoved(){
    let col = floor(mouseX / w);
    let row = floor(mouseY / w);
    if (withinCols(col) && withinRows(row) && grid[col][row]===0){
        //gives huevalue to each sand granule generated
        grid[col][row] = hueValue;
    }
    //increment huevalue to get different colors
    hueValue+=1;
    //if its greater than 360 bring the hue back to 1
    if (hueValue>360){
        hueValue = 1;
    }

}


function draw(){
    background(0);
    noFill();
    stroke(210);
    strokeWeight(2); // Adjust the stroke weight as needed
    rect(0, 0, width, height);
    for (let i=0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            noStroke();
            if (grid[i][j] > 0){
                fill(grid[i][j], 255,255);
                let x = i*w;
                let y = j*w;
                square(x,y,w);
            }   
        }
    }
    //make a duplicate 2d array where the changes will be made
    let nextGrid = make2DArray(cols,rows);
    for (let i=0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            //store the current state of grid cell
            let state = grid[i][j];

            if (state > 0){       
                //get the value of the cell below the current cell
                let below = grid[i][j+1];

                //dir helps define the direction the san granule falls to as it builds the heap
                //let direction be 1 - right side
                let dir = 1;

                //at 50% probability assign dir value randomly
                if (random(1)<0.5){
                    dir *= -1;
                }

                //define to variables to denote left and right sides
                let belowA, belowB;
                //if right is inside the grid - within column limit
                if (withinCols(i+dir)){
                    belowA = grid[i+dir][j+1];
                }
                //if left is inside the grid - within column limit
                if (withinCols(i-dir)){
                    belowB = grid[i-dir][j+1];
                }

                //below cell is blank
                if (below === 0){
                    //the grain moves down
                    nextGrid[i][j+1] = state;
                }
                //if right cell is empty 
                else if(belowA === 0){
                    //grain falls to right
                    nextGrid[i+dir][j+1] = state;
                }
                //if left is empty
                else if(belowB === 0){
                    //grain falls to left
                    nextGrid[i-dir][j+1] = state;
                }
                //
                else{
                    nextGrid[i][j] = state;
                }
            }
        }
    }
    //swap the new 2d array with old 2d array 
    grid = nextGrid;

}
