var db = new PouchDB('testDB');
// db.destroy(db);

function Songs(args) {
    args = args || {};
    this.songId = args.songId || "";
    this.songTitle = args.songTitle || "";
    this.songArtist = args.songArtist || "";
    this.songAlbum = args.songAlbum || "";
    this.songAlbumName = args.songAlbumName || "";
    this.songKey = args.songKey || "";
    this.songYoutube = args.songYoutube || "";
    this.songSpotify = args.songSpotify || "";
    this.isActive = args.isActive || "";
    this.___class = 'Songs';
    this.songSheet = args.songSheet || "";
    this.songLyrics = args.songLyrics || "";
    this.songChords = args.songChords || "";
    this.songTags = args.songTags || "";
    this.songOthers = args.songOthers || "";
    this.songBPM = args.songBPM || "";
    this.songSections = args.songSections || "";
}

function Setlists(args) {
    args = args || {};
    this.setlistId = args.setlistId || "";
    this.setlistName = args.setlistName || "";
    this.setlistRoles = args.setlistRoles || "";
    this.setlistSongs = args.setlistSongs || {};
    this.setlistNotes = args.setlistNotes || "";
    this.isActive = args.isActive || "";
    this.setlistSpotify = args.setlistSpotify || "";
    this.___class = 'Setlists';

}

function Tags(args) {
    args = args || {};
    this.tagId = args.tagId || "";
    this.tagName = args.tagName || "";
    this.setlists = args.setlists || {};
    this.songs = args.songs || {};
    this.___class = 'Tags';
}

function Roles(args) {
    args = args || {};
    this.___class = 'Roles';
    this.roleName = args.roleName || "";
}

// FUNCTIONS

//TEST OK
function saveEditSong(id, info, result) {
  db.get(id).then(function(doc) {
    return db.put({
      _id: id,
      _rev: doc._rev,
      title: String(info.title),
      artist: String(info.artist),
      albumName: String(info.albumName),
      albumArt: String(info.albumArt),
      key: String(info.key),
      bpm: String(info.bpm),
      urlYouTube: String(info.urlYouTube),
      urlSpotify: String(info.urlSpotify),
      urlOther: String(info.urlOther),
      sheet: String(result.sheet),
      lyrics: String(result.lyrics),
      chords: String(result.chords),
      sections: String(result.collect),
      headers: String(result.headers),
      category: 'song'
    });
    }).then(function(response) {
      console.log(info.title + " updated.")
    }).catch(function (err) {
      console.log(err);
    });
}

//TEST OK
function saveNewSong(info) {
  db.put({
      _id: "song_" + String(info.title).toLowerCase() + "_" + String(info.id),
      title: String(info.title),
      artist: String(info.artist),
      albumName: String(info.albumName),
      albumArt: String(info.albumArt),
      key: String(info.key),
      bpm: String(info.bpm),
      urlYouTube: null,
      urlSpotify: null,
      urlOther: null,
      category: 'song',
      sheet: "",
      lyrics: "",
      chords: "",
      sections: "",
      headers: ""
    }).then(function(response) {
      console.log("Song saved.")
    }).catch(function (err) {
      console.log(err);
    });
}

function saveNewSetlist(info) {


    db.put({
      _id: "setlist_" + String(info.title).toLowerCase() + "_" + String(info.id),
      title: String(info.title),
      notes: String(info.notes),
      urlSpotify: String(info.urlSpotify),
      songs: [],
      roles: [],
      owner: String(info.owner),
      category: 'setlist'
    }).then(function(response) {
      console.log("Setlist saved.")
    }).catch(function (err) {
      console.log(err);
    });
}

function deleteItem(id) {
  var id = String(id);
  db.get(id).then(function(doc) {
    return db.remove(doc);
  }).then(function (result) {
    console.log("Song deleted.");
  }).catch(function (err) {
    console.log(err);
  });
}

function deleteSetlist(id) {
  var id = String(id);
  db.get(id).then(function(doc) {
    return db.remove(doc);
  }).then(function (result) {
    console.log("Setlist deleted.");
  }).catch(function (err) {
    console.log(err);
  });
}

function addSongToSetlist(songs, setlistId, setlist) {
  db.get(setlistId).then(function(doc) {
    return db.put({
      _id: setlistId,
      _rev: doc._rev,
      title: String(setlist.title),
      notes: String(setlist.notes),
      urlSpotify: String(setlist.urlSpotify),
      songs: songs,
      roles: setlist.roles,
      owner: String(setlist.owner),
      category: 'setlist'
    });
    }).then(function(response) {
      console.log(setlist.title + " updated.")
    }).catch(function (err) {
      console.log(err);
    });
}

//TEST OK
angular.isUndefinedOrNull = function(val) {
    return angular.isUndefined(val) || val === null
}

