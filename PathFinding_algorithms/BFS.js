//imports
import {Queue} from "../Data_Structures/queue.js";
import {_constructPath} from "./GeneralFunctions.js";

//Global variables
const nodesIds = new Queue();
const neighboursDirections = ['up', 'right', 'down', 'left'];
//Functions
export function BFS(grid){
    _initailize(grid);
    _solve(grid);
    _constructPath(grid);
}

function _initailize(grid){
    nodesIds.clear();
    grid.nodesToAnimate.length = 0;
    grid.path.length = 0;
}

function _solve(grid){
    let nodeId = null;
    let node = null;
    nodesIds.enqueue(grid.startId);
    grid.nodesToAnimate.push(grid.startId);
    grid.getNodeById(grid.startId).status = 'visited';
    while(!nodesIds.isEmpty()){
        nodeId = nodesIds.dequeue();
        node = grid.getNodeById(nodeId);
        if(node.isTarget) break;
        exploreNeighbours(grid, node);
    }
}

function exploreNeighbours(grid, node){
    for(const direction of neighboursDirections){
        const neighbour = node[direction];
        if(neighbour === null) continue;
        if(neighbour.status === 'visited') continue;
        if(neighbour.status === 'wall') continue;
        
        nodesIds.enqueue(neighbour.id);
        grid.nodesToAnimate.push(neighbour.id);
        neighbour.parent = node;
        neighbour.status = 'visited';
    }
}
