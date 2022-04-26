import {Queue} from "./queue.js";
import {BiDirectionalMap} from "./biDirectionalMap.js";
import {MinIndexedDHeap} from "./minD-aryHeap.js";

export function IndexedPQ(heapDegree = 2){
    this.heap = new MinIndexedDHeap(heapDegree);
    this.keyCount = 0;
    this.keyQueue = new Queue();
    this.id_keyMap = new BiDirectionalMap();
}

IndexedPQ.prototype.isEmpty = function(){
    return this.heap.isEmpty();
}

IndexedPQ.prototype.clear = function(){
    this.keyCount = 0;
    this.heap.clear();
    this.id_keyMap.clear();
    this.keyQueue.clear();
}

IndexedPQ.prototype.contiansId = function(id){
    return this.heap.contiansKey(this._keyOf(id));
}

IndexedPQ.prototype.peekMinNodeId = function(){
    const key = this.heap.peekMinNodeKey();
    return this._idOf(key);
}

IndexedPQ.prototype.pollMinNodeId = function(){
    const id = this.peekMinNodeId();
    this.remove(id);   
    return id; 
}

IndexedPQ.prototype.peekMinValue = function(){
    return this.heap.peekMinValue();
}

IndexedPQ.prototype.pollMinValue = function(){
    const minValue =  this.peekMinValue();
    this.pollMinNodeId();
    return minValue;
}

IndexedPQ.prototype.insert = function(id, value){
    let key = this.keyCount;
    if(!this.keyQueue.isEmpty()){
        key = this.keyQueue.dequeue();
    }
    else{
        this.keyCount ++;
    }
    this.heap.insert(key, value);
    this.id_keyMap.set(id, key);
}

IndexedPQ.prototype.remove = function(id){
    const key = this._keyOf(id);
    this.heap.remove(key);
    this.id_keyMap.remove(id);
    this.keyQueue.enqueue(key);
}

IndexedPQ.prototype.update = function(id, value){
    this.heap.update(this._keyOf(id), value);
}

IndexedPQ.prototype.increase = function(id, value){
    this.heap.increase(this._keyOf(id), value);
}

IndexedPQ.prototype.decrease = function(id, value){
    this.heap.decrease(this._keyOf(id), value);
}

IndexedPQ.prototype._keyOf = function(id){
    return this.id_keyMap.getBykey(id);
}

IndexedPQ.prototype._idOf = function(key){
    return this.id_keyMap.getByValue(key);
}