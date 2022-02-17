
async function listSheet(title) {

  var shtOptions = readOption('shtFilter')
  var shtSelectFav = shtOptions.shtSelectFav

  var objSht = await openShts(
    [
      { title: title, type: "all" }
    ])

  console.log(objSht)

  shtTitle = title
  shtId   = secSht[shtTitle].id
  shtCols = secSht[shtTitle].Cols
  shtRows = secSht[shtTitle].Rows
  shtEnc  = secSht[shtTitle].enc

  if (shtEnc) {
    shtHdrs = await decryptArr(objSht[shtTitle].colHdrs, currUser.pwd)
  } else {
    shtHdrs = objSht[shtTitle].colHdrs
  }
  
  // var vals = decryptArr(objSht[shtTitle].vals, currUser.pwd)
  var vals = objSht[shtTitle].vals

  // vals.forEach((val, idx, arr) => arr[idx].push(idx))

  for (var i=0;i<vals.length;i++) {

    vals[i].push(i)
    
    // if (shtEnc) vals[i][0] = await decryptMessage(vals[i][0], currUser.pwd) // sort won't take a promise
    
    if (shtEnc) vals[i].push(await decryptMessage(vals[i][0], currUser.pwd)) // sort won't take a promise
    else        vals[i].push(vals[i][0])
  
  }

  var sortCol = vals[0].length - 1
  // var sortCol = 0

  console.log('valssss', sortCol, vals)

  shtVals = vals.sort(function(a,b){return a[sortCol].toLowerCase() > b[sortCol].toLowerCase() ? 1 : -1; });
  
  shtVals.forEach((val, idx, arr)=> arr[idx].pop()) // remove sort element from end of array
  
  console.log('shtVals ccccc', shtVals)
 

  $("#shtTitle")[0].innerHTML = shtTitle

  var $tblSheets = $("#shtContainer > .d-none")

  var x = $tblSheets.clone();
  $("#shtContainer").empty();
  x.appendTo("#shtContainer");

  for (var j = 0; j < shtVals.length; j++) {

    const hdrs = [...shtHdrs].push('idx');

    var shtObj = makeObj(shtVals[j], hdrs)

    console.log('shtObj', shtObj)

    if (shtEnc) {
      var fav = await decryptMessage(shtObj['Favorite'], currUser.pwd)
      var provider = await decryptMessage(shtObj['Provider'], currUser.pwd)
      // var provider = shtObj['Provider']
    } else {
      var fav = shtObj['Favorite']
      var provider = shtObj['Provider']
    }

    if (
      (shtSelectFav && !(fav.toLowerCase() === 'true'))
    ) continue;

    var ele = $tblSheets.clone();

    ele.find('#shtProvider')[0].innerHTML = provider

    ele.find('#shtIdx')[0].innerHTML = shtObj['idx']
    
    ele.find('#btnShtEdit')[0].setAttribute("onclick", "editSheet(" + j + ")");

    ele.find('#btnShtFavorite')[0].setAttribute("onclick", "setFavorite(" + j + ")");

    ele.find('#btnShtShowSheet')[0].setAttribute("onclick", "showSheet(" + j + ")");


    var fav = (shtObj['Favorite'].toLowerCase()) === 'true'

    if (fav) {
      ele.find('#ScFavIcon')[0].innerHTML = "star"
      ele.find('#ScFavIcon').addClass('text-primary')
    } else {
      ele.find('#ScFavIcon')[0].innerHTML = "star_outline"
      ele.find('#ScFavIcon').removeClass('text-primary')
    }

    ele.removeClass('d-none')

    ele.appendTo("#shtContainer");

  }

  gotoTab('Sheets')

  var srchVal = $("#shtSearch").val()

  if (srchVal) {

      $("#shtContainer #shtProvider").filter(function() {
        $(this).parent().parent().parent().toggle($(this).text().toLowerCase().indexOf(srchVal.toLowerCase()) > -1)
      });
   
  }

}


async function btnShtMoreVertHtml() {

  var shtOptions = readOption('shtFilter')
  var shtSelectFav = shtOptions.shtSelectFav

  $('#shtSelectFav').prop("checked", shtSelectFav);

}

async function btnShtSelectHtml(e) {

  var shtSelectFavVal = $('#shtSelectFav').prop('checked')

  await updateOption('shtFilter', {
    'shtSelectFav': shtSelectFavVal
  })

  listSheet(shtTitle)

}

