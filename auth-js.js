

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
      
function showLogin() {

  $("#login-modal").modal('show');

}

async function submitLogin() {

  var usr = $('#liUser').val()
  var pwd = $('#liPassword').val()
  
  console.log('usr', usr);
  console.log('pwd', pwd);
  
  var rtn = await getSSId(usr)
  
  if (rtn.fileId) {spreadsheetId = rtn.fileId}
  else {$('#authSigninStatus').html(rtn.msg);return}

  var ui = await initialUI();
  var x = arrOptions.shtList
  var dx = await decryptMessage(x, pwd)
  var t = "The quick brown fox jumped over the lazy dog"
  if (dx != t) {await confirm("Invalid password");return}

  currUser.pwd = pwd

  await loadSheets()

  $("#login-modal").modal('hide');

  console.log('post loadsheets')

  goHome()    


}
