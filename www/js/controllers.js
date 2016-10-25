angular.module('songDroid.controllers', [])

.controller('BrowseCtrl', function($scope, Songs, $state, $stateParams, sharedProperties, $ionicSideMenuDelegate, $location, $timeout) {
  //TEST OK {
 $scope.hasParams = false;
 $scope.isActiveOne = true;

 if($state.params.msg!=null){
    $scope.hasParams = true;
    $scope.msg = $state.params.msg;
      $timeout(function(){
        $scope.hasParams = false;
        $state.params.msg = "";
        $scope.msg = null;
      }, 1000);
 };

  Songs.active().then(function(result) {
    $scope.songs = result.docs;
    $scope.go = function(song) {
        sharedProperties.setProperty(song._id);
        $location.path('tab/' + song._id + '/landing');
    };
  });

  $scope.delete = function(song) {
      deleteItem(song._id);
      Songs.active(sharedProperties.getProperty()).then(function(){
        $state.go($state.current, { msg: "Song deleted." }, {reload: true});
      });
  }

  $scope.addNewSong = function() {
      $location.path('/tab/browse/new');
  }

  $scope.toggleLeft = function() {
      $ionicSideMenuDelegate.toggleLeft();
  };
  // END TEST

  $scope.addToSetlist = function(song) {
      // sharedProperties.setProperty(song.id);
      $location.path('song/' + song._id + '/add');
  };

})

//TESTING
.controller('SetlistsCtrl', function($scope, Setlists, $location, $stateParams, sharedProperties2, $state, $timeout) {
  $scope.hasParams = false;
  $scope.isActiveOne = true;

  if($state.params.msg!=null){
     $scope.hasParams = true;
     $scope.msg = $state.params.msg;
       $timeout(function(){
         $scope.hasParams = false;
         $state.params.msg = "";
         $scope.msg = null;
       }, 1000);
  };

  Setlists.active().then(function(result) {
    $scope.setlists = result.docs;
    $scope.go = function(setlist) {
        sharedProperties2.setProperty(setlist._id);
        $location.path('tab/setlists/' + setlist._id + '/items');
    };

    $scope.goInfo = function(setlist) {
        sharedProperties2.setProperty(setlist._id);
        $location.path('/setlist/setlists/' + setlist._id +'/info');
    }

    $scope.deleteItem = function(setlist) {
        deleteSetlist(setlist._id);
        Setlists.active(sharedProperties2.getProperty()).then(function(){
          $state.go($state.current, { msg: "Setlist deleted." }, {reload: true});
        });
    }

    $scope.addSetlist = function() {
        $location.path('/tab/setlists/new');
    };
  });

    $scope.practice = function(setlist){
        var user = 'user_jilles';
        var pin = pinSetlist(setlist, user);
        sharedProperties2.setProperty(setlist._id);
        $location.path('/tab/setlists/' + setlist._id +'/items');
    }



})

//TEST OK
.controller('AddSetlistCtrl', function($scope, Setlists, $location, $stateParams, $state, Users) {

    $scope.model = { name: '' };
    $scope.form = {};

    Setlists.count().then(function(result) {
      $scope.verify = function() {

         $scope.req = $scope.form.newSetlist.$invalid;
         if($scope.form.newSetlist.$valid == true) {
             var info = new Object();

              if(!angular.isUndefinedOrNull($scope.model.title)) { info.title = $scope.model.title; }
              if(!angular.isUndefinedOrNull($scope.model.notes)) { info.notes = $scope.model.notes; } else { info.notes = "None." }
              if(!angular.isUndefinedOrNull($scope.model.spotify)) { info.urlSpotify = $scope.model.spotify; } else { info.urlSpotify = "None." }
              info.owner = "Jilles";
              info.id = result;
              saveNewSetlist(info);
              $state.go('tab.setlists', {msg: String($scope.model.title) + " created."});
         }
      }
    });

     $scope.back = function() {
        $location.path('tab/setlists');
     };
})

