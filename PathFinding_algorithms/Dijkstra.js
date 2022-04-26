import {IndexedPQ} from "../Data_Structures/indexedPQ.js";
import {_constructPath} from "./GeneralFunctions.js";

let indexedPQ = null;
const neighboursDirections = ['up', 'right', 'down', 'left'];

export function Dijkstra(grid){
    _initailize(grid);
    _solve(grid);
    _constructPath(grid);
}

function _initailize(grid){
    const rows = grid.numberOfRows;
    const cols = grid.numberOfCols;
    const edgesNumber = (2*rows*cols) - rows - cols;
    const degree = edgesNumber / grid.numberOfNodes;
    indexedPQ = new IndexedPQ(degree);
}

function _solve(grid){
    indexedPQ.insert(grid.startId, 0);
    grid.getNodeById(grid.startId).distance = 0;
    
    while(!indexedPQ.isEmpty()){
        const promisingNodeId = indexedPQ.peekMinNodeId();
        indexedPQ.pollMinValue();
        const promisingNode = grid.getNodeById(promisingNodeId);
        
        promisingNode.status = 'visited';
        grid.nodesToAnimate.push(promisingNodeId);
        
        if(promisingNode.isTarget) return;
        
        const newDistance = promisingNode.distance + 1; //1 : default weight
        for(const direction of neighboursDirections){
            const neighbour = promisingNode[direction];
            if(neighbour === null) continue;
            if(neighbour.status === 'visited') continue;
            if(neighbour.status === 'wall') continue;

            if(newDistance < neighbour.distance){
                neighbour.distance = newDistance;
                neighbour.parent = promisingNode;
                if(!indexedPQ.contiansId(neighbour.id)){
                    indexedPQ.insert(neighbour.id, newDistance);
                }
                else{
                    indexedPQ.decrease(neighbour.id, newDistance);
                }
            }
        }
    }
    return Infinity;
}

