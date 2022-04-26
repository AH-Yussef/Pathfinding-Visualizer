export function BiDirectionalMap(){
    this.key_valueMap = new Map(); //id_key
    this.value_keyMap = new Map(); //key_id
}

BiDirectionalMap.prototype.set = function(key, value){
    this.key_valueMap.set(key, value);
    this.value_keyMap.set(value, key);
}

BiDirectionalMap.prototype.getBykey = function(key){
    return this.key_valueMap.get(key);
}

BiDirectionalMap.prototype.getByValue = function(value){
    return this.value_keyMap.get(value);
}

BiDirectionalMap.prototype.remove = function(key){
    const value = this.getBykey(key);
    this.key_valueMap.delete(key);
    this.value_keyMap.delete(value);
}

BiDirectionalMap.prototype.size = function(){
    return this.key_valueMap.size();
}

BiDirectionalMap.prototype.clear = function(){
    this.key_valueMap.clear();
    this.value_keyMap.clear();
}

