import {IndexedPQ} from "../Data_Structures/indexedPQ.js";
import {_constructPath} from "./GeneralFunctions.js";


let indexedPQ = null;
let targetX = 0;
let targetY = 0;
const neighboursDirections = ['up', 'right', 'down', 'left'];

export function aStar(grid){
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

    const targetCoordinates = grid.targetId.split('-'); //row - col
    targetY = -1 *  targetCoordinates[0];
    targetX = +targetCoordinates[1];
}

function _solve(grid){
    indexedPQ.insert(grid.startId, 0); // nodeId, F
    grid.getNodeById(grid.startId).distance = 0; //diistance = G
    
    while(!indexedPQ.isEmpty()){
        const promisingNodeId = indexedPQ.peekMinNodeId();
        indexedPQ.pollMinValue();
        const promisingNode = grid.getNodeById(promisingNodeId);
        
        promisingNode.status = 'visited';
        grid.nodesToAnimate.push(promisingNodeId);
        
        if(promisingNode.isTarget) return;
        
        const newDistance = promisingNode.distance + 1; //newDist = newG
        for(const direction of neighboursDirections){
            const neighbour = promisingNode[direction];
            if(neighbour === null) continue;
            if(neighbour.status === 'visited') continue;
            if(neighbour.status === 'wall') continue;

            if(newDistance < neighbour.distance){
                neighbour.distance = newDistance;
                neighbour.parent = promisingNode;
                if(!indexedPQ.contiansId(neighbour.id)){
                    indexedPQ.insert(neighbour.id, _F(grid, neighbour.id));
                }
                else{
                    indexedPQ.decrease(neighbour.id, _F(grid, neighbour.id));
                }
            }
        }
    }
    return Infinity;
}

function _H(nodeId){
    //the absolute distance between the end node and the current node
    const NodeCoordinates = nodeId.split('-'); //row - col
    const NodeY = -1 *  NodeCoordinates[0];
    const NodeX = +NodeCoordinates[1];

    const ManhattenDist = Math.abs(NodeY - targetY)+
                          Math.abs(NodeX - targetX);
    return ManhattenDist;
}

function _G(grid, nodeId){
    return grid.getNodeById(nodeId).distance;
}

function _F(grid, nodeId){
    return _G(grid, nodeId) + _H(nodeId);
}

