
	// Global variables

    var scriptVersion = "Version 193 on Mar 17, 12:05 PM"

    var spreadsheetId

    var secSht = {}

    var currUser = {}

    var shtHdrs
    var shtVals
    var shtTitle
    var shtId
  
    var suSht = null
    var arrOptions
    var optionsIdx
  
    var timerStart
 

/*global jQuery */
jQuery(function ($) {
	// 'use strict';


    var signin =  {

        currUser : {},

        API_KEY : 'AIzaSyBG5YxMTiBdvxD5-xxVp0LA1M8IXz8Xtbo',  // TODO: Update placeholder with desired API key.

        CLIENT_ID : '764306262696-esbdj8daoee741d44fdhrh5fehjtjjm5.apps.googleusercontent.com',  // TODO: Update placeholder with desired client ID.

        SCOPES : "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.metadata.readonly",

        DISCOVERY_DOCS : ["https://sheets.googleapis.com/$discovery/rest?version=v4", 
                           "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],

        /**
         *  On load, called to load the auth2 library and API client library.
         */
        handleClientLoad: function() {
            gapi.load('client:auth2', this.initClient);
            console.log('initClient')
        },


        /**
         *  Initializes the API client library and sets up sign-in state
         *  listeners.
         */
        initClient: async function () {

            console.log('initClient start')

            1 == 1
        
            await gapi.client.init({
                apiKey:                 signin.API_KEY,
                clientId:               signin.CLIENT_ID,
                discoveryDocs:          signin.DISCOVERY_DOCS,
                fetch_basic_profile:    true,
                scope:                  signin.SCOPES

            }).then(function () {
                // Listen for sign-in state changes.

                console.log('initClient then')
                console.log(this)

                gapi.auth2.getAuthInstance().isSignedIn.listen(signin.updateSigninStatus);

                // Handle the initial sign-in state.
                signin.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

            }, function(error) {
                console.log(JSON.stringify(error, null, 2));
            });

            console.log("initClient end")
        
        },

        /**
         *  Called when the signed in status changes, to update the UI
         *  appropriately. After a sign-in, the API is called.
         */
        updateSigninStatus: async function  (isSignedIn) {

            if (isSignedIn) { 

                console.log('signed in')

                var currUserObj = await gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();

                signin.currUser['email']     = currUserObj.getEmail()
                signin.currUser['firstName'] = currUserObj.getGivenName()
                signin.currUser['lastName']  = currUserObj.getFamilyName()
                signin.currUser['fullName']  = currUserObj.getName()
                signin.currUser['emailName'] = signin.currUser['email'].split('@')[0]

                if (signin.currUser.firstName) {
                    $('#authSigninStatus').html('Hi ' + signin.currUser.firstName + '.<br>You are signed in.')
                } else {
                    $('#authSigninStatus').html('Hi ' + signin.currUser.emailName + '.<br>You are signed in.')
                }

                showLogin()

            } else {

                console.log('NOT signed in')

                showAuth()

                $('#authSigninStatus').html('You are signed out.  Authorization is required.')

                signin.currUser = {}

                gotoTab('Auth')
            }
        },

        /**
         *  Sign in the user upon button click.
         */
        handleAuthClick: function (event) {
        
            gapi.auth2.getAuthInstance().signIn();
        },

        /**
         *  Sign out the user upon button click.
         */
        handleSignoutClick: function (event) {
        
            gapi.auth2.getAuthInstance().signOut();
        }

    }


	var App = {

		init: function () {

			this.serviceWorker()
                console.log('serviceworker')

			signin.handleClientLoad()
                console.log('signin')

			this.bindEvents();
                console.log('bindEvents')

		},

        serviceWorker: function () {

            if ("serviceWorker" in navigator) {
                if (navigator.serviceWorker.controller) {
                  console.log("[PWA Builder] active service worker found, no need to register");
                } else {
                  // Register the service worker
                  navigator.serviceWorker
                    .register("pwabuilder-sw.js", {
                      scope: "./"
                    })
                    .then(function (reg) {
                      console.log("[PWA Builder] Service worker has been registered for scope: " + reg.scope);
                    })
                    .catch(function (err) {
                      console.log("[PWA Builder] Service worker registration failed: ", err)
                    });
                }
              }


        },

		bindEvents: function () {

            // Auth tab
          
            $('#btnAuth')                   .button().click(btnAuthHtml);
            $('#btnSignout')                .button().click(btnSignoutHtml);
            $('#btnAuthLogin')                .button().click(btnAuthLoginHtml);
            $('#btnAuthEncrypt')                .button().click(btnAuthEncryptHtml);
            $('#btnAuthDecrypt')                .button().click(btnAuthDecryptHtml);
         
            <button id="btnAuthLogin" class="btn btn-primary btn-lg btn-block" type="submit">Login</button>
 
            // Home tab
          
            // Sheets
            $('#btnShtSelect')            .click(btnShtSelectHtml);
            
            $('#shtSelectDropDown')        .on('show.bs.dropdown', function () {
                btnShtMoreVertHtml()
            })
            
            $('#btnShtAddProvider')   .click(btnAddSheetHtml);
            $('#btnShtmSubmit')       .button().click(btnShtmSubmitSheetHtml);
            $('#btnShtmDelete')       .click(btnDeleteSheetHtml);
            $('#btnEncrypt')       .click(btnEncryptHtml);
            $('#btnDecrypt')       .click(btnDecryptHtml);

            $("#shtSearch").on("input", function() {
                var value = $(this).val().toLowerCase();

                $("#shtContainer #shtProvider").filter(function() {
                  $(this).parent().parent().parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                
            });

          
            // All tabs
            $('.divfullscreen').click(function(){
              document.documentElement.requestFullscreen();
            });
          
            var whiteList = $.fn.tooltip.Constructor.Default.allowList
          
                whiteList.table = []
                whiteList.td = []
                whiteList.th = []
                whiteList.thead = []
                whiteList.tr = []
                whiteList.tbody = []
                whiteList.button = []
          
            setupFormValidation()
          
          
            $("#myToast").on("show.bs.toast", function() {
              $(this).removeClass("d-none");
                  })
          
            $("#myToast").on("hidden.bs.toast", function() {
              $(this).addClass("d-none");
                  })
          
          
            Date.prototype.toLocaleISOString = function() {
                const zOffsetMs = this.getTimezoneOffset() * 60 * 1000;
                const localTimeMs = this - zOffsetMs;
                const date = new Date(localTimeMs);
                const utcOffsetHr = this.getTimezoneOffset() / 60;
                const utcOffsetSign = utcOffsetHr <= 0 ? '+' : '-';
                const utcOffsetString = utcOffsetSign + (utcOffsetHr.toString.length == 1 ? `0${utcOffsetHr}` : `${utcOffsetHr}`) + ':00';
                return date.toISOString().replace('Z', utcOffsetString);
            };                 
		}
	};

    App.init();

    console.log('version 2')

});