.controller('SetlistItemsCtrl', function($scope, Setlists, Songs, $location, $stateParams, sharedProperties, sharedProperties2, $state, $window, $timeout) {

  var songs = [];
  Setlists.get($stateParams.setlistId).then(function(result) {
    $scope.title = result.title;

    angular.forEach(result.songs, function(song){
        Songs.get(song).then(function(result) {
          songs.push(result);
        });
    });

    $scope.remove = function(song) {
      result.songs.splice(result.songs.indexOf(song._id), 1);
      removeFromSetlist(result);
      Setlists.get($stateParams.setlistId).then(function(result) {
        $state.go($state.$current, {}, {reload: true})
      });
    };

    $scope.songs = songs;
  });

   $scope.go = function(id) {
       sharedProperties.setProperty(id);
       $location.path('tab/' + id + '/landing');
   };

  // $scope.goSpotify = function() {
  //   var url = Setlists.get(sharedProperties2.getProperty()).setlistSpotify;
  //   $window.open(url);
  // };

  //  var id = $stateParams.setlistId;

  //  $scope.editSetlist = function(id){
  //       $location.path('setlist/setlists/' + id + '/edit')
  //  }



   $scope.back = function() {
      $location.path('tab/setlists');
   }
})

.controller('AddSongCtrl', function($scope, Songs, $stateParams, $state) {

  //TEST OK
  $scope.model = { title: '' };
  $scope.form = { newSong: '' };
  $scope.req = $scope.form.newSong.$invalid;
  Songs.count().then(function(result) {
    $scope.songs = result;
    $scope.verify = function() {
       if($scope.form.newSong.$valid == true) {
           var  info = new Object();
              if(!angular.isUndefinedOrNull($scope.model.title)) { info.title = $scope.model.title; }
              if(!angular.isUndefinedOrNull($scope.model.artist)) { info.artist = $scope.model.artist; }
              if(!angular.isUndefinedOrNull($scope.model.albumName)){ info.albumName = $scope.model.albumName; } else { info.albumName = "Unknown"; }
              if(!angular.isUndefinedOrNull($scope.model.key)) { info.key = $scope.model.key; } else { info.key = "Unspecified" }
              if(!angular.isUndefinedOrNull($scope.model.bpm)) { info.bpm = $scope.model.bpm; } else { info.bpm = "Unspecified" }
              if(!angular.isUndefinedOrNull($scope.model.albumArt)){ info.albumArt = $scope.model.albumArt; } else { info.albumArt = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"; }
              if(!angular.isUndefinedOrNull($scope.model.youtube)) { info.youtube = $scope.model.youtube; } else { info.youtube = "Unspecified" }
              if(!angular.isUndefinedOrNull($scope.model.spotify)) { info.spotify = $scope.model.spotify; } else { info.spotify = "Unspecified" }
              info.id = String(result);
              saveNewSong(info, result);
              $state.go('tab.songs', {msg: String($scope.model.title) + " created."});
       }
    }
  });
})

.controller('SongInfoCtrl', function($scope, $stateParams, Songs, $location, $state, sharedProperties, $timeout) {
  //TEST OK
  $scope.hasParams = false;
  if($state.params.msg!=null){
     $scope.hasParams = true;
     $scope.msg = $state.params.msg;
       $timeout(function(){
         $scope.hasParams = false;
         $scope.msg = null;
       }, 1000);
  };

  Songs.get(sharedProperties.getProperty()).then(function(result) {
    $scope.song = result;
  });

  $scope.editSong = function(id) {
      $location.path('song-edit/' + id + '/edit-info');
  };

  $scope.back = function() {
    $location.path('tab/'+sharedProperties.getProperty()+'/landing');
  };


})

.controller('SongLandingCtrl', function($scope, $stateParams, Songs, $location, $state, sharedProperties, $window, $sanitize, $sce, $ionicScrollDelegate, $ionicLoading, $timeout, $anchorScroll, $ionicPopover) {

   $scope.hasParams = false;
   $scope.isActiveOne = true;

   if($state.params.msg!=null){
      $scope.hasParams = true;
      $scope.msg = $state.params.msg;
        $timeout(function(){
          $scope.hasParams = false;
          $state.params.msg = "";
          $scope.msg = null;
        }, 1000);
   };

  //TEST OK
  Songs.get($stateParams.songId).then(function(result) {
    $scope.song = result;
    $scope.go = function() {
        $location.path('song/' + result._id + '/info');
    };

    $scope.transposeUp = function() {
      transposeUp(result);

      Songs.get(sharedProperties.getProperty()).then(function(result) {
        $state.go($state.$current, {msg: "Song transposed."}, {reload: true})
      });
    }

    $scope.transposeDown = function() {
      transposeDown(result);

      Songs.get(sharedProperties.getProperty()).then(function(result) {
        $state.go($state.$current, {msg: "Song transposed."}, {reload: true})
      });
    }
  });

  $scope.back = function() {
    $location.path('tab/browse');
  }

  // $scope.goSpotify = function() {
  //   var url = Songs.get(sharedProperties.getProperty()).songSpotify;
  //   console.log(url);
  //   $window.open(url);
  // };

  var sections = Songs.get(sharedProperties.getProperty()).songSections;

  try {
     sections = JSON.parse(sections);
  } catch(e) {
    console.log("Warning: This song has no music sheet.");
  };

  $scope.sections = sections;
  $scope.doJump = false;
  $scope.jump = function() {
    if($scope.doJump == false){
     $scope.doJump = true;
    } else {
     $scope.doJump = false;
    }
  };

  $scope.to_trusted = function(html_code) {
    return $sce.trustAsHtml(html_code);
  };


  $scope.model = { section: '' };
  $scope.form = {};
  $scope.model.chordsVisible = true;

  $scope.toggleChords = function() {
    if($scope.model.chordsVisible == true){
      $scope.model.chordsVisible = false;
    } else {
      $scope.model.chordsVisible = true;
    }
  }

  $scope.jumpTo = function() {
    var loc = $scope.model.section;
    $location.hash(loc);
    $ionicScrollDelegate.scrollBy(0, -100, true);

    $scope.doJump = false;
  };

  $scope.prevSong = function() {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0,
      duration: 400
    });

    var iterator = [];
    Songs.active().then(function(result) {
      angular.forEach(result.docs, function(song){
        iterator.push(song._id);
      });

      Songs.get($stateParams.songId).then(function(result) {
        nextIndex = iterator.indexOf(result._id) - 1;

        if(nextIndex < 0) {
          nextIndex = iterator.length - 1;
        }

        Songs.active().then(function(result) {
          $state.go($state.$current, {msg: "Song updated.", songId: result.docs[nextIndex]._id}, {reload: true})
        });
      });
    });
  };

  $scope.nextSong = function() {
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0,
      duration: 400
    });

    var iterator = [];
    Songs.active().then(function(result) {
      angular.forEach(result.docs, function(song){
        iterator.push(song._id);
      });

      Songs.get($stateParams.songId).then(function(result) {
        nextIndex = iterator.indexOf(result._id) + 1;

        if(nextIndex == iterator.length) {
          nextIndex = 0;
        }

        Songs.active().then(function(result) {
          $state.go($state.$current, {msg: "Song updated.", songId: result.docs[nextIndex]._id}, {reload: true})
        });
      });
    });
  };
})

