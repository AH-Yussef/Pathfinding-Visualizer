export function Node(id){
    this.id = id;
    this.isStart = false;
    this.isTarget = false;
    this.status = 'unvisited';
    this.parent = null;
    this.up = null;
    this.down = null;
    this.left = null;
    this.right = null;
    this.distance = Infinity;
    this.data = null; //in case any additonal info needed
}

Node.prototype.findNeighbours = function(grid, row, col){
    if(!grid.exists()) return;
    const neighboursDirections = ['up', 'right', 'down', 'left'];
    const rowDirections = [-1, 0,+1, 0];
    const colDirections = [ 0,+1, 0,-1];
    for(let i = 0; i < 4; i++){
        const direction = neighboursDirections[i];
        const adjRow = row + rowDirections[i];
        const adjCol = col + colDirections[i];
        if(adjRow < 0 || adjCol < 0) continue;
        if(adjRow >= grid.numberOfRows || adjCol >= grid.numberOfCols) continue;
        this[direction] = grid.gridArray[adjRow][adjCol];
    }
}