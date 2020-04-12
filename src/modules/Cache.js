export default class Cache {
    
    constructor() {
        this.storage = window.localStorage;
    }

    add(name, value) {
    
        if(this._isItemExist(name)) {
            return 'Please provide another cache name';
        } 

        const storageArray = JSON.parse(this.storage.getItem(name));
        const item         = new CacheItem(value);

        this.storage.setItem(name, JSON.stringify(item));
        
        // storageArray.push(item);
    
        // this.storage.setItem(this.storageName, JSON.stringify(storageArray));
    }

    get(name) {
        return this.storage.getItem(name);
    }

    isCached(name) {
        
    }

    // functions with prefix '_' considered as private since private function is not supported
    _isInitialized() {
        return this.storage.getItem(this.storageName) != null ? true : false;
    }

    _isItemExist(name) {
        return this.storage.getItem(name) != null ? this.storage.getItem(name) : false;
    }

    init () {
        if(!this.storage.getItem(this.storageName)) {
            this.storage.setItem(this.storageName, '[]');
        }

        this.enabled = true;
    }
}

class CacheItem {
    constructor(value) {
        this.value = value;
        this.dateCached = new Date();
    }
}