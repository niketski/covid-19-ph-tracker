export default class Cache {
    
    constructor() {
        this.storage     = window.localStorage;
        this.storageName = 'covid'; 
        this.enabled     = false;
    }

    add(name, value) {
    
        if(this._isItemExist(name)) {
            return 'Please provide another cache name';
        } 

        const storageArray = JSON.parse(this.storage.getItem(this.storageName));
        const item         = new CacheItem(name, value);

        storageArray.push(item);
    
        this.storage.setItem(this.storageName, JSON.stringify(storageArray));
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
        const storageArray = JSON.parse(this.storage.getItem(this.storageName));
        const names   = storageArray.filter((item) => {
            return item.name == name;
        });
        
        return names.length >= 1 ? true : false;
    }

    init () {
        if(!this.storage.getItem(this.storageName)) {
            this.storage.setItem(this.storageName, '[]');
        }

        this.enabled = true;
    }
}

class CacheItem {
    constructor(name, value) {
        this.name  = name;
        this.value = value;
        this.dateCached = new Date();
    }
}