.controller('SongActionCtrl', function($scope, $stateParams, Songs, sharedProperties, $location, $window, $state, $timeout) {

  $scope.hasParams = false;
  $scope.isActiveOne = true;

  if($state.params.msg!=null){
      $scope.hasParams = true;
      $scope.msg = $state.params.msg;
        $timeout(function(){
          $scope.hasParams = false;
          $state.params.msg = "";
          $scope.msg = null;
        }, 1000);
  };

  Songs.get(sharedProperties.getProperty()).then(function(result) {
    $scope.song = result;


    $scope.goYoutube = function() {
       if(!angular.isUndefinedOrNull(result.urlYouTube)) {
        $window.open(result.urlYouTube);
      } else {
        $state.go($state.$current, {msg: "This song doesn't have a valid URL."}, {reload: true})
      }
    };
    $scope.goSpotify = function() {
       if(!angular.isUndefinedOrNull(result.urlSpotify)) {
        $window.open(result.url);
      } else {
        $state.go($state.$current, {msg: "This song doesn't have a valid URL."}, {reload: true})
      }
    };
    $scope.goOthers = function() {
       if(!angular.isUndefinedOrNull(result.urlOther)) {
        $window.open(result.urlOther);
      } else {
        $state.go($state.$current, {msg: "This song doesn't have a valid URL."}, {reload: true})
      }
    };
  });

  $scope.addToSetlist = function(id) {
    $location.path('song/' + id + '/add');
  };

  $scope.back = function() {
    $location.path('tab/'+sharedProperties.getProperty()+'/landing');
  }

})