async function setFavorite(idx) {

  console.log('idx', idx)

  var favCurr = shtVals[idx][shtHdrs.indexOf("Favorite")]

  if (shtEnc) {
    var x = await decryptMessage(favCurr, currUser.pwd)
    var fav = x.toLowerCase() === 'true'

    if (fav) {
      shtVals[idx][shtHdrs.indexOf("Favorite")] = await encryptMessage("FALSE", currUser.pwd)
    } else {
      shtVals[idx][shtHdrs.indexOf("Favorite")] = await encryptMessage("TRUE", currUser.pwd)
    }

  } else {
    var fav = favCurr.toLowerCase() === 'true'

    if (fav) {
      shtVals[idx][shtHdrs.indexOf("Favorite")] = "FALSE"
    } else {
      shtVals[idx][shtHdrs.indexOf("Favorite")] = "TRUE"
    }
  }

  await updateSheetRow(idx)

  listSheet(shtTitle)

}


async function editSheet(idx) {


  $("#sheet-modal").modal('show');
  $("#sheet-form")[0].reset();

  $('#shtmSheetName').html(shtTitle)

  $('#shtmIdx').val(idx)

  console.log(shtVals)
  console.log(shtHdrs)
  console.log(shtVals[idx])
  console.log(shtVals[idx][shtHdrs['Provider']])

  var shtObj = makeObj(shtVals[idx], shtHdrs)

  console.log(shtObj)

  $('#shtmProvider').val(shtObj['Provider'])
  $('#shtmLogin').val(shtObj['Login'])
  $('#shtmPassword').val(shtObj['Password'])
  $('#shtmAccountNbr').val(shtObj['Account Nbr'])
  $('#shtmPinNbr').val(shtObj['Pin Nbr'])
  $('#shtmAutoPay').val(shtObj['Auto Pay'])
  $('#shtmLoginUrl').val(shtObj['Login Url'])
  $('#shtmSecurityQA').val(shtObj['Security Q/A'])
  $('#shtmNotes').val(shtObj['Notes'])

  $('#btnDeleteSheet').removeClass('d-none')

}

async function btnShtmSubmitSheetHtml() {

  if (!$('#sheet-form').valid()) return

  var idx = $('#shtmIdx').val()

  var vals = shtVals[idx]

  if (idx) {                                                       // update existing course

    vals[shtHdrs.indexOf("Provider")] = $('#shtmProvider').val()
    vals[shtHdrs.indexOf("Login")] = $('#shtmLogin').val()
    vals[shtHdrs.indexOf("Password")] = $('#shtmPassword').val()
    vals[shtHdrs.indexOf("Account Nbr")] = $('#shtmAccountNbr').val()
    vals[shtHdrs.indexOf("Pin Nbr")] = $('#shtmPinNbr').val()
    vals[shtHdrs.indexOf("Auto Pay")] = $('#shtmAutoPay').val()
    vals[shtHdrs.indexOf("Login Url")] = $('#shtmLoginUrl').val()
    vals[shtHdrs.indexOf("Security Q/A")] = $('#shtmSecurityQA').val()
    vals[shtHdrs.indexOf("Notes")] = $('#shtmNotes').val()
    vals[shtHdrs.indexOf("Last Change")] = formatDate(new Date())


  } else {

    if (dupProvider($('#shtmProvider').val())) {

      toast("Provider already exists")

      return
    }

    vals = []
    vals[shtHdrs.indexOf("Provider")] = $('#shtmProvider').val()
    vals[shtHdrs.indexOf("Login")] = $('#shtmLogin').val()
    vals[shtHdrs.indexOf("Password")] = $('#shtmPassword').val()
    vals[shtHdrs.indexOf("Account Nbr")] = $('#shtmAccountNbr').val()
    vals[shtHdrs.indexOf("Pin Nbr")] = $('#shtmPinNbr').val()
    vals[shtHdrs.indexOf("Auto Pay")] = $('#shtmAutoPay').val()
    vals[shtHdrs.indexOf("Login Url")] = $('#shtmLoginUrl').val()
    vals[shtHdrs.indexOf("Security Q/A")] = $('#shtmSecurityQA').val()
    vals[shtHdrs.indexOf("Notes")] = $('#shtmNotes').val()
    vals[shtHdrs.indexOf("Last Change")] = formatDate(new Date())

    vals[shtHdrs.indexOf("Favorite")] = false

  }

  shtVals[idx] = vals

console.log(shtVals)

  await updateSheetRow(idx)

  // await initialUI()

  $("#sheet-modal").modal('hide');

  listSheet(shtTitle)

}

