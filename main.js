import { Grid } from "./components/grid.js";
import { BFS } from "./PathFinding_algorithms/BFS.js";
import { Dijkstra } from "./PathFinding_algorithms/Dijkstra.js";
import { launchAnimations } from "./animations/animations.js";
import { aStar } from "./PathFinding_algorithms/aStar.js";
import { recursiveBackTracking } from "./MazeGeneration_algorithms/recursiveBacktracking.js";
import { launchPlottingMaze } from "./animations/animations.js";
import { eller } from "./MazeGeneration_algorithms/eller.js";
import { kruskal } from "./MazeGeneration_algorithms/Kruskal.js";

export const grid = new Grid(25);
grid.initialize();

//General purpose selectors
const tableGrid = document.getElementById("grid");
const visualizeBtn = document.getElementById('Visualize-btn');
const mazeGenerationBtn = document.getElementById('mazeGeneration-btn');
const clearPathBtn = document.getElementById('clear-path-btn');
const clearGridBtn = document.getElementById('clear-grid-btn');

//path finding filter
let firstTime = true;
const pathFindingFilter = document.getElementById("path-finding-algos");
visualizeBtn.onmousedown = () =>{ 
    grid.clearPath();

    let playAnimation = true;
    const selectedOption = pathFindingFilter.value;

    switch(+selectedOption){
        case 0:
            BFS(grid);
            firstTime = false;
            break;
        case 1:
            Dijkstra(grid);
            firstTime = false;
            break;
        case 2:
            aStar(grid);
            firstTime = false;
            break;
        default:
            playAnimation = false;
            firePopUp("please choose a path-finding algorithm!");
    }

    if (playAnimation) {
        disableUI();
        launchAnimations(grid);
        enableUI_Visualize();
    }
};

//maze filter
const mazeAlgoFilter = document.getElementById("maze-generation-algos");
mazeGenerationBtn.onmousedown = () =>{
    grid.clearGrid();

    let playAnimation = true;
    const selectedOption = mazeAlgoFilter.value;

    switch(+selectedOption){
        case 0:
            recursiveBackTracking(grid);
            break;
        case 1:
            eller(grid);
            break;
        case 2:
            kruskal(grid);
            break;
        default:
            playAnimation = false;
            firePopUp("please choose a maze-generation algorithm!");
    }

    if (playAnimation) {
        disableUI();
        launchPlottingMaze(grid);
        enableUI_Maze();
    }
};

function firePopUp(message){
    const popUpBackground = document.createElement('div');
    popUpBackground.className = 'pop-up-background';
    document.body.appendChild(popUpBackground);

    const popUp = document.createElement('div');
    popUp.className = 'pop-up';
    popUpBackground.appendChild(popUp);

    const msg = document.createElement('h2');
    msg.innerText = message;
    popUp.appendChild(msg);

    const closeBtn = document.createElement('span');
    closeBtn.innerText = 'OK';
    closeBtn.className = 'pop-up-close-button';
    closeBtn.onmousedown = () => {
        document.body.removeChild(popUpBackground);
    }
    popUp.appendChild(closeBtn);
}

//clear path and grid
clearPathBtn.onmousedown = () => {
    firstTime = true;
    grid.clearPath();
}

clearGridBtn.onmousedown = () => {
    firstTime = true;
    grid.clearGrid();
}

//moveing start and target pointer
let startPointer = document.getElementById('start-img');
let targetPointer = document.getElementById('target-img');

let grid_mouseDown = false;
let movingStart = false;
let movingTarget = false;

tableGrid.onmousedown = (event) => {
    const elemClicked = event.target;
    if (!clickableCell(elemClicked)) return;

    const cellNode = grid.getNodeById(elemClicked.id);
    if(cellNode.isStart) {
        movingStart = true;
        moveStartOrTarget(true, event);
    }
    else if(cellNode.isTarget){
        movingTarget = true;
        moveStartOrTarget(false, event);
    }
    else selectGridCell(elemClicked);
    grid_mouseDown = true;
};

tableGrid.onmouseup = (event) => {
    const elemBelow = event.target;
    if(!clickableCell(elemBelow)) return;
    movingStart = false;
    movingTarget = false;
    grid_mouseDown = false;
}

tableGrid.onmouseover = function(event){
    const elemClicked = event.target;

    if(grid_mouseDown && mouseOnGrid()){
        if(movingStart) {
            moveStartOrTarget(true, event);
            setTimeout(realTimeChange(), 0);
        }
        else if(movingTarget) {
            moveStartOrTarget(false, event);
            setTimeout(realTimeChange(), 0);
        }
        else selectGridCell(elemClicked);
    }
};