.controller('SongEditActionCtrl', function($scope, $stateParams, Songs, sharedProperties, $location) {
  $scope.song = Songs.get(sharedProperties.getProperty());

  $scope.go = function(id) {
    $location.path('song-edit/' + id + '/sheet-music');
  }
})

.controller('SongCtrl', function($scope, sharedProperties) {
  $scope.sharedProperty = sharedProperties.getProperty();
  console.log(sharedProperties.getProperty());
})

.controller('SetlistCtrl', function($scope, sharedProperties2) {
  $scope.sharedProperty = sharedProperties2.getProperty();
  $scope.setProperty = sharedProperties2.setProperty;
})

.controller('SongEditCtrl', function($scope, sharedProperties, Songs, $state, $timeout) {

  //TEST OK
  Songs.get(sharedProperties.getProperty()).then(function(result) {

    $scope.song = result;

    $scope.model = { title: '' };
    $scope.form = {};

    $scope.model.title = result.title;
    $scope.model.artist = result.artist;
    $scope.model.albumName = result.albumName;
    $scope.model.key = result.key;
    $scope.model.bpm = result.bpm;
    $scope.model.albumArt = result.albumArt;
    $scope.model.youtube = result.urlYouTube;
    $scope.model.spotify = result.urlSpotify;
    $scope.model.others = result.urlOther;

    $scope.saveEditSong = function() {
        var  info = new Object();
        if($scope.model.title != null) { info.title = $scope.model.title; };
        if($scope.model.artist != null) { info.artist = $scope.model.artist; };
        if($scope.model.albumName != null) { info.albumName = $scope.model.albumName; };
        if($scope.model.key != null) { info.key = $scope.model.key; };
        if($scope.model.bpm != null) { info.bpm = $scope.model.bpm; };
        if($scope.model.albumArt != null) { info.albumArt = $scope.model.albumArt; };
        if($scope.model.youtube != null) { info.urlYouTube = $scope.model.youtube; };
        if($scope.model.spotify != null) { info.urlSpotify = $scope.model.spotify; };
        if($scope.model.others != null) { info.urlOther = $scope.model.others; };

        saveEditSong(sharedProperties.getProperty(), info, result);
        Songs.get(sharedProperties.getProperty()).then(function(){
          $state.go('song.song-info', {msg:  $scope.model.title + " edited."}, {reload: true});
        });
    };
  });
})

//TESTING
.controller('SongAddToSetlistCtrl', function($scope, sharedProperties, Setlists, $location, $state, $stateParams, Songs) {

  Setlists.active().then(function(result) {
    $scope.setlists = result.docs;
  });
  $scope.addTo = function(setlist) {
      Setlists.get(setlist._id).then(function(result) {
        var songs = result.songs;
            if(songs.indexOf($stateParams.songId) == -1) {
              songs.push($stateParams.songId);
            } else {
              console.log('Song is already in setlist.')
              $state.go('tab.setlists-items', {msg:  "Song is already in setlist."}, {});
            }
            addSongToSetlist(songs, setlist._id, setlist);
            $state.go('tab.songs', {msg:  "Song added to setlist."}, {reload: true});
      });
  }
})

.controller('SetlistActionCtrl', function($scope, $stateParams, Setlists, sharedProperties2, $location) {
  Setlists.get($stateParams.setlistId).then(function(result) {
    console.log($stateParams);
    console.log(result);

    $scope.setlist = result;
    $scope.title = result.title;

  });

  $scope.viewDetails = function() {
     $location.path('setlist/setlists/' + sharedProperties2.getProperty() + '/roles');
  }
  $scope.deleteItem = function() {
    deleteSetlist(id);
    $location.path('tab/setlists');
  }

  $scope.practice = function(){
    var pin = pinSetlist(sharedProperties2.getProperty());
    $location.path('tab/practice');
  }

  $scope.editRoles = function() {
   $location.path('setlist/setlists/' + id + '/edit')
  }

  $scope.back = function() {
    $location.path('tab/setlists');
  };

  $scope.sendEmail = function() {
    var title = getSetlist(sharedProperties2.getProperty()).setlistName;
    var content = "Hello, you have been assigned a role in " + title + ". Please check the setlist information in your Songlisterr application.";
    var roles = JSON.parse($scope.setlists.setlistRoles);
    var arr = [];
    for(var x in roles){
      arr.push(roles[x].roleEmail);
    }

    console.log(arr);
    sendMail(content, arr);
  };


})