function saveEditedSetlist(info, id) {
    // var objectId = getSetlist(id).objectId;
    // var update = Backendless.Persistence.of(Setlists).findById(objectId);
    //     update["setlistName"] = info.name;
    //     update["setlistSpotify"] = info.spotify;
    //     update["setlistNotes"] = info.notes;

    // var updated = Backendless.Persistence.of(Setlists).save(update);
    // console.log("Setlist updated: " + updated);
}

function pinSetlist(setlistId) {
     var setlistId = getSetlist(setlistId).objectId;
     console.log(setlistId);
     var setlistObject = Backendless.Persistence.of(Setlists).findById(setlistId);

     var userObject = Backendless.Persistence.of(Backendless.User).findById("F2AC443E-7F6D-4D8E-FFD1-5BEA2E195300");

     var unpin = userObject["setlists"].splice(0,5,{objectId: setlistObject.objectId,___class: "Setlists"});

     var updated = Backendless.Persistence.of(Backendless.User).save(userObject);
     console.log("Setlist added to User: " + JSON.stringify(updated));
}

function removeFromSetlist(setlist) {
  db.get(setlist._id).then(function(doc) {
    return db.put({
      _id: setlist._id,
      _rev: doc._rev,
      title: String(setlist.title),
      notes: String(setlist.notes),
      urlSpotify: String(setlist.urlSpotify),
      songs: setlist.songs,
      roles: setlist.roles,
      owner: String(setlist.owner),
      category: 'setlist'
    });
    }).then(function(response) {
      console.log(setlist.title + " updated.")
    }).catch(function (err) {
      console.log(err);
    });
}

function spliceFromUser(userId, setlistId) {

     var userObject = Backendless.Persistence.of(Backendless.User).findById(userId);
     var stupidArray = userObject["setlists"];

    for (var i = 0; i <= stupidArray.length; i++) {
        if (stupidArray[i].setlistId === parseInt(setlistId)) {
              console.log("Found---");
              stupidArray.splice(i, 1);

           var updated = Backendless.Persistence.of(Backendless.User).save(userObject);
           console.log("Song spliced : " + JSON.stringify(stupidArray));

           return;
        } else {
            console.log("Request not found.");
        }
    }
}

function retrieveSearched(tagId) {
     var setlistObject = Backendless.Persistence.of(Setlists).findById(setlistId);
     var songObject = Backendless.Persistence.of(Songs).findById(songId);

     var stupidArray = setlistObject["setlistSongs"].push({objectId: songObject.objectId,___class: "Songs"});

     var updated = Backendless.Persistence.of(Setlists).save(setlistObject);
     console.log("Song added to Setlist: " + updated);
}

angular.isUndefinedOrNull = function(val) {
    return angular.isUndefined(val) || val === null
}

