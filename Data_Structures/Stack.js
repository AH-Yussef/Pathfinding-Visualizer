export function Stack(){
    this.stack = [];
}

Stack.prototype.peek = function(){
    return this.stack[this.stack.length -1];
}

Stack.prototype.push = function(item){
    this.stack.push(item);
}

Stack.prototype.pop = function(){
    return this.stack.pop();
}

Stack.prototype.isEmpty = function(){
    return this.stack.length === 0;
}

Stack.prototype.size = function(){
    return this.stack.length;
}

Stack.prototype.clear = function(){
    this.stack.length = 0;
}