.controller('SetlistDetailsCtrl', function($scope, $stateParams, Setlists, $location, $state, sharedProperties2) {
  console.log($stateParams);
  Setlists.get($stateParams.setlistId).then(function(result) {
    $scope.setlist = result;
  })

  $scope.back = function() {
    $location.path('tab/setlists');
  };

  $scope.editBandRoles = function(id) {
      $location.path('setlist-edit/setlists/'+ sharedProperties2.getProperty() +'/edit-setlist');
  }
})

.controller('EditSetlistDetailsCtrl', function($scope, Setlists, $location, $stateParams, $state, sharedProperties2, Users) {
   $scope.setlists = Setlists.get( sharedProperties2.getProperty() );
   $scope.back = function() {
    $location.path('setlist/setlists/' + sharedProperties2.getProperty() +'/info');
   };
   var setlist = Setlists.get( sharedProperties2.getProperty() );
   var id = Setlists.get(sharedProperties2.getProperty()).setlistId;

          $scope.model = { name: '' };
          $scope.form = {};

          $scope.model.name = setlist.setlistName;
          $scope.model.spotify = setlist.setlistSpotify;
          $scope.model.notes = setlist.setlistNotes;

     $scope.verify = function() {
         $scope.req = $scope.form.newSetlist.$invalid;
         if($scope.form.newSetlist.$valid == true) {
             var info = new Object();
                 info.name = $scope.model.name;

                 if(!angular.isUndefinedOrNull($scope.model.spotify)) {
                   info.spotify = $scope.model.spotify;
                 } else {
                   info.spotify = "";
                 }
                 if(!angular.isUndefinedOrNull($scope.model.notes)) {
                   info.notes = $scope.model.notes;
                 } else {
                   info.notes = "";
                 }

              saveEditedSetlist(info, id);
              $location.path('setlist/setlists/' + id + '/info');
         } else if ($scope.form.newSetlist.$pristine == true) {
            $location.path('tab/setlists');
         }
     }
})

.controller('EditRolesCtrl', function($scope, Setlists, $location, $stateParams, $state, sharedProperties2, Users, Roles) {
   $scope.setlists = Setlists.get( sharedProperties2.getProperty() );
   var id = Setlists.get(sharedProperties2.getProperty()).setlistId;

          $scope.model = { roleName: '' };
          $scope.form = {};

           $scope.users = Users.all();
           $scope.roles = Roles.all();

     $scope.verify = function() {
         $scope.req = $scope.form.newSetlist.$invalid;
         if($scope.form.newSetlist.$valid == true) {
             var info = new Object();
                info.roleName = $scope.model.roleName;
                info.roleUser = $scope.model.roleUser;

              var test = Users.getemail($scope.model.roleUser);
              console.log("roleEmail: "+test);
                info.roleEmail = test.email;

              saveEditedRoles(info, id);
              $location.path('setlist/setlists/' + id + '/info');
         }
     }

    $scope.back = function() {
      $location.path('setlist/setlists/' + sharedProperties2.getProperty() + '/info');
    };

    $scope.addAssignment = function() {
      $location.path('setlist-edit/setlists/'+sharedProperties2.getProperty()+'/roles/add');
    }
})

