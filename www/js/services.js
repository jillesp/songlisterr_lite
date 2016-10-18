angular.module('songDroid.services', ['LocalStorageModule'])

.service('Songs', function(localStorageService, $q, pouchDB) {

  db.createIndex({index: {fields: ['category']}}).then(function (result) {}).catch(function (err) {console.log(err);});

      return {
        all: function() {
          var songsList = $q.when(db.allDocs({include_docs: true, startkey: "songs"}).then(function (result){ return result.rows; }).catch(function (err) {console.log(err);}));
          return songsList;
        },

        //TEST: OK
        active: function(songsList) {
          var songsList = $q.when(db.find({selector: {category: {$eq:"song"}}}).then(function (result){ return result; }).catch(function (err) {console.log(err);}));
          return songsList;
        },
        //TEST: OK
        get: function(songId) {
          var song = String(songId);
              song = $q.when(db.get(song).then(function (result){ return result; }).catch(function (err) {console.log(err);}));
          return song;
        },
        //TEST OK -- returns song count
        count: function() {
          var songs = $q.when(db.allDocs({include_docs: true, startkey: "songs"}).then(function (result){ return result.total_rows + 1; }).catch(function (err) {console.log(err);}));
          return songs;
        },
        search: function(type, string) {
          // songs = localStorageService.get('localSongs');
          // dataStore = Backendless.Persistence.of(Songs);

          //   var query = {condition:  type + " LIKE '%" + string + "%' and isActive = 1" };
          //   var foundItems = dataStore.find(query);
          //   return foundItems.dat
        }
      }
})

.service ('sharedProperties', function () {
    var property;
    return {
        getProperty:function () {
            return property;
        },
        setProperty:function (value) {
            property = value;
        }
    };
})

.service ('sharedProperties2', function () {
    var property;
    return {
        getProperty:function () {
            return property;
        },
        setProperty:function (value) {
            property = value;
        }
    };
})

.service('Setlists', function(localStorageService, $q, pouchDB) {

  db.createIndex({index: {fields: ['category']}}).then(function (result) {}).catch(function (err) {console.log(err);});

    return {
      all: function() {
        // getData();
        setlists = localStorageService.get('localSetlists').data;
        return setlists.data;
      },
      count: function() {
        var setlists = $q.when(db.allDocs({include_docs: true, startkey: "setlists"}).then(function (result){ return result.total_rows + 1; }).catch(function (err) {console.log(err);}));
        return setlists;
      },
      listed: function(setlistId) {
        console.log("Function redirected.");
        // var setlist = String(setlistId);
        //     setlist = $q.when(db.get(setlistId).then(function (result){ return result; }).catch(function (err) {console.log(err);}));
        // return setlist;        
      },
      get: function(setlistId) {
        var setlist = String(setlistId);
            setlist = $q.when(db.get(setlistId).then(function (result){ return result; }).catch(function (err) {console.log(err);}));
        return setlist;
      },

      //TESTING
      active: function() {
        var setList = $q.when(db.find({selector: {category: {$eq:"setlist"}}}).then(function (result){ return result; }).catch(function (err) {console.log(err);}));
        return setList;
      },

      search: function(type, string) {
        getData();
        setlists = Backendless.Persistence.of(Setlists).find();
          var query = {condition:  type + " LIKE '%" + string + "%' and isActive = 1 and isPrivate = false" };
          var foundItems = Backendless.Persistence.of(Setlists).find(query);
          return foundItems.data;
      },

      pinned: function(userObjId) {
        // getData();
        setlists = localStorageService.get('localSetlists').data;
        users = localStorageService.get('localUsers').data;
        users = users.filter(
          function(users){
            return users.objectId == userObjId;
          }
        )
        return users[0].setlists;
      }
    }
})

.service('Roles', function(localStorageService) {

    function getData() {

      var i = new Image();

      i.onload = function() {

          var APPLICATION_ID = '48F7E0A1-E799-EE7C-FF56-D3687FF1BF00',
              SECRET_KEY = 'B68610CE-62FD-34D1-FFD2-EF348786DD00',
              VERSION = 'v1';

        Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);
        localStorageService.set('localSongs', Backendless.Persistence.of(Songs).find());
        localStorageService.set('localSetlists', Backendless.Persistence.of(Setlists).find());
        localStorageService.set('localUsers', Backendless.Persistence.of(Backendless.User).find());
        localStorageService.set('localRoles', Backendless.Persistence.of(Roles).find());
        console.log("User is online. Connection success.");
      }

      i.onerror = function() {
        console.log("User is offline.");
      }

      i.src = 'http://gfx2.hotmail.com/mail/uxp/w4/m4/pr014/h/s7.png?d=' + escape(Date());
  }

    return {
      all: function() {
        getData();
        roles = localStorageService.get('localRoles').data;
        return roles;
      },
      get: function(roleId) {
        getData();
        roles = localStorageService.get('localRoles');
          for (var i = 0; i < roles.data.length; i++) {
            if (roles.data[i].rolesId === parseInt(roleId)) {
              return roles.data[i];
            }
          }
          return null;
      }
    }
})

.service('Users', function() {

    return {
      all: function() {
        users = Backendless.Persistence.of(Backendless.User).find();
        return users.data;
      },
      count: function() {
        users = Backendless.Persistence.of(Backendless.User).find();
        var ctr = 1;
        for (var i = 0; i < users.data.length; i++) {
            ctr++;
        }
        return ctr;
      },
      get: function(userId) {
        users = Backendless.Persistence.of(Backendless.User).find();
          for (var i = 0; i < users.data.length; i++) {
            if (users.data[i].userId === parseInt(userId)) {
              return users.data[i];
            }
          }
          return null;
      },
      active: function() {
        users = Backendless.Persistence.of(Backendless.User).find();
        var findActive = {condition: "isActive = 1"};
        var foundActive = Backendless.Persistence.of(Backendless.User).find(findActive);
        return foundActive.data;
      },
      roles: function(role) {
        users = Backendless.Persistence.of(Backendless.User).find();
        var findActive = {condition: role + " = true and isActive = 1"};
        console.log("Queried: " + findActive);
        var foundActive = Backendless.Persistence.of(Backendless.User).find(findActive);
        return foundActive.data;
      },
      data: function() {
        users = Backendless.Persistence.of(Backendless.User).find();
        var objectid = 'F2AC443E-7F6D-4D8E-FFD1-5BEA2E195300';
        var objectdata = Backendless.Persistence.of(Backendless.User).findById(objectid);
        return objectdata;
      },
      getemail: function(userName) {
        users = Backendless.Persistence.of(Backendless.User).find();
          for (var i = 0; i < users.data.length; i++) {
            if (users.data[i].username == userName) {
              return users.data[i];
            }
          }
          return null;
      }

    }
})
