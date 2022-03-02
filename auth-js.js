

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
  $('#liMsg').html("&nbsp;")
  $("#login-modal").modal('show');

}

async function submitLogin() {

  var cfrmPwdMode = !$("#liDisplayConfirmPassword").hasClass('d-none')
  $('#liMsg').html("&nbsp;")

  var usr = $('#liUser').val()
  var pwd = $('#liPassword').val()
  var pwdCfrm = $('#liConfirmPassword').val()


  var rtn = await getSSId(usr)
  
  if (rtn.fileId) {spreadsheetId = rtn.fileId}
  else {
    console.log('get file id', rtn.msg)
    $('#liMsg').html('Invalid Login 1');
    return
  }

  var ui = await initialUI();
  var x = arrOptions.shtList

  var t = "The quick brown fox jumped over the lazy dog"

  if (x == t && !cfrmPwdMode) {
    $("#liDisplayConfirmPassword").removeClass('d-none')
    $('#liMsg').html("Confirm password")
    return
  }

  if (cfrmPwdMode && pwd != pwdCfrm && pwd !='') {
    $('#liMsg').html("Passwords do not match")
    return
  } 
  
  var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
  if (strongRegex.test(pwd)) {
    $('#liMsg').html("Password must contain 8 or more characters")
    return
  } 

  if (cfrmPwdMode) {
    var encPwd = await encryptMessage(t, pwd)
    await updateOption('shtList', encPwd)
    var x = arrOptions.shtList
  }

  var dx = await decryptMessage(x, pwd)
  if (dx != t) {
    $('#liMsg').html("Invalid Login 2")
    return
  }


  currUser.pwd = pwd

  await loadSheets()

  $("#login-modal").modal('hide');
  $("#liDisplayConfirmPassword").addClass('d-none')

  console.log('post loadsheets')

  goHome()    


}
