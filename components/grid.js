//imports
import {Node} from "./node.js";
import {grid} from "../main.js";
//exports
export {Grid};

//Selectors
const container = document.getElementById("container");
const tableGrid = document.getElementById("grid");

//Grid Object
function Grid(cellSize){
    this.cellSize = cellSize;
    this.numberOfRows = _calculateRows(this.cellSize);
    this.numberOfCols = _calculateCols(this.cellSize);
    this.gridArray = [];  
    this.numberOfNodes = this.numberOfRows * this.numberOfCols;
    this.nodesToAnimate = [];
    this.path = [];
    this.startId = '10-10';
    this.targetId = '10-30';
}


Grid.prototype.initialize = function(){
    this.createGrid();
    this.processGrid();
}

Grid.prototype.clearGrid = function(){
    this.path.length = 0;
    this.nodesToAnimate.length = 0;
    let gridNode = null;
    for(let row = 0; row < this.numberOfRows; row++){
        for(let col = 0; col < this.numberOfCols; col++){
            gridNode = grid.gridArray[row][col];
            gridNode.status = 'unvisited';
            document.getElementById(gridNode.id).className = 'unvisited';
            gridNode.parent = null;
            gridNode.distance = Infinity;
            gridNode.data = null;
        }
    }
    grid.getNodeById(grid.startId).status = 'start';
    grid.getNodeById(grid.targetId).status = 'target';
}

Grid.prototype.clearPath = function(){
    this.path.length = 0;
    this.nodesToAnimate.length = 0;
    let gridNode = null;
    for(let row = 0; row < this.numberOfRows; row++){
        for(let col = 0; col < this.numberOfCols; col++){
            gridNode = grid.gridArray[row][col];
            gridNode.parent = null;
            gridNode.distance = Infinity;
            gridNode.data = null;
            if(gridNode.status === 'wall') continue;
            gridNode.status = 'unvisited';
            document.getElementById(gridNode.id).className = 'unvisited';
        }
    }
    grid.getNodeById(grid.startId).status = 'start';
    grid.getNodeById(grid.targetId).status = 'target';
}

Grid.prototype.createGrid = function(){
    let cellNode = null;
    for (let r = 0; r < this.numberOfRows; r++) {
        const row = document.createElement('tr');
        const girdArrayRow = [];
        for (let c = 0; c < this.numberOfCols; c++) {
            const cell = document.createElement('td');
            cell.style.height = this.cellSize + 'px';
            cell.style.width = this.cellSize + 'px';
            cell.className = 'unvisited';
            cell.id = `${r}-${c}`;
            row.appendChild(cell);

            cellNode = new Node(cell.id);
            girdArrayRow.push(cellNode);
        }
        tableGrid.appendChild(row);

        this.gridArray.push(girdArrayRow);
    }
}

//find neighnours for each node in the grid array
//set the initial positions for s and e nodes
Grid.prototype.processGrid = function(){
    let cellNode = null;
    let initialRow = Math.trunc(this.numberOfRows * 0.5);
    if(initialRow % 2 === 0) initialRow--;
    let initialStartCol = Math.trunc(this.numberOfCols * 0.25);
    if(initialStartCol % 2 === 0) initialStartCol--;
    let initialTargetCol = Math.trunc(this.numberOfCols * 0.75);
    if(initialTargetCol % 2 === 0) initialTargetCol--;
    
    for (let row = 0; row < this.numberOfRows; row++) {
        for (let col = 0; col < this.numberOfCols; col++) {
            cellNode = this.gridArray[row][col];
            cellNode.findNeighbours(this, row, col);
            //------------------------------------
            if(row === initialRow && col === initialStartCol){
                this.startId = cellNode.id;
                cellNode.isStart = true;

                let start = document.createElement("img");
                start.src = "./assets/arrow.png";
                start.style.height = '15px';
                start.style.width = '15px';
                start.id = 'start-img';
                start.style.pointerEvents = 'none';
                document.getElementById(cellNode.id).appendChild(start);
            }
            else if(row === initialRow && col === initialTargetCol){
                this.targetId = cellNode.id;
                cellNode.isTarget = true;

                let target = document.createElement("img");
                target.src = "./assets/target.png";
                target.style.height = '15px';
                target.style.width = '15px';
                target.id = 'target-img';
                target.style.pointerEvents = 'none';
                document.getElementById(cellNode.id).appendChild(target);   
            }
        }
    }
}

Grid.prototype.getNodeById = function(id){
    const coordinates = id.split('-');
    const row = coordinates[0];
    const col = coordinates[1];
    return this.gridArray[row][col];
}

Grid.prototype.exists = function(){
    if(document.getElementById('0-0')) return true;
    return false;
}

//Helper fucntions
function _calculateRows(cellHeight){
    const containerHeight = container.clientHeight;
    let numberOfRows = Math.trunc(containerHeight / cellHeight);
    if(numberOfRows % 2 === 0) numberOfRows--; //to obtain odd number of rows
    return numberOfRows;
}

function _calculateCols(cellWidth){
    const containerWidth = container.clientWidth;
    let numberOfCols = Math.trunc(containerWidth / cellWidth);
    if(numberOfCols % 2 === 0) numberOfCols--; //to obtain odd number of cols
    return numberOfCols;
}


