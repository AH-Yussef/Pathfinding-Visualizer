const setIndex_cellsNum = new Map();

export function eller(grid){
    let setCount = 0;
    const visitedMazeCell = 'maze-visited';
    setIndex_cellsNum.clear();

    for(let row = 1; row < grid.numberOfRows; row += 2){
        //step1: give the cells that doesnot belong to any set a set index
        for(let col = 1; col < grid.numberOfCols; col +=2){
            const gridCell = grid.gridArray[row][col];
            gridCell.status = visitedMazeCell;
            //gridCell.data refers to setIndex
            if(gridCell.data === null) gridCell.data = setCount++;
        }
        
        //step2: add the setIndex, nodesNumber of that set to the map
        for(let col = 1; col < grid.numberOfCols; col +=2){
            const gridCell = grid.gridArray[row][col];
            const setIndex = gridCell.data;
            increase(setIndex);
        }

        //step3: adding the right walls
        if(row !== grid.numberOfRows-2){
            for(let col = 1; col < grid.numberOfCols -2; col +=2){
                const gridCell = grid.gridArray[row][col];
                const rightCell = grid.gridArray[row][col +2];
                if(gridCell.data === rightCell.data) continue;

                const removeWall = Math.random() >= 0.5;
                if(removeWall) {
                    gridCell.right.status = visitedMazeCell;
                    decrease(rightCell.data);
                    rightCell.data = gridCell.data;
                    increase(gridCell.data);
                }
            }
        }else{
            for(let col = 1; col < grid.numberOfCols -2; col +=2){
                const gridCell = grid.gridArray[row][col];
                const rightCell = grid.gridArray[row][col +2];
                if(gridCell.data === rightCell.data) continue;

                gridCell.right.status = visitedMazeCell;
                gridCell.data = rightCell.data;
            }
        }

        //step4: adding the bottom walls
        if(row !== grid.numberOfRows-2){
            for(let col = 1; col < grid.numberOfCols; col +=2){
                const gridCell = grid.gridArray[row][col];
                const setIndex = gridCell.data;
                const availablePaths = setIndex_cellsNum.get(setIndex);
                if(availablePaths === 1){
                    gridCell.down.status = visitedMazeCell;
                    gridCell.down.down.data = gridCell.data;
                    continue;
                }

                const keepWall = Math.random() >= 0.5;
                if(keepWall) decrease(setIndex);
                else {
                    gridCell.down.status = visitedMazeCell;
                    gridCell.down.down.data = gridCell.data;
                }
            }
        }

        //reset
        setIndex_cellsNum.clear();
    }
}

//helper Function
function increase(key){
    if(!setIndex_cellsNum.has(key)){
        setIndex_cellsNum.set(key, 1);
        return;
    }
    let oldValue = setIndex_cellsNum.get(key);
    setIndex_cellsNum.set(key, oldValue + 1);
}

function decrease(key){
    let oldValue = setIndex_cellsNum.get(key);
    setIndex_cellsNum.set(key, oldValue - 1);
}