.controller('SearchCtrl', function($scope, Songs, Setlists, $location, $stateParams, sharedProperties, sharedProperties2, $state, $ionicScrollDelegate ) {

    var type = "song";
    $scope.val = true;

    $scope.isActiveOne = true;

    $scope.activateOne = function(){
        $scope.isActiveOne = true;
        $scope.isActiveTwo = false;
        $scope.isActiveThree = false;
        $scope.isActiveFour = false;
        $scope.isActiveFive = false;

        type = "song";
        $scope.val = true;
    }
    $scope.activateTwo = function(){
        $scope.isActiveOne = false;
        $scope.isActiveTwo = true;
        $scope.isActiveThree = false;
        $scope.isActiveFour = false;
        $scope.isActiveFive = false;

        type = "artist";
        $scope.val = true;
    }
    $scope.activateThree = function(){
        $scope.isActiveOne = false;
        $scope.isActiveTwo = false;
        $scope.isActiveThree = true;
        $scope.isActiveFour = false;
        $scope.isActiveFive = false;

        type = "album";
        $scope.val = true;
    }
    $scope.activateFour = function(){
        $scope.isActiveOne = false;
        $scope.isActiveTwo = false;
        $scope.isActiveThree = false;
        $scope.isActiveFour = true;
        $scope.isActiveFive = false;

        type = "setlist";
        $scope.val = false;
    }
    $scope.activateFive = function(){
        $scope.isActiveOne = false;
        $scope.isActiveTwo = false;
        $scope.isActiveThree = false;
        $scope.isActiveFour = false;
        $scope.isActiveFive = true;

        type = "all";
    }

          $scope.model = { query: '' };
          $scope.form = {};

   $scope.search = function() {
        var string = $scope.model.query;
        console.log(type + " / " + string);

        switch (type) {
          case 'song':
            Songs.search(string.toLowerCase()).then(function(result) {
                $scope.songs = result.rows;
            });
          break;
          case 'artist':
            var songs = [];
            Songs.search('').then(function(result) {
              (result.rows).forEach(function(song){
                var regEx = new RegExp(string, 'gi');
                if( (song.doc.artist).match(regEx) ) {
                  songs.push(song);
                }
              })
              $scope.songs = songs;
            });
          break;
          case 'album':
            Songs.search('').then(function(result) {
              (result.rows).forEach(function(song){
                var regEx = new RegExp(string, 'gi');
                if( (song.doc.album).match(regEx) ) {
                  songs.push(song);
                }
              })
              $scope.songs = songs;
            });
          break;
          case 'setlist':
            Setlists.search(string.toLowerCase()).then(function(result) {
              $scope.setlists = result.rows;
            });
          break;
          // case 'song':
          //   Songs.search(string.toLowerCase()).then(function(result) {
          //       $scope.songs = result;
          //   });
          // break;
        }
   }

   $scope.goSong = function(song) {
      console.log(song.id);
        sharedProperties.setProperty(song.id);
        $location.path('tab/' + song.id + '/landing');
   }

   $scope.goSetlist = function(setlist) {
        sharedProperties2.setProperty(setlist.id);
        $location.path('tab/setlists/' + setlist.id + '/items');
   }

   $scope.delete = function(id) {
       deleteItem(id);
       $state.reload();
   }

    $scope.addToSetlist = function(song) {
        $location.path('song/' + song.id + '/add');
    };
})

.controller('PracticeCtrl', function($scope, Songs, Setlists, $location, $stateParams, sharedProperties, $state, $window) {

   var user = 'user_jilles';

   Setlists.pinned(user).then(function(result) {
     Setlists.get(result.pinned).then(function(result) {

       var songs = [];
       angular.forEach(result.songs, function(song){
           Songs.get(song).then(function(songContent) {
             songs.push(songContent);
           });
       });
       $scope.songs = songs;
       $scope.isPinned = true;
        if(songs.length < 1) $scope.isPinned = false;
     });
   });

    $scope.go = function(song) {
        console.log(song._id);
        sharedProperties.setProperty(song._id);
        $location.path('/tab/' + song._id +'/landing');
    }

    $scope.addToSetlist = function(song) {
      $location.path('song/' + song._id + '/add');
    }

    $scope.go = function(song) {
        sharedProperties.setProperty(song._id);
        $location.path('/tab/' + song._id +'/landing');
    }

})

