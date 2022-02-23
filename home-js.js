
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

  var vPwd = verifyCurrPwd()
  if (!vPwd) return

  var nPwd = requestNewPwd()
  if (!nPwd) return

  console.log('secSht',secSht)
  

  secSht.forEach( async sht =>  {

    console.log('sht',sht)

    if (sht.enc) {

      var objSht = await openShts(
        [
          { title: sht.title, type: "all" }
        ])
    
      shtTitle = title
      shtId   = sht.id
      shtCols = sht.Cols
      shtRows = sht.Rows
      shtEnc  = secSht[shtTitle].enc
      
      var hdrs = await decryptArr(objSht[shtTitle].colHdrs, currUser.pwd)
      
      var vals = await decryptArr(objSht[shtTitle].vals, currUser.pwd)



    }



  })

  currUser.pwd = nPwd
  var encPwd = await encryptMessage(vPwd, nPwd)
  await updateOption('shtList', encPwd)
  
}

async function btnHMChangePwdHtml() {

  alert('hi dan')



}