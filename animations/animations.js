//selectors
const mazeAlgoFilter = document.getElementById("maze-generation-algos");

let i = 0;
let row = 0;
let col = 0;

export function launchAnimations(grid){
    i = 0;
    animateVisitedNodes(grid);
}

export function launchPlottingMaze(grid){ 
    row = 0;
    col = 0;
    plotMazeByPath(grid);
}

function animateVisitedNodes(grid){
    setTimeout(function() { 
        const nodeId = grid.nodesToAnimate[i];
        _reset_animation(nodeId);
        document.getElementById(nodeId).className = 'visited';
        i++;           
        if (i < grid.nodesToAnimate.length) {          
            animateVisitedNodes(grid);        
        }
        else{
            i = 0;             
            animatePath(grid);
        }        
    }, 5 * _speedFactor())
}

function animatePath(grid){ 
    setTimeout(function() { 
        const nodeId = grid.path[i];
        document.getElementById(nodeId).className = 'path';
        i++;                   
        if (i < grid.path.length) {          
            animatePath(grid);        
        }                       
    }, 10 * _speedFactor())
}

function plotMazeByPath(grid){
    setTimeout(function() { 
        const nodeId = `${row}-${col}`;
        const currentNode = grid.getNodeById(nodeId);
        if (!currentNode.isStart && 
            !currentNode.isTarget &&
            currentNode.status !== 'maze-visited'){
            document.getElementById(nodeId).className = 'wall';
            currentNode.status = 'wall';
        }
        col++;
        if(col === grid.numberOfCols){
            col = 0;
            row ++;
        }           
        if (row < grid.numberOfRows) {          
            plotMazeByPath(grid);       
        }  
    }, 0)
}

function _reset_animation(nodeId) {
    let node = document.getElementById(nodeId);
    node.style.animation = 'none';
    node.offsetHeight; /* trigger reflow */
    node.style.animation = null;
}

function _speedFactor(){
    //fast -> 1, average -> 20, slow -> 100
    const speedFactor = document.getElementById("speed-control").value;
    return speedFactor;
}