function selectGridCell(cellClicked){
    if(cellClicked.id === 'grid') return;

    const cellNode = grid.getNodeById(cellClicked.id);

    if(cellNode.isStart || cellNode.isTarget) return;

    if(cellClicked.className !== 'wall'){
        cellClicked.className = 'wall';
        grid.getNodeById(cellClicked.id).status = 'wall';
    }
    else if(!grid_mouseDown){
        cellClicked.className = 'unvisited';
        grid.getNodeById(cellClicked.id).status = 'unvisited';
    }
}

function moveStartOrTarget(start, event){
    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);

    if(!elemBelow) return;
    let elemClassName = elemBelow.className;
    let droppableElem = (elemClassName === 'visited' || 
                        elemClassName === 'unvisited' ||
                        //elemClassName === 'wall' || 
                        elemClassName === 'path' ||
                        elemClassName === 'real-time-visited' ||
                        elemClassName === 'real-time-path');

    if(droppableElem){
        if(start){
            if(grid.getNodeById(elemBelow.id).isTarget) return;
            const elemBelowParent = startPointer.parentNode;
            elemBelowParent.removeChild(startPointer);
            grid.getNodeById(elemBelowParent.id).isStart = false;
            
            elemBelow.appendChild(startPointer);
            grid.getNodeById(elemBelow.id).isStart = true;
            grid.startId = elemBelow.id;
        }else{
            if(grid.getNodeById(elemBelow.id).isStart) return;
            const elemBelowParent = targetPointer.parentNode;
            elemBelowParent.removeChild(targetPointer);
            grid.getNodeById(elemBelowParent.id).isTarget = false;
            
            elemBelow.appendChild(targetPointer);
            grid.getNodeById(elemBelow.id).isTarget = true;
            grid.targetId = elemBelow.id;
        }
    }
}

function mouseOnGrid(){
    return tableGrid.matches(':hover');
}

function clickableCell(elemClicked){
    const elemClassName = elemClicked.className;
    if (elemClassName === 'unvisited'||
        elemClassName === 'visited'|| 
        elemClassName === 'wall'||
        elemClassName === 'path'||
        elemClassName === 'real-time-visited'||
        elemClassName === 'real-time-path') return true;

    return false;
}

function realTimeChange(){
    if(firstTime) return;

    grid.clearPath(); 

    const Algos = {
        BFS: '0',
        Dijkstra: '1',
        AStar: '2',
        BellmanFord: '3',
    };


    const selectedOption = pathFindingFilter.value;
    switch(selectedOption){
        case Algos.BFS:
            BFS(grid);
            break;
        case Algos.Dijkstra:
            Dijkstra(grid);
            break;
        case Algos.AStar:
            aStar(grid);
            break;
        case Algos.BellmanFord:
            bellmanFord(grid);
            break;
    }
    
    for(const nodeId of grid.nodesToAnimate){
        document.getElementById(nodeId).className = 'real-time-visited';
    }

    for(const nodeId of grid.path){
        document.getElementById(nodeId).className = 'real-time-path';
    }
}

function disableUI(){
    visualizeBtn.style.pointerEvents = 'none';
    mazeGenerationBtn.style.pointerEvents = 'none';
    clearPathBtn.style.pointerEvents = 'none';
    clearGridBtn.style.pointerEvents = 'none';
    tableGrid.style.pointerEvents = 'none';
}

function enableUI_Visualize(){
    const check = setInterval(() => {
        if(document.getElementById(grid.targetId).className === 'path'){
            visualizeBtn.style.pointerEvents = 'auto';
            mazeGenerationBtn.style.pointerEvents = 'auto';
            clearPathBtn.style.pointerEvents = 'auto';
            clearGridBtn.style.pointerEvents = 'auto';
            tableGrid.style.pointerEvents = 'auto';
            clearInterval(check);
        }
    }, 500);
}

function enableUI_Maze(){
    const rightBottomCornerId = `${grid.numberOfRows -1}-${grid.numberOfCols -1}`;
    const rightBottomCornerCell = document.getElementById(rightBottomCornerId);
    const check = setInterval(() => {
        if(rightBottomCornerCell.className === 'wall'){
            visualizeBtn.style.pointerEvents = 'auto';
            mazeGenerationBtn.style.pointerEvents = 'auto';
            clearPathBtn.style.pointerEvents = 'auto';
            clearGridBtn.style.pointerEvents = 'auto';
            tableGrid.style.pointerEvents = 'auto';
            clearInterval(check);
        }
    }, 500);
}