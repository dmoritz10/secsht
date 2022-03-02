

function btnAuthHtml(event) {

    // handleAuthClick();
    gapi.auth2.getAuthInstance().signIn();
    signin.updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

    
}
    
function btnSignoutHtml(event) {
  gapi.auth2.getAuthInstance().signOut();
    // signin.handleSignoutClick();
    currUser = {}
    gotoTab('Auth')
}
      
async function showLogin() {

  var login = bootbox.confirm({
    message: $(".login-form").html(),
    title: "Login",
    closeButton: false,
    centerVertical: true,
    buttons: [
      {
        label: "Confirm",
        className: "btn btn-primary pull-left",
        callback: async function(result) {

       
         
          var usr = $('#liUser', '.form').val()
          var pwd = $('#liPassword', '.form').val()
          
          console.log('usr', usr);
          console.log('pwd', pwd);
          
          var rtn = await getSSId(usr)
          
          if (rtn.fileId) {spreadsheetId = rtn.fileId}
          else {$('#authSigninStatus').html(rtn.msg);return}
        
          var ui = await initialUI();

          var dx = await decryptMessage(x, pwd)
          var t = "The quick brown fox jumped over the lazy dog"
          if (dx != t) {await confirm("Invalid password");return}
        
          currUser.usr = userName
          currUser.pwd = pwd

          await loadSheets()

          console.log('post loadsheets')

          goHome()    

        }
      },
      {
        label: "Cancel",
        className: "btn btn-default pull-left",
        callback: function() {
          alert('Cancel')
          login.modal("hide");
        }
      }
    ],
    show: false,
    onEscape: function() {
      login.modal("hide");
    }
  });

  login.modal("show");

}


async function btnAuthLoginHtml(user, pwd) {

  currUser.usr = $('#authUserName').val()
  currUser.pwd = $('#authPwd').val()

  $('#authUserName').val('')
  $('#authPwd').val('')


  var rtn = await getSSId(currUser.usr);

  if (rtn.fileId) {spreadsheetId = rtn.fileId}
  else {$('#authSigninStatus').html(rtn.msg);return}
  
  var ui = await initialUI();

  console.log(ui)

  if (ui.status != 0) return ui

  await loadSheets()

  goHome()

}
      
async function btnEncryptHtml(event) {

  var msg = await prompt("Text to be encoded", "textarea");

  var key = await prompt("Password", "password");


  var encryptMsg = await encryptMessage(msg, key)

  
console.log('encryptMsg', encryptMsg)

}


async function btnDecryptHtml(event) {


  var key = "cTeetime101"

  var encryptMsg = await decryptMessage(key)
  console.log('decryptMsg')
    
}

