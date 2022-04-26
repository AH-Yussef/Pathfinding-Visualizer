let setCount = 0;
const edges = [];
const RIGHT = 'right';
const DOWN = 'down';
const visitedMazeCell = 'maze-visited';
const rowDr = {right : 0, down : 2};
const colDr = {right : 2, down : 0};


export function kruskal(grid){
    getEdges(grid);
    setupSetsAndGrid(grid);
    solve(grid);
}

function getEdges(grid){
    edges.length = 0; //reset

    for(let row = 1; row < grid.numberOfRows; row +=2){
        for(let col = 1; col < grid.numberOfCols; col += 2){
            if(col < grid.numberOfCols -2) edges.push(new Edge(row, col, RIGHT));
            if(row < grid.numberOfRows -2) edges.push(new Edge(row, col, DOWN));
        }
    }
}

function setupSetsAndGrid(grid){
    setCount = 0; //reset
    for(let row = 1; row < grid.numberOfRows; row +=2){
        for(let col = 1; col < grid.numberOfCols; col += 2){
            grid.gridArray[row][col].data = setCount++;
            grid.gridArray[row][col].status = visitedMazeCell;
        }
    }
}

function solve(grid){
    shuffle(edges);
    let currentEdge = null;
    let fromNode = null;
    let toNode = null;

    while(edges.length > 0){
        currentEdge = edges.pop();
        const row = currentEdge.fromRow;
        const col = currentEdge.fromCol;
        const direction = currentEdge.direction;
        fromNode = grid.gridArray[row][col];
        toNode = grid.gridArray[row + rowDr[direction]][col + colDr[direction]];

        if(!connected(fromNode, toNode)){ //connect
            const tempId = toNode.data;
            for(let row = 1; row < grid.numberOfRows; row +=2){
                for(let col = 1; col < grid.numberOfCols; col += 2){
                    const gridNode = grid.gridArray[row][col];
                    if(gridNode.data === tempId){
                        gridNode.data = fromNode.data;
                    }
                }
            }

            if(direction === RIGHT) fromNode.right.status = visitedMazeCell;
            else fromNode.down.status = visitedMazeCell;
        }
    }
}

//helper functions
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function connected(fromNode, toNode){
    const fromSetId = fromNode.data;
    const toSetId = toNode.data;
    return (fromSetId === toSetId);
}


function Edge(fromRow, fromCol, direction){
    this.fromRow = fromRow;
    this.fromCol = fromCol;
    this.direction = direction;
}

function Set(){
    this.id = setCount++;
}