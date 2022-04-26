export function Queue(){
    this.queue = [];
}

Queue.prototype.enqueue = function(element){
    this.queue.push(element);
}

Queue.prototype.dequeue = function(){
    return this.queue.shift();
}

Queue.prototype.isEmpty = function(){
    return (this.queue.length === 0);
}

Queue.prototype.size = function(){
    return this.queue.length;
}

Queue.prototype.clear = function(){
    this.queue.length = 0;
}
