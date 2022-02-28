
async function listSheet(title) {

  modal(true)

  var shtOptions = readOption('shtFilter')
  var shtSelectFav = shtOptions.shtSelectFav

  var objSht = await openShts(
    [
      { title: title, type: "all" }
    ])

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
  
  var vals = objSht[shtTitle].vals

  for (var i=0;i<vals.length;i++) {

    vals[i].push(i)
    
    if (shtEnc) vals[i].push(await decryptMessage(vals[i][0], currUser.pwd)) // sort won't take a promise
    else        vals[i].push(vals[i][0])
  
  }

  var sortCol = vals[0] ? vals[0].length - 1 : 0    // in case of empty sheet.  ie. hdrs only

  shtVals = vals.sort(function(a,b){return a[sortCol].toLowerCase() > b[sortCol].toLowerCase() ? 1 : -1; });
  
  shtVals.forEach((val, idx, arr)=> arr[idx].pop()) // remove sort element from end of array
  

  $("#shtTitle")[0].innerHTML = shtTitle

  var $tblSheets = $("#shtContainer > .d-none")

  var x = $tblSheets.clone();
  $("#shtContainer").empty();
  x.appendTo("#shtContainer");

  for (var j = 0; j < shtVals.length; j++) {

    var hdrs = [...shtHdrs]
    hdrs.push('idx');

    var shtObj = makeObj(shtVals[j], hdrs)

    var shtIdx = shtObj['idx']

    shtVals[j].pop()                 // remove idx

    if (shtEnc) {
      var fav = await decryptMessage(shtObj['Favorite'], currUser.pwd)
      var provider = await decryptMessage(shtObj['Provider'], currUser.pwd)
    } else {
      var fav = shtObj['Favorite']
      var provider = shtObj['Provider']
    }

    if (
      (shtSelectFav && !(fav.toLowerCase() === 'true'))
    ) continue;


    var ele = $tblSheets.clone();

    ele.find('#shtProvider')[0].innerHTML = provider

    ele.find('#btnShtEdit')[0].setAttribute("onclick", "editSheet(" + j + ", " + shtIdx + ")");

    ele.find('#btnShtFavorite')[0].setAttribute("onclick", "setFavorite(" + j + ", " + shtIdx + ")");

    ele.find('#btnShtShowSheet')[0].setAttribute("onclick", "showSheet(" + j + ", '" + shtTitle + "')");


    var boolFav = fav.toLowerCase() === 'true'

    if (boolFav) {
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

  $('#shtContainer > div').click(function(e){         // highlight clicked row
    
    $('#shtContainer > div').removeClass('bg-secondary bg-opacity-25');
    $(e.currentTarget).addClass('bg-secondary bg-opacity-25')

  });


  console.log('shtContainer aa', $('#shtContainer > div'))
  console.log('shtContainer ab', $('#shtContainer > div').children())
  console.log('shtContainer ac', $('#shtContainer > div').children('#shtProvider'))

  console.log('shtContainer b', $('#shtContainer').children('.shtProvider'))
  console.log('$provider c', $('#shtProvider'))



  modal(false)

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

async function setFavorite(arrIdx, shtIdx) {

      // arrIdx - the index of the element in the sorted array
      // shtIdx = the index of the element in the sheet (un-sorted)

  var favCurr = shtVals[arrIdx][shtHdrs.indexOf("Favorite")]

  if (shtEnc) {
    var x = await decryptMessage(favCurr, currUser.pwd)
    var fav = x.toLowerCase() === 'true'

    if (fav) {
      shtVals[arrIdx][shtHdrs.indexOf("Favorite")] = await encryptMessage("FALSE", currUser.pwd)
    } else {
      shtVals[arrIdx][shtHdrs.indexOf("Favorite")] = await encryptMessage("TRUE", currUser.pwd)
    }

  } else {
    var fav = favCurr.toLowerCase() === 'true'

    if (fav) {
      shtVals[arrIdx][shtHdrs.indexOf("Favorite")] = "FALSE"
    } else {
      shtVals[arrIdx][shtHdrs.indexOf("Favorite")] = "TRUE"
    }
  }

  await updateSheetRow(shtVals[arrIdx], shtIdx)

  listSheet(shtTitle)

}


async function editSheet(arrIdx, shtIdx) {


  $("#sheet-modal").modal('show');
  $("#sheet-form")[0].reset();

  $('#shtmSheetName').html(shtTitle)

  $('#shtmArrIdx').val(arrIdx)
  $('#shtmShtIdx').val(shtIdx)


  var vals = shtEnc ? await decryptArr(shtVals[arrIdx], currUser.pwd) : shtVals[arrIdx]

  var shtObj = makeObj(vals, shtHdrs)

  $('#shtmProvider').val(shtObj['Provider'])
  $('#shtmLogin').val(shtObj['Login'])
  $('#shtmPassword').val(shtObj['Password'])
  $('#shtmAccountNbr').val(shtObj['Account Nbr'])
  $('#shtmPinNbr').val(shtObj['Pin Nbr'])
  $('#shtmAutoPay').val(shtObj['Auto Pay'])
  $('#shtmLoginUrl').val(shtObj['Login Url'])
  $('#shtmSecurityQA').val(shtObj['Security Q/A'])
  $('#shtmNotes').val(shtObj['Notes'])
  $('#shtmFavorite').val(shtObj['Favorite'])

  $('#btnDeleteSheet').removeClass('d-none')

}

async function btnShtmSubmitSheetHtml() {

  if (!$('#sheet-form').valid()) return

  var arrIdx = $('#shtmArrIdx').val()
  var shtIdx = $('#shtmShtIdx').val()


  if (arrIdx) {                                                       // update existing course

    var vals = [...shtVals[arrIdx]]

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
    vals[shtHdrs.indexOf("Favorite")] = $('#shtmFavorite').val()

  } else {

    if (dupProvider($('#shtmProvider').val())) {
      toast("Provider already exists")
      return
    }

    var vals = []

    vals[shtHdrs.indexOf("Provider")] = $('#shtmProvider').val()
    vals[shtHdrs.indexOf("Login")] = $('#shtmLogin').val()
    vals[shtHdrs.indexOf("Password")] = $('#shtmPassword').val()
    vals[shtHdrs.indexOf("Account Nbr")] = $('#shtmAccountNbr').val()
    vals[shtHdrs.indexOf("Pin Nbr")] = $('#shtmPinNbr').val()
    vals[shtHdrs.indexOf("Auto Pay")] = $('#shtmAutoPay').val()
    vals[shtHdrs.indexOf("Login Url")] = $('#shtmLoginUrl').val()
    vals[shtHdrs.indexOf("Security Q/A")] = $('#shtmSecurityQA').val()
    vals[shtHdrs.indexOf("Notes")] = $('#shtmNotes').val()
    vals[shtHdrs.indexOf("Favorite")] = false
    vals[shtHdrs.indexOf("Last Change")] = formatDate(new Date())
    vals[shtHdrs.indexOf("Favorite")] = $('#shtmFavorite').val()

    shtIdx = -1

  }

  console.log('vals preenc',vals)

  var valsEnc = shtEnc ? await encryptArr(vals, currUser.pwd) : vals


  await updateSheetRow(valsEnc, shtIdx)

  $("#sheet-modal").modal('hide');

  updateUI(valsEnc, arrIdx, shtIdx)

  // listSheet(shtTitle)

}

async function updateUI (valsEnc, arrIdx) {

// update shtVals conditionally encrypting
// secSht[shtTitle].Rows
// update / append shtContainer ? sort ???
// update / append

  console.log("arrIdx", arrIdx)

  if (arrIdx == -1) {              // Add new

    shtVals.push(valsEnc)
    secSht[shtTitle].Rows++

    arrIdx = shtVals.length-1

  } else {                        // update arrIdx

    shtVals[arrIdx] = valsEnc

  }

  console.log('arrIdx', arrIdx)
  console.log('shtVals', shtVals)

  var x = shtEnc ? await decryptArr(shtVals, currUser.pwd) : shtVals
  console.log('shtVals', x)

  var providerDec = shtEnc ? await decryptMessage(valsEnc[0], currUser.pwd) : shtVals
  console.log(providerDec)

  var $provider = $('#shtProvider').eq(arrIdx)

  console.log('shtContainer 0', $('#shtContainer'))
  console.log('shtContainer 1', $('#shtContainer').children('#shtProvider'))
  console.log('$provider 1', $('#shtProvider'))

  console.log('$provider 2', $provider)

  $provider.innerHTML = providerDec

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


  var idx = $('#shtmShtIdx').val() * 1

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


  await gapi.client.sheets.spreadsheets.batchUpdate({
    spreadsheetId: spreadsheetId,
    resource: request

  }).then(response => {

    console.log('delete complete - ', shtmShtIdx)
    console.log(response)

  })

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
