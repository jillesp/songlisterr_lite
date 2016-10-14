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
function saveEditSong(id, info) {
    var objectId = getObject(id).objectId;
    var update = Backendless.Persistence.of(Songs).findById(objectId);

    if(info.title != null) {
        update["songTitle"] = String(info.title);
    }
    if(info.artist != null) {
        update["songArtist"] = String(info.artist);
    }
    if(info.albumName != null) {
        update["songAlbumName"] = String(info.albumName);
    }
    if(info.key != null) {
        update["songKey"] = String(info.key);
    }
    if(info.albumArt != null) {
        update["songAlbum"] = String(info.albumArt);
    }
    if(info.youtube != null) {
        update["songYoutube"] = String(info.youtube);
    }
    if(info.spotify != null) {
        update["songSpotify"] = String(info.spotify);
    }

    update = Backendless.Persistence.of(Songs).save(update);
    console.log("Song edited: " + updated);
}

function saveNewSong(info) {

    // var object = new Setlists();

    var newSong = {
        _id: new Date().toISOString(),
        songId: parseInt(info.count),
        songTitle: String(info.title),
        songArtist: String(info.artist),
        songAlbumName: String(info.albumName),
        songAlbum: String(info.albumArt),
        songKey: String(info.key),
        songYoutube: String(info.youtube),
        songSpotify: String(info.spotify),
        ownerId: "testUser",
        isActive: 1
    }
    
    // var updated = Backendless.Persistence.of(Songs).save(newSong);
    var updated = db.put(newSong, function callback(err, results) {
        if (!err) {
            console.log('Successfully posted song!');
        } else {
            console.log(err);
        }
    });
}

function saveNewSetlist(info) {
    var newSetlist = new Setlists({
        setlistId: parseInt(info.count),
        setlistName: String(info.name),
        setlistNotes: String(info.notes),
        setlistSongs: [],
        isActive: 1
    })
    var updated = Backendless.Persistence.of(Setlists).save(newSetlist);
    console.log("Setlist saved: " + updated);
}

function deleteItem(id) {
    var update = getObject(id).objectId;
        update = Backendless.Persistence.of(Songs).findById(update);
        update["isActive"] = 0;
        update = Backendless.Persistence.of(Songs).save(update);
    console.log("Song deleted: " + updated);
}

function deleteSetlist(id) {
    var update = getSetlist(id).objectId;
        update = Backendless.Persistence.of(Setlists).findById(update);
        update.isActive = 0;
        update = Backendless.Persistence.of(Setlists).save(update);
    console.log("Setlist deleted " + updated);
}

function getObject(songId) {
    // var songs = localStorage.getItem('localSongs');
    var songs = Backendless.Persistence.of(Songs).find();
        // songs = JSON.parse(songs);
     for (var i = 0; i < songs.data.length; i++) {
        if (songs.data[i].songId === parseInt(songId)) {
          return (songs.data[i]);
        }
     }
}

function getSetlist(setlistId) {
    var setlists = Backendless.Persistence.of(Setlists).find();
        // setlists = JSON.parse(setlists);
     for (var i = 0; i < setlists.data.length; i++) {
        if (setlists.data[i].setlistId === parseInt(setlistId)) {
          return (setlists.data[i]);
        }
     }
}

function addSongToSetlist(songId, setlistId) {
     var songId = getObject(songId).objectId;
     var setlistId = getSetlist(setlistId).objectId;

     var setlistObject = Backendless.Persistence.of(Setlists).findById(setlistId);
     var songObject = Backendless.Persistence.of(Songs).findById(songId);

     var stupidArray = setlistObject["setlistSongs"].push({objectId: songObject.objectId,___class: "Songs"});

//     console.log("Setlist: " + JSON.stringify(setlistObject));
//     console.log("Array: " + JSON.stringify(stupidArray));
//     console.log("Array: " + JSON.stringify(stupidArray));

     var updated = Backendless.Persistence.of(Setlists).save(setlistObject);
     console.log("Song added to Setlist: " + updated);
}

angular.isUndefinedOrNull = function(val) {
    return angular.isUndefined(val) || val === null
}

