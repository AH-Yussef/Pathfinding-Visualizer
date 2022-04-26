export function _constructPath(grid){
    let currentNode = grid.getNodeById(grid.targetId);

    while(currentNode !== null){
        grid.path.push(currentNode.id);
        currentNode = currentNode.parent;
    }
    grid.path.reverse();
    if(grid.path[0] === grid.startId) return true;
    return false;
}