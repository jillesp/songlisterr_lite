var db = new PouchDB('testDB');
// db.plugin(require('pouchdb-find'));

angular.module('songDroid', ['ionic', 'ionic.cloud', 'pouchdb', 'angular-md5', 'ngSanitize', 'ngCookies', 'hmTouchEvents','songDroid.controllers', 'songDroid.services'])

.config(function($ionicConfigProvider) {
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.navBar.alignTitle('center');
    $ionicConfigProvider.views.maxCache(0);

})

.run(function($ionicPlatform) {
    $ionicCloudProvider.init({
        "core": {
            "app_id": "7efcfbf1"
        }
    });
    $ionicPlatform.ready(function() {
        if (window.StatusBar) {
          StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

    .state('login', {
        url: "/login",
        templateUrl: "templates/login.html",
        controller: 'LoginCtrl'
    })

    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    controller: 'MainTabsCtrl'
    })

        .state('tab.search', {
            url: '/search',
            cache: false,
            views: {
                'search': {
                    templateUrl: 'templates/search.html',
                    controller: 'SearchCtrl'
                }
            }
        })

        .state('tab.songs', {
            url: '/browse',
            cache: false,
            views: {
                'songs': {
                    templateUrl: 'templates/browse.html',
                    controller: 'BrowseCtrl'
                }
            },
            params:{msg:null}
        })

            .state('tab.new-song', {
                url: '/browse/new',
                cache: false,
                views: {
                    'songs': {
                        templateUrl: 'templates/new-song.html',
                        controller: 'AddSongCtrl'
                    }
                }
            })

            .state('tab.song-landing', {
                url: '/:songId/landing',
                cache: false,
                views: {
                    'songs': {
                        templateUrl: 'templates/song-landing.html',
                        controller: 'SongLandingCtrl'
                    }
                },
                params: {msg:null}
            })

                .state('song', {
                    url: "/song",
                    abstract: true,
                    cache: false,
                    templateUrl: "templates/song.html",
                    controller: 'SongTabsCtrl'
                })

                    .state('song.song-info', {
                        url: '/:songId/info',
                        cache: false,
                            views: {
                            'song-info': {
                                templateUrl: 'templates/song-info.html',
                                controller: 'SongInfoCtrl'
                            }
                        },
                        params:{msg:null}
                    })

                    .state('song.song-action', {
                        url: '/:songId/action',
                        cache: false,
                            views: {
                            'song-action': {
                                templateUrl: 'templates/song-action.html',
                                controller: 'SongActionCtrl'
                            }
                        },
                        params:{msg:null}
                    })

                    .state('song.song-setlist', {
                        url: '/:songId/add',
                        cache: false,
                        views: {
                            'song-action': {
                                templateUrl: 'templates/add-to-setlist.html',
                                controller: 'SongAddToSetlistCtrl'
                            }
                        },
                        params: {msg:null}
                    })

                .state('song-edit', {
                    url: "/song-edit",
                    abstract: true,
                    cache: false,
                    templateUrl: "templates/song-edit.html"
                })

                    .state('song-edit.edit-info', {
                        url: '/:songId/edit-info',
                        cache: false,
                        views: {
                            'edit-info': {
                                templateUrl: 'templates/edit-song.html',
                                controller: 'SongEditCtrl'
                            }
                        },
                        params:{msg:null}
                    })

                    .state('song-edit.edit-action', {
                        url: '/:songId/edit-action',
                        cache: false,
                        views: {
                            'edit-action': {
                                templateUrl: 'templates/edit-action.html',
                                controller: 'SongEditActionCtrl'
                            }
                        }
                    })

                        .state('song-edit.sheet-music', {
                            url: '/:songId/sheet-music',
                            cache: false,
                            views: {
                                'edit-action': {
                                    templateUrl: 'templates/sheet-music.html',
                                    controller: 'SheetMusicCtrl'
                                }
                            }
                        })

        .state('tab.practice', {
            url: '/practice',
            cache: false,
            views: {
                    'practice': {
                        templateUrl: 'templates/practice.html',
                        controller: 'PracticeCtrl'
                    }
                }
        })

        .state('tab.setlists', {
            url: '/setlists',
            cache: false,
            views: {
                'setlists': {
                  templateUrl: 'templates/setlists.html',
                  controller: 'SetlistsCtrl'
                }
            },
            params: {msg:null}
        })
            .state('tab.setlist-new', {
                url: '/setlists/new',
                cache: false,
                views: {
                    'setlists': {
                        templateUrl: 'templates/new-setlist.html',
                        controller: 'AddSetlistCtrl'
                    }
                }
            })

            .state('tab.setlists-items', {
                url: '/setlists/:setlistId/items',
                cache: false,
                views: {
                    'setlists': {
                        templateUrl: 'templates/setlist-items.html',
                        controller: 'SetlistItemsCtrl'
                    }
                },
                params: {msg:true}
            })

            .state('setlist', {
                url: "/setlist",
                abstract: true,
                cache: false,
                templateUrl: "templates/setlist.html"
            })

                .state('setlist.setlists-actions', {
                    url: '/setlists/:setlistId/action',
                    views: {
                        'setlist-action': {
                            templateUrl: 'templates/setlist-action.html',
                            controller: 'SetlistActionCtrl'
                        }
                    }
                })

                .state('setlist.setlists-details', {
                    url: '/setlists/:setlistId/info',
                    cache: false,
                    views: {
                        'setlist-details': {
                            templateUrl: 'templates/setlist-details.html',
                            controller: 'SetlistDetailsCtrl'
                        }
                    }
                })

                .state('setlist.setlists-roles', {
                    url: '/setlists/:setlistId/roles',
                    cache: false,
                    views: {
                        'setlist-action': {
                            templateUrl: 'templates/setlist-roles.html',
                            controller: 'SetlistRolesCtrl'
                        }
                    }
                })

            .state('setlist-edit', {
                url: "/setlist-edit",
                abstract: true,
                cache: false,
                templateUrl: "templates/setlist-edit.html"
            })

                .state('setlist-edit.setlists-actions-edit', {
                    url: '/setlists/:setlistId/actions/edit',
                    cache: false,
                    views: {
                        'edit-action': {
                            templateUrl: 'templates/setlist-edit-action.html',
                            controller: 'SetlistEditActionCtrl'
                        }
                    }
                })

                .state('setlist-edit.setlists-roles-edit', {
                    url: '/setlists/:setlistId/roles/edit',
                    cache: false,
                    views: {
                        'edit-action': {
                            templateUrl: 'templates/edit-roles.html',
                            controller: 'EditRolesCtrl'
                        }
                    }
                })

                .state('setlist-edit.setlists-roles-add', {
                    url: '/setlists/:setlistId/roles/add',
                    cache: false,
                    views: {
                        'edit-action': {
                            templateUrl: 'templates/new-role.html',
                            controller: 'AddRolesCtrl'
                        }
                    }
                })

                .state('setlist-edit.setlists-details-edit', {
                    url: '/setlists/:setlistId/edit-setlist',
                    cache: false,
                    views: {
                        'edit-info': {
                            templateUrl: 'templates/edit-setlist.html',
                            controller: 'EditSetlistDetailsCtrl'
                        }
                    }
                })

        .state('tab.profile', {
            url: '/profile',
            cache: false,
            views: {
                'profile': {
                    templateUrl: 'templates/profile.html',
                    controller: 'ProfileCtrl'
                }
            }
        })

            .state('tab.profile-edit', {
                url: '/profile-edit',
                cache: false,
                views: {
                    'profile': {
                        templateUrl: 'templates/profile-edit.html',
                        controller: 'ProfileEditCtrl'
                    }
                }
            })

  $urlRouterProvider.otherwise('login');
});