function processSheetMusic(info, id, result) {
    var collect = info.match(/[\"].+[\"]/gi);
        collect = JSON.stringify(collect).replace(/[\"]/gi, '').replace(/\\/gi, '\"').replace(/\ /g, '_');;

    var sheet = info;
    var lyrics = sheet.replace(/\[[^ ]\]/g, '').replace(/\[.[a-z#\d]+\]/g, '').replace(/(\[.\/.)+\]/g, '').replace(/\ (?=([a-z0-9]*">))/g, '_');
    var chords = sheet.replace(/[^[\n\r\ \]](?![^[\]]*])/g, " ").replace(/[\[\]]/g, "");
    var headers = sheet.replace(/[^\<\>\n\r](?![^\<\>]*>)/g, '').replace(/<.[^.>]+(?=\=\")/g, '').replace(/[="]/g, '').replace(/(<\/a\>)/g, '').replace(/>/g, ':');

    db.get(id).then(function(doc) {
    return db.put({
      _id: id,
      _rev: doc._rev,
      title: String(result.title),
      artist: String(result.artist),
      albumName: String(result.albumName),
      albumArt: String(result.albumArt),
      key: String(result.key),
      bpm: String(result.bpm),
      urlYouTube: String(result.urlYouTube),
      urlSpotify: String(result.urlSpotify),
      urlOther: String(result.urlOther),
      sheet: String(sheet),
      lyrics: String(lyrics),
      chords: String(chords),
      sections: String(collect),
      headers: String(headers),
      category: 'song'
    });
    }).then(function(response) {
      console.log("Lyrics updated.")
    }).catch(function (err) {
      console.log(err);
    });
}

function saveEditedRoles(info, id) {
    var objectId = getSetlist(id).objectId;
    var update = Backendless.Persistence.of(Setlists).findById(objectId);
        update["setlistNotes"] = info.notes;
    var setlistRoles;

    console.log(update['setlistRoles']);
        setlistRoles = JSON.parse(update['setlistRoles']);
        var arr = [];

        for(var x in setlistRoles){
          arr.push(setlistRoles[x]);
        }

        var role = {roleName: info.roleName, roleUser: info.roleUser, roleEmail: info.roleEmail};
        arr.push(role);

        update["setlistRoles"] = JSON.stringify(arr);


    var updated = Backendless.Persistence.of(Setlists).save(update);
    console.log("Setlist updated: " + updated);
}

function transposeUp(result) {

var chords = String(result.chords);
    chords = chords.replace(/A(?=[^#&*])/g, 'A*').replace(/A#/g, 'B&');
    chords = chords.replace(/B(?=[^#&*])/g, 'C&');
    chords = chords.replace(/C(?=[^#&*])/g, 'C*').replace(/C#/g, 'D&');
    chords = chords.replace(/D(?=[^#&*])/g, 'D*').replace(/D#/g, 'E&');
    chords = chords.replace(/E(?=[^#&*])/g, 'F&');
    chords = chords.replace(/F(?=[^#&*])/g, 'F*').replace(/F#/g, 'G&');
    chords = chords.replace(/G(?=[^#&*])/g, 'G*').replace(/G#/g, 'A&');
    chords = chords.replace(/[*]/g, '#').replace(/\&/g, '');

    db.get(result._id).then(function(doc) {
    return db.put({
      _id: result._id,
      _rev: doc._rev,
      title: String(result.title),
      artist: String(result.artist),
      albumName: String(result.albumName),
      albumArt: String(result.albumArt),
      key: String(result.key),
      bpm: String(result.bpm),
      urlYouTube: String(result.urlYouTube),
      urlSpotify: String(result.urlSpotify),
      urlOther: String(result.urlOther),
      sheet: String(result.sheet),
      lyrics: String(result.lyrics),
      chords: String(chords),
      sections: String(result.collect),
      headers: String(result.headers),
      category: 'song'
    });
    }).then(function(response) {
      console.log("Lyrics updated.")
    }).catch(function (err) {
      console.log(err);
    });
}

function transposeDown(result) {

var chords = String(result.chords);
    chords = chords.replace(/A(?=[^#&*])/g, 'G*').replace(/A#/g, 'A&');
    chords = chords.replace(/B(?=[^#&*])/g, 'A&');
    chords = chords.replace(/C(?=[^#&*])/g, 'B&').replace(/C#/g, 'C&');
    chords = chords.replace(/D(?=[^#&*])/g, 'C*').replace(/D#/g, 'D&');
    chords = chords.replace(/E(?=[^#&*])/g, 'D*');
    chords = chords.replace(/F(?=[^#&*])/g, 'E&').replace(/F#/g, 'F&');
    chords = chords.replace(/G(?=[^#&*])/g, 'F*').replace(/G#/g, 'G&');
    chords = chords.replace(/[*]/g, '#').replace(/\&/g, '');

    db.get(result._id).then(function(doc) {
    return db.put({
      _id: result._id,
      _rev: doc._rev,
      title: String(result.title),
      artist: String(result.artist),
      albumName: String(result.albumName),
      albumArt: String(result.albumArt),
      key: String(result.key),
      bpm: String(result.bpm),
      urlYouTube: String(result.urlYouTube),
      urlSpotify: String(result.urlSpotify),
      urlOther: String(result.urlOther),
      sheet: String(result.sheet),
      lyrics: String(result.lyrics),
      chords: String(chords),
      sections: String(result.collect),
      headers: String(result.headers),
      category: 'song'
    });
    }).then(function(response) {
      console.log("Lyrics updated.")
    }).catch(function (err) {
      console.log(err);
    });
}

function sendMail(content, arr) {
    var successCallback = function( response ) {
      console.log( "[ASYNC] message has been sent" );
    };

    var failureCallback = function( fault ) {
      console.log( "Error - " + fault.message );
    };

    // prepare message bodies (plain and html) and attachment
    var bodyParts = new Bodyparts();
    bodyParts.textmessage = content;
    var attachments = [];

    // asynchronous call
    var responder = new Backendless.Async( successCallback, failureCallback );
    Backendless.Messaging.sendEmail( "Songlisterr Update", bodyParts, arr, attachments, responder );
}

var offlineSongs = [];
function pushOffline(songObject) {
    offlineSongs.push(songObject);
    window.localStorage.setItem("offlineSongs", JSON.stringify(offlineSongs));
    console.log(JSON.stringify(offlineSongs));
}

function editProfileRoles(id,info){
    var update = Backendless.Persistence.of(Backendless.User).findById(id);

    if(info.email != null) {
        update["email"] = String(info.email);
    }
    if(info.bandrole != null) {
        update["profileBandRole"] = String(info.bandrole);
    }
    var updated = Backendless.Persistence.of(Backendless.User).save(update);
    console.log("Song edited: " + updated);
}

function addRole(info) {
   var newRole = new Roles({
        roleName: info
    })

    var updated = Backendless.Persistence.of(Roles).save(newRole);
    console.log("Role saved: " + updated);
}
