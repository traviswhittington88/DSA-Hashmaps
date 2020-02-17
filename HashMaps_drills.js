class HashMap {  // remember this class is very similar to a regular object with additional prototypes in constructor method
  constructor(initialCapacity=8) {  // a minimum of 8 slots in the table
    this.length = 0;
    this._hashTable = []; // the hash table which is an array.. nothing scary!!
    this._capacity = initialCapacity;
    this._deleted = 0;
  }

  get(key) {
    const index = this._findSlot(key);
    if (this._hashTable[index] === undefined) {
      throw new Error('Key error');
    }
    return this._hashTable[index].value;
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;  //checks load ratio is greater than given max
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {                              // if so it resizes the hash MAP...
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }
    //Find the slot where this key should be in (open addressing)
    const index = this._findSlot(key); //helper function.. index is the slot

    if (!this._hashTable[index]) {  //if index does not exist..
      this.length++;
    }
    
    this._hashTable[index] = {
      key,
      value,
      DELETED: false,
    };
  }

  delete(key) {  // finds correct 'slot' for the key and set the DELETED flag to true, decreasing the length and increasing
    const index = this._findSlot(key); // the delete count
    const slot = this._hashTable[index];
    if (slot === undefined) {
      throw new Error('Key error');
    }
    slot.DELETED = true;
    this.length--;
    this._deleted++;  
    // Most important thing(s) to note here are the addition of a _deleted count, 
    // a deleted property (DELETED), and the delete method itself
  }

  _findSlot(key) {  // finds correct slot (index) for a given key
    const hash = HashMap._hashString(key);   // calculates the hash of the key
    const start = hash % this._capacity; // uses modulus to find a slot for the key based on capacity, e.g. 1 % 6 = 1... 

    for (let i = start; i < start + this._capacity; i++) {  
      const index = i % this._capacity;
      const slot = this._hashTable[index];  // loops through the array stopping when it finds the slot with a matching key or an empty slot
      if (slot === undefined || (slot.key && !slot.DELETED)) {
        return index;
      }                 
    }
    // The _hashTable array will never be full due to our maximum load (9/10 or 90%) factor.. so the function will always return a slot
    // be it empty or matching an existing key.. 
    // Best and avg case performance for the function is O(1); assuming the hash function is good (creates a correct hash) 
    // and the load ratio is suitable (meaning it doesn't let the hash table fill up)... worst case is O(n) and you have
    // to search each slot
  }

  // resizing the hash map
  _resize(size) {
    const oldSlots = this._hashTable;  // moves array into var called oldSlots
    this._capacity = size;  // changes capacity to the size you pass it.. 
    // Reset the length - it will get rebuild as you add the items back.
    this.length = 0; // reset the length.
    this._deleted = 0;
    this._hashTable = [];  // create new empty hash table

    for (const slot of oldSlots) {  // i < oldSlots.length; i++
      if (slot !== undefined && !slot.DELETED) {  // if index/slot is not empty in oldSlots
        this.set(slot.key, slot.value); // add old slot to new array.
      }
    } //because you have to call set() 1 time for each item in oldSlots and each set() call is O(1) in the 
      // best and avg case, and O(n) in the worst case, this is O(n) in the best and avg case and O(n^2) in the worst case
  }

  static _hashString(string) {   // the hashing function
    let hash = 5381;   // ? not sure what 5381 represents
    for (let i = 0; i < string.length; i++) {
      hash = (hash << 5) + hash + string.charCodeAt(i);
      hash = hash & hash;
    }
    return hash >>> 0;
  }
}