async function updateSheetRow(idx) {

  console.log('updateSheetRow')
  console.log(idx)
  console.log(shtId)
  console.log('shtTitle', shtTitle)
  console.log(shtVals)

  await checkAuth()

  var vals = shtVals[idx].slice(0, -1) // remove idx element from end of array
  console.log(vals)

  var resource = {
    "majorDimension": "ROWS",
    "values": [vals]    
  }

  if (idx > -1) {

    console.log('update', idx)

    var row = idx * 1 + 2
    var rng = calcRngA1(row, 1, 1, shtHdrs.length)

    var params = {
      spreadsheetId: spreadsheetId,
      range: "'" + shtTitle + "'!" + rng,
      valueInputOption: 'RAW'
    };


    await gapi.client.sheets.spreadsheets.values.update(params, resource)
      .then(function (response) {
        console.log('Sheet update successful')
        console.log(response)
      }, function (reason) {
        console.error('error updating sheet "' + row + '": ' + reason.result.error.message);
        alert('error updating sheet "' + row + '": ' + reason.result.error.message);
      });

  } else {
    console.log('append', idx)

    var row = 2
    var rng = calcRngA1(row, 1, 1, shtHdrs.length)

    var params = {
      spreadsheetId: spreadsheetId,
      range: "'" + shtTitle + "'!" + rng,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS'
    };

    await gapi.client.sheets.spreadsheets.values.append(params, resource)
      .then(async function (response) {

        console.log('sheetId', shtId)
        console.log(secSht)

        // var request = { "requests": 
        //   [{ "sortRange": 
        //     { "range": { 
        //       "sheetId": shtId, 
        //       "startRowIndex": 1, 
        //       "endRowIndex": shtVals.length+2, 
        //       "startColumnIndex": 0, 
        //       "endColumnIndex": shtHdrs.length 
        //     }, 
        //     "sortSpecs": 
        //     [{ "sortOrder": "ASCENDING", "dimensionIndex": 0 }] 
        //     } 
        //   }] 
        // }

        // await gapi.client.sheets.spreadsheets.batchUpdate({
        //   spreadsheetId: spreadsheetId,
        //   resource: request
        // }).then(response => {

        //   console.log('sort complete')
        //   console.log(response)

        // })

      },

        function (reason) {

          console.error('error appending sheet "' + shtTitle + '": ' + reason.result.error.message);
          bootbox.alert('error appending sheet "' + shtTitle + '": ' + reason.result.error.message);

        });

  }

}


function fixUrl(url) {

  if (url.substring(0, 8) !== 'https://' && url.substring(0, 7) !== 'http://') return 'https://' + url

  return url

}


async function btnAddSheetHtml() {

  $("#sheet-modal").modal('show');
  $("#sheet-form")[0].reset();
  $('#shtmModalTitle').html('')

   $('#btnDeleteSheet').addClass('d-none')

}

async function btnDeleteSheetHtml() {

  var confirmOK = await confirm("Are you sure you want to delete this provider ?")

  if (!confirmOK) return


  var idx = $('#shtmIdx').val() * 1

  var request = {
    "requests":
      [
        {
          "deleteDimension": {
            "range": {
              "sheetId": shtId,
              "dimension": "ROWS",
              "startIndex": idx + 1,
              "endIndex": idx + 2
            }
          }
        }
      ]
  }


  console.log(request)

  await gapi.client.sheets.spreadsheets.batchUpdate({
    spreadsheetId: spreadsheetId,
    resource: request

  }).then(response => {

    console.log('delete complete')
    console.log(response)

  })

  // await initialUI()

  $("#sheet-modal").modal('hide');

  listSheet(shtTitle)

}

function dupProvider(provider) {

  let arrProviders = shtVals.map(a => a[shtHdrs.indexOf('Provider')]);

  if (arrProviders.indexOf(provider) > -1) {
    return true
  } else {
    return false
  }

}
