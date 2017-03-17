angular.module('songDroid.services', ['LocalStorageModule'])

.service('Songs', function(localStorageService, $q, pouchDB) {

  sync.createIndex({index: {fields: ['category']}}).then(function (result) {}).catch(function (err) {console.log(err);});

      return {
        all: function() {
          var songsList = $q.when(sync.allDocs({include_docs: true, startkey: "songs"}).then(function (result){ return result.rows; }).catch(function (err) {console.log(err);}));
          return songsList;
        },

        //TEST: OK
        active: function(songsList) {
          var songsList = $q.when(sync.find({selector: {category: {$eq:"song"}}}).then(function (result){ return result; }).catch(function (err) {console.log(err);}));
          return songsList;
        },
        //TEST: OK
        get: function(songId) {
          var song = String(songId);
              song = $q.when(sync.get(song).then(function (result){ return result; }).catch(function (err) {console.log(err);}));
          return song;
        },
        //TEST OK
        count: function() {
          var songs = $q.when(sync.find({selector: {category: {$eq:"song"}}}).then(function (result){ return result.docs.length + 1; }).catch(function (err) {console.log(err);}));
          return songs;
        },
        //TEST OK
        search: function(string) {
          var songs = $q.when(sync.allDocs({include_docs: true, startkey: 'song_' + string, endkey: 'song_' + string + '\uffff'}).then(function (result){ return result; }).catch(function (err) {console.log(err);}));
          return songs;
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

  sync.createIndex({index: {fields: ['category', 'owner', 'saved']}}).then(function (result) {}).catch(function (err) {console.log(err);});
    return {
      all: function() {
        // getData();
        setlists = localStorageService.get('localSetlists').data;
        return setlists.data;
      },
      //TEST OK
      count: function() {
        var setList = $q.when(sync.find({selector: {category: {$eq:"setlist"}}}).then(function (result){ return result.docs.length + 1; }).catch(function (err) {console.log(err);}));
        console.log(setList);
        return setList;
      },
      //TEST OK
      get: function(setlistId) {
        var setlist = String(setlistId);
            setlist = $q.when(sync.get(setlistId).then(function (result){ return result; }).catch(function (err) {console.log(err);}));
        return setlist;
      },
      //TEST OK
      active: function() {
        var setList = $q.when(sync.find({selector: {category: {$eq:"setlist"}}}).then(function (result){ return result; }).catch(function (err) {console.log(err);}));
        return setList;
      },
      //TEST OK
      search: function(string) {
        var setList = $q.when(sync.allDocs({include_docs: true, startkey: 'setlist_' + string, endkey: 'setlist_' + string + '\uffff'}).then(function (result){ return result; }).catch(function (err) {console.log(err);}));
        return setList;
      },
      //TEST OK
      pinned: function(user) {
        var user = String(user);
            user = $q.when(sync.get(user).then(function (result){ return result; }).catch(function (err) {console.log(err);}));
        return user;
      },
      //TEST OK
      owned: function(user) {
        var setList = $q.when(sync.find({selector: {owner: {$eq: user}}}).then(function (result){ return result.docs; }).catch(function (err) {console.log(err);}));
        return setList;
      },
      //TEST OK
      saved: function(user) {
        var setlists = [];
        var setList = $q.when(sync.find({selector: {category: {$eq:"setlist"}}}).then(function (result){ 
          result.docs.forEach(function(setlist) {
            setlist.saved.forEach(function(check) {
              if( check == user) {
                setlists.push(setlist);
              }
            })
          })
          return setlists;
        }).catch(function (err) {console.log(err);}));
        return setList;
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

.service('Users', function(localStorageService, $q, pouchDB) {

  sync.createIndex({index: {fields: ['username']}}).then(function (result) {}).catch(function (err) {console.log(err);});
  
  sync.bulkDocs([
    {
      _id: 'user_jilles',
      username: 'jilles',
      password: '5f4dcc3b5aa765d61d8327deb882cf99',
      pinned: null,
      roles: null,
      level: 'dev',
      category: 'user'
    },
    {
      _id: 'user_mr. windy',
      username: 'Mr. Windy',
      password: '5f4dcc3b5aa765d61d8327deb882cf99',
      pinned: null,
      roles: null,
      level: 'regular',
      category: 'user'
    },
    {
      _id: 'setlist_sample setlist_0',
      title: 'Sample Setlist',
      notes: 'Sample notes.',
      urlSpotify: null,
      songs: ['song_photograph_0','song_lost stars_0'],
      roles: [],
      owner: 'jilles',
      saved: ['Mr. Windy'],
      category: 'setlist'
    },
    {
      _id: 'setlist_sample setlist 2_0',
      title: 'Sample Setlist',
      notes: 'Sample notes.',
      urlSpotify: null,
      songs: ['song_photograph_0','song_lost stars_0'],
      roles: [],
      owner: 'Mr. Windy',
      saved: ['jilles'],
      category: 'setlist'
    },
    {
      _id: "song_photograph_0",
      title: 'Photograph',
      artist: 'Ed Sheeran',
      albumName: 'x',
      albumArt: 'img/photograph.jpg',
      key: 'E',
      bpm: 592,
      urlYouTube: null,
      urlSpotify: null,
      urlOther: null,
      category: 'song',
      sheet: "",
      lyrics: "",
      chords: "",
      sections: "",
      headers: ""
    },
    {
      _id: "song_lost stars_0",
      title: 'Lost Stars',
      artist: 'Adam Levine',
      albumName: 'V',
      albumArt: 'img/lost_stars.jpg',
      key: 'F',
      bpm: 98,
      urlYouTube: null,
      urlSpotify: null,
      urlOther: null,
      category: 'song',
      sheet: "",
      lyrics: "",
      chords: "",
      sections: "",
      headers: ""
    },
    {
      _id: "song_me and my broken heart_0",
      title: 'Me and My Broken Heart',
      artist: 'Rixton',
      albumName: 'Me and My Broken Heart',
      albumArt: 'img/rixton.jpg',
      key: 'Am',
      bpm: 912938,
      urlYouTube: null,
      urlSpotify: null,
      urlOther: null,
      category: 'song',
      sheet: "",
      lyrics: "",
      chords: "",
      sections: "",
      headers: ""
    },
    {
      _id: "song_disappear_0",
      title: 'Disappear',
      artist: 'Parachute',
      albumName: 'Overnight',
      albumArt: 'img/disappear.jpg',
      key: 'Em',
      bpm: 21,
      urlYouTube: null,
      urlSpotify: null,
      urlOther: null,
      category: 'song',
      sheet: "",
      lyrics: "",
      chords: "",
      sections: "",
      headers: ""
    }
  ]).then(function (result) {
    console.log("Multiple objects created.");
  }).catch(function (err) {
    console.log("Objects already exist.");
  });

    return {
      check: function(username) {
        var user = $q.when(sync.allDocs({include_docs: true, startkey: 'user_' + username, endkey: 'user_' + username}).then(function (result){ return result.rows[0].doc; }).catch(function (err) {console.log(err);}));
        return user;
      },
      get: function(username) {

      }
    }
})