function saveEditedSetlist(info, id) {
    var objectId = getSetlist(id).objectId;
    var update = Backendless.Persistence.of(Setlists).findById(objectId);
        update["setlistName"] = info.name;
        update["setlistSpotify"] = info.spotify;
        update["setlistNotes"] = info.notes;

    var updated = Backendless.Persistence.of(Setlists).save(update);
    console.log("Setlist updated: " + updated);
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

function spliceFromSetlist(setlistId, songId) {

     var setlistId = getSetlist(setlistId).objectId;
     var setlistObject = Backendless.Persistence.of(Setlists).findById(setlistId);

     var stupidArray = setlistObject["setlistSongs"];

    for (var i = 0; i < stupidArray.length; i++) {
        if (stupidArray[i].songId === parseInt(songId)) {
          console.log("Found---");
          stupidArray.splice(i, 1);

           var updated = Backendless.Persistence.of(Setlists).save(setlistObject);
           console.log("Song spliced : " + JSON.stringify(stupidArray));
        }
    }
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

function processSheetMusic(info, id) {
    var songId = getObject(id).objectId;

    var collect = info.match(/[\"].+[\"]/gi);
        collect = JSON.stringify(collect).replace(/[\"]/gi, '').replace(/\\/gi, '\"').replace(/\ /g, '_');;

    var sheet = info;
    var lyrics = sheet.replace(/\[[^ ]\]/g, '').replace(/\[.[a-z#\d]+\]/g, '').replace(/(\[.\/.)+\]/g, '').replace(/\ (?=([a-z0-9]*">))/g, '_');
    var chords = sheet.replace(/[^[\n\r\ \]](?![^[\]]*])/g, " ").replace(/[\[\]]/g, "");
    var headers = sheet.replace(/[^\<\>\n\r](?![^\<\>]*>)/g, '').replace(/<.[^.>]+(?=\=\")/g, '').replace(/[="]/g, '').replace(/(<\/a\>)/g, '').replace(/>/g, ':');

    var update = Backendless.Persistence.of(Songs).findById(songId);
        update["songLyrics"] = lyrics;
        update["songSheet"] = sheet;
        update["songChords"] = chords;
        update["songSections"] = collect;
        update["songHeaders"] = headers;
    var updated = Backendless.Persistence.of(Songs).save(update);
    console.log("Sheet processed: \n" + chords);
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

function transposeUp(id) {
var songChords = getObject(id).songChords;
    songChords = songChords.replace(/A(?=[^#&*])/g, 'A*').replace(/A#/g, 'B&');
    songChords = songChords.replace(/B(?=[^#&*])/g, 'C&');
    songChords = songChords.replace(/C(?=[^#&*])/g, 'C*').replace(/C#/g, 'D&');
    songChords = songChords.replace(/D(?=[^#&*])/g, 'D*').replace(/D#/g, 'E&');
    songChords = songChords.replace(/E(?=[^#&*])/g, 'F&');
    songChords = songChords.replace(/F(?=[^#&*])/g, 'F*').replace(/F#/g, 'G&');
    songChords = songChords.replace(/G(?=[^#&*])/g, 'G*').replace(/G#/g, 'A&');
    songChords = songChords.replace(/[*]/g, '#').replace(/\&/g, '');

var objectId = getObject(id).objectId;
var update = Backendless.Persistence.of(Songs).findById(objectId);
    update["songChords"] = songChords;
    update = Backendless.Persistence.of(Songs).save(update);

}

function transposeDown(id) {
var songChords = getObject(id).songChords;
    songChords = songChords.replace(/A(?=[^#&*])/g, 'G*').replace(/A#/g, 'A&');
    songChords = songChords.replace(/B(?=[^#&*])/g, 'A&');
    songChords = songChords.replace(/C(?=[^#&*])/g, 'B&').replace(/C#/g, 'C&');
    songChords = songChords.replace(/D(?=[^#&*])/g, 'C*').replace(/D#/g, 'D&');
    songChords = songChords.replace(/E(?=[^#&*])/g, 'D*');
    songChords = songChords.replace(/F(?=[^#&*])/g, 'E&').replace(/F#/g, 'F&');
    songChords = songChords.replace(/G(?=[^#&*])/g, 'G*').replace(/G#/g, 'G&');
    songChords = songChords.replace(/[*]/g, '#').replace(/\&/g, '');
console.log(songChords);

var objectId = getObject(id).objectId;
var update = Backendless.Persistence.of(Songs).findById(objectId);
    update["songChords"] = songChords;
    update = Backendless.Persistence.of(Songs).save(update);
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