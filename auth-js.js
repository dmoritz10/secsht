

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

  currUser.usr = usr
  currUser.pwd = pwd

  await loadSheets()

  $("#login-modal").modal('hide');

  console.log('post loadsheets')

  goHome()    


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

