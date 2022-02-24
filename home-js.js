
async function loadSheets() {

    await checkAuth()

    var sheets = await gapi.client.sheets.spreadsheets.get({
        
        spreadsheetId: spreadsheetId
      
      }).then(function(response) {
        
        return response.result.sheets
      
      }, function(response) {
        console.log('Error: ' + response.result.error.message);
        return null
    
      });

    console.log('loadSheets', sheets)


    if (sheets) {

      var $tblSheets = $("#hmContainer > .d-none")

      var x = $tblSheets.clone();
      $("#hmContainer").empty();
      x.appendTo("#hmContainer");

      var nbrSheets = 0
      var nbrProviders = 0

    
      for (var j = 0; j < sheets.length; j++) {

        var sht = sheets[j].properties

        console.log('sht', sht)

        var ele = $tblSheets.clone();

        if (sht.gridProperties.columnCount == arrOptions['Nbr Columns per Sheet']) {

          var enc = await testEncrypted(sht.title)

          console.log('enc', enc)

          if (enc.secSht) {

            ele.find('#hmSheet')[0].innerHTML = sht.title

            if (enc.enc) {
              ele.find('#btnCrypt')[0].innerHTML = "decrypt"
              ele.find('#btnCrypt').addClass('btn-success')
              ele.find('#btnCrypt').removeClass('btn-danger')
              ele.find('#btnCrypt')[0].setAttribute("onclick", "decryptSheet('" + sht.title + "')");

            } else {
              ele.find('#btnCrypt')[0].innerHTML = "encrypt"
              ele.find('#btnCrypt').removeClass('btn-success')
              ele.find('#btnCrypt').addClass('btn-danger')
              ele.find('#btnCrypt')[0].setAttribute("onclick", "encryptSheet('" + sht.title + "')");
            }

            ele.find('#hmShowSheet')[0].setAttribute("onclick", "listSheet('" + sht.title + "')");

            ele.removeClass('d-none')

            ele.appendTo("#hmContainer");

            secSht[sht.title] = {
              id:   sht.sheetId,
              cols: sht.gridProperties.columnCount,
              rows: sht.gridProperties.rowCount,
              enc:  enc.enc
            }

            nbrSheets++
            nbrProviders += sht.gridProperties.rowCount

          }

        }
    
      }

      $('#hmNbrSheets').html(nbrSheets)
      $('#hmNbrProviders').html(nbrProviders)

      console.log('secSht', secSht)

      if (secSht.length == 0) toast("There are no Secure Sheets to display")

    }

}

function updateHomePage(ele) {

  

  console.log('ele', ele)




  // ele.find('#btnCrypt')[0].setAttribute("onclick", "decryptSheet('" + sht.title + "')");



}

async function goHome() {

  var signinStatus = await gapi.auth2.getAuthInstance().isSignedIn.get()
  console.log('signinStatus')
  console.log(signinStatus)
   if (!signinStatus) {
     gotoTab('Auth')
     return
   }
  
  gotoTab('Home')

}

async function btnHMMoreVertHtml() {

  
}

async function btnHMChangePwdHtml() {

  
/*

Prompt for existing password
Verify against shtList

Prompt for new password / confirm
decrypt / encrypt shtList 

for each sheet from secSht object
  if secSht.enc
    decrypt sheet using old password
    encrypt sheet using new password
    display progress

*/

  var pwdText = 'The quick brown fox jumped over the lazy dog'

  var cPwd = await verifyCurrPwd(pwdText)
  if (!cPwd) return

  console.log('vPwd', vPwd)

  var nPwd = await requestNewPwd()
  if (!nPwd) return

  modal(true)

  for (const sht in secSht) {

    if (secSht[sht].enc) {

      var objSht = await openShts(
        [
          { title: sht, type: "all" }
        ])
    
      toast("Decrypting sheet" + sht)
      var shtHdrs = objSht[sht].colHdrs
      var shtArr = [shtHdrs].concat(objSht[sht].vals)
      var decSht = await decryptArr(shtArr, cPwd)

      toast("Encrypting sheet" + sht)
      var encSht = await encryptArr(decSht, nPwd)

      toast("Updating sheet " + sht)
      await updateSheet(sht, encSht)

    }

  }

  currUser.pwd = nPwd
  var encPwd = await encryptMessage(pwdText, nPwd)
  await updateOption('shtList', encPwd)

  modal(false)

}

async function verifyCurrPwd(pwdText) {

  
  var pwdEnc = arrOptions.shtList

  var pwd = await prompt("Enter Password", "password");

  var dx = await decryptMessage(pwdEnc, pwd)

  if (dx != pwdText) {await confirm("Invalid password");return null}

  return pwd

}


async function requestNewPwd() {
  
  var pwd = await prompt("Enter Password", "password");

  var pdrcnfrm = await prompt("Confirm Password", "password");

  if (pwd != pdrcnfrm) {
    var confirmOK = await confirm("Passwords don't match.")
    return null
  }

  return pwd

}