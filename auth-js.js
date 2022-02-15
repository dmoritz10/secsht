

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
  // prompt for user Name
  var userName = await prompt("User Name", "text");

  // var userName = 'dmoritz10'

  var rtn = await getSSId(userName);

  if (rtn.fileId) {spreadsheetId = rtn.fileId}
  else {$('#authSigninStatus').html(rtn.msg);return}

  var ui = await initialUI();

  var x = arrOptions.shtList
  var t = "The quick brown fox jumped over the lazy dog"
        
  if (x == t) {
    var pwd = await prompt("Password has not be setup.  Enter Password", "password");
    var pdrcnfrm = await prompt("Confirm Password", "password");
    if (pwd != pdrcnfrm) {
      var confirmOK = await confirm("Passwords don't match.")
      return
    }
    var encPwd = await encryptMessage(t, pwd)

    console.log('enPwd', encPwd)
    await updateOption('shtList', encPwd)
    x = encPwd
  } else {
    // var pwd = await prompt("Enter Password", "password");
  }

var pwd = 'tempdm10'

  var dx = await decryptMessage(x, pwd)

  console.log('x', x)
  console.log('dx', dx)
  console.log('t', t)
  console.log(dx == t)

  if (dx != t) {await confirm("Invalid password");return}

  currUser.usr = userName
  currUser.pwd = pwd

console.log('pre loadsheets')

  await loadSheets()

console.log('post loadsheets')

  goHome()

console.log('post  goHome')


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
