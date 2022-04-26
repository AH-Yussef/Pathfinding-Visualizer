export function MinIndexedDHeap(D = 2){
    //number of childern each node has in the heap
    this.degree = D;
    //number of nodes in the heap
    this.size = 0;
    //values array indexed by the keys (values[key])
    this.values = [];
    //an array to get the node index in the heap by the key(key -> nodeIndex)
    this.key_nodePos = [];
    //an array to get the key associated with a particular node(nodeIndex -> key)
    this.node_keyPos = [];
}

MinIndexedDHeap.prototype.isEmpty = function(){
    return this.size === 0;
}

MinIndexedDHeap.prototype.clear = function(){
    this.size = 0;
    this.values.length = 0;
    this.key_nodePos.length = 0;
    this.node_keyPos.length = 0;
}

MinIndexedDHeap.prototype.contiansKey = function(key){
    this._isKeyInBounds(key);
    return this.key_nodePos[key] !== undefined;
}

MinIndexedDHeap.prototype.peekMinNodeKey = function(){
    if(this.isEmpty()){
        console.log('heap is empty');
        return;
    }
    return this.node_keyPos[0];
}

MinIndexedDHeap.prototype.pollMinNodeKey = function(){
    const key = this.peekMinNodeKey();
    this.remove(key);
    return key;
}

MinIndexedDHeap.prototype.peekMinValue = function(){
    if(this.isEmpty()){
        console.log('heap is empty');
        return;
    }
    return this.values[this.node_keyPos[0]];
}

MinIndexedDHeap.prototype.pollMinValue = function(){
    const minValue = this.peekMinValue();
    this.remove(this.peekMinNodeKey);
    return minValue;
}


//Note: handle throwing an exception
MinIndexedDHeap.prototype.insert = function(key, value){
    if(this.contiansKey(key)){
        console.log(`key(${key}) already exists!`);
        return;
    }
    if(value === null){
        console.log('null values are not allowed');
        return;
    }
    this.values[key] = value;
    this.key_nodePos[key] = this.size; 
    this.node_keyPos[this.size] = key; //nodeIndex = size of the heap;
    this._swim(this.size);
    this.size ++;
}


//Note: handle throwing an exception
MinIndexedDHeap.prototype.remove = function(key){
    if(!this.contiansKey(key)){
        console.log(`key(${key}) does not exist!`);
        return;
    }
    const nodeIndex = this.key_nodePos[key];
    this.size --;
    this._swap(nodeIndex, this.size);
    this._sink(nodeIndex);
    this._swim(nodeIndex);
    const value = this.values[key];
    this.values[key] = null;
    this.key_nodePos[key] = undefined;
    this.node_keyPos[this.size] = undefined;
    return value;
}


//Note: handle throwing an exception
MinIndexedDHeap.prototype.update = function(key, value){
    if(!this.contiansKey(key)){
        console.log(`key(${key}) does not exist!`);
        return;
    }
    if(value === null){
        console.log('null values are not allowed');
        return;
    }
    const oldValue = this.values[key];
    const nodeIndex = this.node_keyPos[key];
    this.values[key] = value;
    this._swim(nodeIndex);
    this._sink(nodeIndex);
    return oldValue;
}

//Note: handle throwing an exception
MinIndexedDHeap.prototype.increase = function(key, value){
    if(!this.contiansKey(key)){
        console.log(`key(${key}) does not exist!`);
        return;
    }
    if(value === null){
        console.log('null values are not allowed');
        return;
    }
    if(value > this.values[key]){
        this.values[key] = value;
        this._sink(this.node_keyPos[key]);
    }
}

//Note: handle throwing an exception
MinIndexedDHeap.prototype.decrease = function(key, value){
    if(!this.contiansKey(key)){
        console.log(`key(${key}) does not exist!`);
        return;
    }
    if(value === null){
        console.log('null values are not allowed');
        return;
    }
    if(value < this.values[key]){
        this.values[key] = value;
        this._swim(this.node_keyPos[key]);
    }
}

MinIndexedDHeap.prototype._swim = function(nodeIndex){
    while(this._isChildLessThanParent(nodeIndex, this._parentOf(nodeIndex))){
        const parentIndex = this._parentOf(nodeIndex);
        this._swap(nodeIndex, parentIndex);
        nodeIndex = parentIndex;
    }
}

MinIndexedDHeap.prototype._sink = function(parentIndex){
    let childIndex = this._minChildOf(parentIndex);
    while(childIndex != -1){
        this._swap(childIndex, parentIndex);
        parentIndex = childIndex;
        childIndex = this._minChildOf(parentIndex);
    }
}

MinIndexedDHeap.prototype._swap = function(nodeAIndex, nodeBIndex){
    //keys swap
    this.key_nodePos[this.node_keyPos[nodeAIndex]] = nodeBIndex;
    this.key_nodePos[this.node_keyPos[nodeBIndex]] = nodeAIndex;

    //nodes swap
    const temp = this.node_keyPos[nodeAIndex];
    this.node_keyPos[nodeAIndex] = this.node_keyPos[nodeBIndex];
    this.node_keyPos[nodeBIndex] = temp;
}

MinIndexedDHeap.prototype._isKeyInBounds = function(key){
    if(key < 0 || key >= this.values.length) return false;
    return true;
}

MinIndexedDHeap.prototype._parentOf = function(childIndex){
    return Math.trunc((childIndex - 1) / this.degree);
}

MinIndexedDHeap.prototype._leftChildOf = function(parentIndex){
    return Math.trunc((this.degree * parentIndex) + 1);
}

MinIndexedDHeap.prototype._lastChildOf = function(parentIndex){
    const leftChild = this._leftChildOf(parentIndex);
    return Math.min(this.size, leftChild + this.degree);
}

MinIndexedDHeap.prototype._lastChildFrom = function(leftChild){
    return Math.min(this.size, leftChild + this.degree);
}

MinIndexedDHeap.prototype._valueOf = function(nodeIndex){
    return this.values[this.node_keyPos[nodeIndex]];
}

MinIndexedDHeap.prototype._isChildLessThanParent = function(childIndex, parentIndex){
    const childValue = this._valueOf(childIndex);
    const parentValue = this._valueOf(parentIndex);
    return childValue < parentValue; 
}

MinIndexedDHeap.prototype._minChildOf = function(parentIndex){
    let index = -1;
    const from = this._leftChildOf(parentIndex);
    const to = this._lastChildFrom(from);
    for(let childIndex = from; childIndex < to; childIndex++){
        if(this._isChildLessThanParent(childIndex, parentIndex)){
            index = childIndex;
            parentIndex = childIndex;
        }
    }
    return index;
} 