.controller('SheetMusicCtrl', function($scope, sharedProperties, Songs, $state, $stateParams) {

  Songs.get(sharedProperties.getProperty()).then(function(result) {
    $scope.song = result;
    $scope.model = { sheet: '' };
    $scope.form = {};
    $scope.model.sheet = result.sheet;

    $scope.verify = function() {
      var  info = $scope.model.sheet;
           info = processSheetMusic(info, result._id, result);
      Songs.get(sharedProperties.getProperty()).then(function(){
          $state.go('tab.song-landing', {msg:  $scope.model.title + " edited."}, {reload: true});
        });
    };
  });

  // $scope.back = function() {
  //   $location.path('song-edit/' + sharedProperties.getProperty() + '/edit-action');
  // }

})

.controller('SetlistRolesCtrl', function($scope, $stateParams, Setlists, sharedProperties2, $location) {
  $scope.setlist = Setlists.get(sharedProperties2.getProperty());

  $scope.back = function() {
    $location.path('setlist/setlists/'+ sharedProperties2.getProperty() +'/action')
  };
  $scope.editRoles = function() {
    $location.path('setlist-edit/setlists/'+sharedProperties2.getProperty()+'/roles/edit');
  }

  var roles = JSON.parse($scope.setlist.setlistRoles);
  var arr = [];
  for(var x in roles){
    arr.push(roles[x]);
  }

  $scope.roles = arr;
})

.controller('SetlistEditCtrl', function($scope, sharedProperties2, Setlists) {
  $scope.sharedProperty2 = sharedProperties2.getProperty();
})

.controller('SetlistEditActionCtrl', function($scope, sharedProperties2, Setlists, $location) {
  $scope.setlist = Setlists.get(sharedProperties2.getProperty());
  $scope.go = function() {
    $location.path('setlist-edit/setlists/'+sharedProperties2.getProperty()+'/roles/edit');
  }
  $scope.back = function() {
    $location.path('setlist/setlists/' + sharedProperties2.getProperty() + 'info');
  }
})

.controller('ProfileCtrl', function($scope, sharedProperties, Users, $location, $state, $stateParams) {

  $scope.profileUser =Users.data();
  var userid= $scope.profileUser.userId

  $scope.editProfileRoles = function() {
  console.log("clicky");
     $location.path('tab/profile-edit');
  }
})

.controller('ProfileEditCtrl', function($scope, sharedProperties, Users, $location, $state, $stateParams) {
    $scope.profileUser =Users.data();
    var profileid = Users.data().objectId

    $scope.model = { email: '' };
    $scope.form = {};

    $scope.saveEditProfile = function() {
        var  info = new Object();
             info.email = $scope.model.email;
             info.bandrole = $scope.model.bandrole;


        editProfileRoles(profileid, info);
        $location.path('tab/profile');
    };

    $scope.back = function() {
      $location.path('tab/profile');
    };
})

.controller('AddRolesCtrl', function($scope, sharedProperties2, Roles, $location, $state, $stateParams) {
  $scope.back = function() {
    $location.path('setlist-edit/setlists/'+ sharedProperties2.getProperty() +'/roles/edit');
  }

    $scope.model = { roleName: '' };
    $scope.form = {};

  $scope.verify = function() {
     var  info =  $scope.model.roleName;
          info = addRole(info);
    $location.path('setlist-edit/setlists/'+ sharedProperties2.getProperty() +'/roles/edit');
  }

})

//TABS CONTROLLERS

.controller('SongTabsCtrl', function($scope, sharedProperties2, Roles, $location, $state, $stateParams) {
  $scope.goTo = function(location) {
    switch (location) {
      case "songInfo":
        $state.go('song.song-info', {msg:null}, {});
      break;
      case "songAction":
       $state.go('song.song-action', {}, {});
      break;
      default:
      break;
    }
  }
})

.controller('MainTabsCtrl', function($scope, sharedProperties2, Roles, $location, $state, $stateParams) {
  $scope.goTo = function(location) {
    switch (location) {
      case "search":
        $state.go('tab.search', {msg:null, $stateParams}, {});
        break;
      case "songs":
        $state.go('tab.songs', {msg:null, $stateParams}, {});
        break;
      case "pinned":
        $state.go('tab.practice', {msg:null, $stateParams}, {});
        break;
      case "setlists":
        $state.go('tab.setlists', {msg:null, $stateParams}, {});
        break;
      default:
      break;
    }
  }
})
