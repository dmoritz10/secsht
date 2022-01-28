

function btnAuthHtml(event) {

    // handleAuthClick();
    gapi.auth2.getAuthInstance().signIn();
    
}
    
function btnSignoutHtml(event) {
  gapi.auth2.getAuthInstance().signOut();
    // signin.handleSignoutClick();
    currUser = {}
    showAuth()
    gotoTab('Auth')
}

function showAuth() {

  $('#secshtLogin').addClass('d-none')
  $('#secshtAuth').removeClass('d-none')

}
      
function showLogin() {

  $('#secshtAuth').addClass('d-none')
  $('#secshtLogin').removeClass('d-none')

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

  loadSheets()

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
async function encryptMessage(msg, password) {

  const encoder = new TextEncoder();

const toBase64 = buffer =>
  btoa(String.fromCharCode(...new Uint8Array(buffer)));

const PBKDF2 = async (
  password, salt, iterations,
  length, hash, algorithm =  'AES-CBC') => {

  keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    {name: 'PBKDF2'},
    false,
    ['deriveKey']
  );


  return await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations,
        hash
      },
      keyMaterial,
      { name: algorithm, length },
      false, // we don't need to export our key!!!
      ['encrypt', 'decrypt']
    );
}


const salt = window.crypto.getRandomValues(new Uint8Array(16));
const iv = window.crypto.getRandomValues(new Uint8Array(16));
const plain_text = encoder.encode(msg);
const key = await PBKDF2(password, salt, 100000, 256, 'SHA-256');

const encrypted = await window.crypto.subtle.encrypt(
  {name: "AES-CBC", iv },
  key,
  plain_text
);

var ciphertext = toBase64([
  ...salt,
  ...iv,
  ...new Uint8Array(encrypted)
])

console.log({
  salt: toBase64(salt),
  iv: toBase64(iv),
  encrypted: toBase64(encrypted),
  concatennated: ciphertext
});

return ciphertext

}

async function decryptMessage(password, ciphertext){

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  
  const fromBase64 = buffer =>
    Uint8Array.from(atob(buffer), c => c.charCodeAt(0));
  
  const PBKDF2 = async (
    password, salt, iterations,
    length, hash, algorithm =  'AES-CBC') => {
  
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      {name: 'PBKDF2'},
      false,
      ['deriveKey']
    );
    return await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode(salt),
        iterations,
        hash
      },
      keyMaterial,
      { name: algorithm, length },
      false, // we don't need to export our key!!!
      ['encrypt', 'decrypt']
    );
  };
  
  
  const salt_len = iv_len = 16;
  
  const encrypted = fromBase64(ciphertext);
  
  const salt = encrypted.slice(0, salt_len);
  const iv = encrypted.slice(0+salt_len, salt_len+iv_len);
  const key = await PBKDF2(password, salt, 100000, 256, 'SHA-256');
  
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    key,
    encrypted.slice(salt_len + iv_len)
    )
    .then(function(decrypted) {
      console.log('deecrypted', decoder.decode(decrypted));
      return decoder.decode(decrypted);
    })
    .catch(function(err) {
      console.log(err)
      console.error(err);
      return err
    });

    return decrypted

}

function decryptArr(pwd, msg) {

  var rtn = []

  if (is2dArray(msg)) {

    for (var i=0; i<msg[0].length; i++) {
      var r = msg[i]
      var row = []
      for (var j=0; j<r.length; j++) {
        row.push(r[j])
      } 
    rtn.push(row)
    }

  } else {

    for (var i=0; i<msg.length; i++) {
      rtn.push(msg[i])
    }

  }

  return msg

}