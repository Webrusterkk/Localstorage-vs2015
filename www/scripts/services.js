(function() {

    angular.module('starter').factory('BirthdayService', ['$q', BirthdayService]);

    function BirthdayService($q) {  
        var _db;    
        var _birthdays;
        var dbRemote;

        return {
            initDB: initDB,

            getAllBirthdays: fetchdata,
            addBirthday: addBirthday,
            updateBirthday: updateBirthday,
            deleteBirthday: deleteBirthday
        };

        function initDB() {
            // Creates the database or opens if it already exists
            _db = new PouchDB('http://finxlivedataservice.cloudapp.net/MobileService.svc/GetMyAccounts', { adapter: 'websql' });
            dbRemote = window.sqlitePlugin.openDatabase({ name: "sqlitedemo" });
        };

        function addBirthday(birthday) {
            return $q.when( dbRemote.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS NAME (id integer primary key, firstname text, lastname text)');
                tx.executeSql('INSERT INTO NAME (firstname,lastname) VALUES (?,?)', [birthday.Name, birthday.Date]);
            })
           
            );
                //_db.post(birthday)
        };

        function updateBirthday(birthday) {
            return $q.when(_db.put(birthday));
        };

        function deleteBirthday(birthday) {
            return $q.when(_db.remove(birthday));
        };

        function getAllBirthdays() {

            if (!_birthdays) {
                return $q.when(_db.allDocs({ include_docs: true}))
                          .then(function(docs) {

                              // Each row has a .doc object and we just want to send an 
                              // array of birthday objects back to the calling controller,
                              // so let's map the array to contain just the .doc objects.
                              _birthdays = docs.rows.map(function(row) {
                                  // Dates are not automatically converted from a string.
                                  row.doc.Date = new Date(row.doc.Date);
                                  return row.doc;
                              });

                              // Listen for changes on the database.
                              _db.changes({ live: true, since: 'now', include_docs: true})
                                 .on('change', onDatabaseChange);
                             
                              return _birthdays;
                          });
            } else {
                // Return cached data as a promise
                return $q.when(_birthdays);
            }
        };

        function onDatabaseChange(change) {
            var index = findIndex(_birthdays, change.id);
            var birthday = _birthdays[index];

            if (change.deleted) {
                if (birthday) {
                    _birthdays.splice(index, 1); // delete
                }
            } else {
                if (birthday && birthday._id === change.id) {
                    _birthdays[index] = change.doc; // update
                } else {
                    _birthdays.splice(index, 0, change.doc) // insert
                }
            }
        }
        
        function findIndex(array, id) {
            var low = 0, high = array.length, mid;
            while (low < high) {
                mid = (low + high) >>> 1;
                array[mid]._id < id ? low = mid + 1 : high = mid
            }
            return low;
        }

        function insert() {
            var fname = document.getElementById("firstname").value;
            var lname = document.getElementById("lastname").value;
            db.transaction(function(tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS NAME (id integer primary key, firstname text, lastname text)');
                tx.executeSql('INSERT INTO NAME (firstname,lastname) VALUES (?,?)', [fname, lname]);
            });
        }
        function fetchdata() {
            return $q.when(   db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM NAME', [], function (tx, res) {
                    var len = res.rows.length;
                    for (var i = 0; i < len; i++) {
                        alert(res.rows.item(i).firstname);
                        alert(res.rows.item(i).lastname);
                    }
                }, function (e) {
                    console.log("some error getting");
                });
            });
        }
        function deletetable()
        {
            var db = window.sqlitePlugin.openDatabase({name: "sqlitedemo"});
            db.transaction(function(tx){
                tx.executeSql('DROP TABLE IF EXISTS NAME');
            });
        }
        function updatetable()
        {
            var db = window.sqlitePlugin.openDatabase({name: "sqlitedemo"});
            db.transaction(function(tx) {
                tx.executeSql("UPDATE NAME SET firstname='Karan' WHERE lastname='Bhardwaj'",[],function(tx,res){alert("query executed")},function(e){
                    console.log("some error getting");
                });
            });
        }
      
    }
})();

