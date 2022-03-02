

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

  $("#login-form")[0].reset();
  $("#login-modal").modal('show');

}

async function submitLogin() {

  var cfrmPwdMode = !$("#liDisplayConfirmPassword").hasClass('d-none')
  $('#liMsg').html("")

  var usr = $('#liUser').val()
  var pwd = $('#liPassword').val()
  var pwdCfrm = cfrmPwdMode ? $('#liConfirmPassword').val() : null

  var t = "The quick brown fox jumped over the lazy dog"


  if (cfrmPwdMode && pwd != pwdCfrm) {
    $('#liMsg').html("Passwords do not match")
    return
  } else {

    var encPwd = await encryptMessage(t, pwd)
    await updateOption('shtList', encPwd)

  }
  
  var rtn = await getSSId(usr)
  
  if (rtn.fileId) {spreadsheetId = rtn.fileId}
  else {
    console.log('get file id', rtn.msg)
    $('#liMsg').html('Invalid Login');
    return
  }

  var ui = await initialUI();
  var x = arrOptions.shtList
  
  if (x == t  && cfrmPwdMode) {
    $("#liDisplayConfirmPassword").removeClass('d-none')
    $('#liMsg').html("Confirm password")
    return
  }
  
  var dx = await decryptMessage(x, pwd)
  if (dx != t) {
    $('#liMsg').html("Invalid Login")
    return
  }

  currUser.pwd = pwd

  await loadSheets()

  $("#login-modal").modal('hide');

  console.log('post loadsheets')

  goHome()    


}
