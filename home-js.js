
function loadSheets() {


  return new Promise(async resolve => {


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

          ele.find('#hmSheet')[0].innerHTML = sht.title

          ele.find('#hmShowSheet')[0].setAttribute("onclick", "listSheet('" + sht.title + "')");

          ele.removeClass('d-none')

          ele.appendTo("#hmContainer");

          secSht[sht.title] = {
            id:   sht.sheetId,
            cols: sht.gridProperties.columnCount,
            rows: sht.gridProperties.rowCount
          }

          nbrSheets++
          nbrProviders += sht.gridProperties.rowCount

        }
    
      }

      $('#hmNbrSheets').html(nbrSheets)
      $('#hmNbrProviders').html(nbrProviders)

      console.log('secSht', secSht)

    }

  })

}



async function goHome() {

  var signinStatus = await gapi.auth2.getAuthInstance().isSignedIn.get()
  console.log('signinStatus')
  console.log(signinStatus)
   if (!signinStatus) {
     showAuth()
     gotoTab('Auth')
     return
   }
  
  gotoTab('Home')

}
