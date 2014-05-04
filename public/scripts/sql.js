define(["jquery"],function($){

  const DB_NAME = 'qoodrData';
  const DB_VERSION = 000002;
  const DB_STORE_NAME = 'books';
  const Data = [{id:1,ci:0,ps:0,font:16,mark:null}]
  var db;
  (function initDb() {
    var req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onsuccess = function (evt) {
      db = this.result;
    };
    req.onerror = function (evt) {
      console.error("initDb:", evt.target.errorCode);
    };
    req.onupgradeneeded = function (evt) {
      var store = evt.currentTarget.result.createObjectStore(
        DB_STORE_NAME, { keyPath: 'id', autoIncrement: true });
      store.createIndex('bname', 'bname', { unique: false });
      store.createIndex('ps', 'ps', { unique: false });
      store.createIndex('ci', 'ci', { unique: false });
      store.createIndex('font', 'font', { unique: false });
      store.createIndex('mark', 'mark', { unique: false });
      for (var index = 0; index < Data.length; index++) {  
        store.add(Data[index]);  
      }  
    };
  })();
  function getFile(key, cb) {
    var tx = db.transaction(DB_STORE_NAME, 'readonly');
    var store = tx.objectStore(DB_STORE_NAME);
    var req = store.get(key);
        console.log(req)
    req.onsuccess = function(evt) {
      var value = evt.target.result;
      console.log(value)
      if (value)
        cb(value.file);
    };
  };
  function addPublication(id, bname) {
    console.debug("addPublication arguments:", arguments);
    if (!db) {
      console.error("addPublication: the db is not initialized");
      return;
    }
    var tx = db.transaction(DB_STORE_NAME, 'readwrite');
    var store = tx.objectStore(DB_STORE_NAME);
    var req = store.add({id: id, bname: bname});
    req.onsuccess = function (evt) {
      console.debug("Insertion in DB successful");
      //displayPubList();
      getFile(1,function(){
        console.log(1)
      });
    };
    req.onerror = function() {
      console.error("add error", this.error);
      //displayActionFailure(this.error);
    };
  }
  return{
    sendProgress : function(id,ci,ps,font,mark){
      var tx = db.transaction(DB_STORE_NAME, 'readwrite');
      var store = tx.objectStore(DB_STORE_NAME);
      var req = store.put({ps:ps,id:id,ci:ci,font:font,mark:mark});
      console.log(ci,ps)
      req.onsuccess = function(){
        //console.log(store.get(1))
      };
      req.onerror = function() {console.error("put error", this.error)}
    },
    getProgress : function(id,cb){
      var tx = db.transaction(DB_STORE_NAME, 'readonly');
      var store = tx.objectStore(DB_STORE_NAME);
      var req = store.get(id);
      req.onsuccess = function(r){
        //console.log(r)
        cb(r.target.result);
      };
      req.onerror = function() {console.error("put error", this.error)}
    },
    saveFont : function(id,font,ci,ps,mark,cb){
      var tx = db.transaction(DB_STORE_NAME, 'readwrite');
      var store = tx.objectStore(DB_STORE_NAME);
      var req = store.put({id:id,ci:ci,ps:ps,font:font,mark:mark});
      req.onsuccess = function(){
        console.log(store.get(1))
        cb();
      };
      req.onerror = function() {console.error("put error", this.error)}
    },
    saveMark : function(id,ci,ps,font,mark,cb){
      var tx = db.transaction(DB_STORE_NAME, 'readwrite');
      var store = tx.objectStore(DB_STORE_NAME);
      var req = store.put({id:id,ci:ci,ps:ps,font:font,mark:mark});
      req.onsuccess = function(r){
        //console.log(store.get(id).result.mark)
         cb(r.target.result);
      };
      req.onerror = function() {console.error("put error", this.error)}
    }
  }
})
