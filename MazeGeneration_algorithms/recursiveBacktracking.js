import {Stack} from "../Data_Structures/Stack.js";

const stack = new Stack();
const neighboursDirections = ['up', 'right', 'down', 'left'];
const outerMazeWall = 'outer-maze-wall';
const visitedMazeCell = 'maze-visited';

export function recursiveBackTracking(grid){
    stack.clear();

    for(let col = 0; col < grid.numberOfCols; col++){
        grid.gridArray[0][col].status = outerMazeWall;
        grid.gridArray[grid.numberOfRows-1][col].status = outerMazeWall; 
    }
    for(let row = 0; row < grid.numberOfRows; row++){
        grid.gridArray[row][0].status = outerMazeWall;
        grid.gridArray[row][grid.numberOfCols-1].status = outerMazeWall;
    }

    const row = getRandomInt(1, grid.numberOfRows -1);
    const col = getRandomInt(1, grid.numberOfCols -1);

    const startingNodeId = `${row}-${col}`;
    const startingNode = grid.getNodeById(startingNodeId);
    startingNode.status = visitedMazeCell;
    stack.push(startingNode);

    createMaze();
}

function createMaze(){
    let gridNode = null;
    let deadEnd = false;

    while(!stack.isEmpty()){
        shuffle(neighboursDirections);
        deadEnd = true;
        gridNode = stack.peek();

        for(const direction of neighboursDirections){
            const firstNeighbour = gridNode[direction];
            if(firstNeighbour.status === outerMazeWall) continue;

            const secondNeighbour = firstNeighbour[direction];
            if(secondNeighbour.status === visitedMazeCell) continue;

            firstNeighbour.status = visitedMazeCell;
            secondNeighbour.status = visitedMazeCell;
            stack.push(secondNeighbour);
            deadEnd = false;
            break;
        }

        if(deadEnd) stack.pop();
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getRandomInt(min, max) {
    let randomInt = Math.floor((Math.random() * (max - min) + min));
    if(randomInt % 2 === 0) randomInt++;
    return randomInt;
}
