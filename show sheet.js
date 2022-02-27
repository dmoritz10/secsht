async function showSheet(idx, title) {

  console.log('sddd', idx, title)

  if (!idx) idx = 2

  var sht = []

  var vals = shtEnc ? await decryptArr(shtVals[idx], currUser.pwd) : shtVals[idx]
  
  $("#ssSheet")[0].innerHTML = vals[shtHdrs.indexOf('Provider')]
  $("#ssIdx").val(idx)

  console.log('ssidxxxx', $("#ssIdx"))

  for (var i=1; i<shtHdrs.length;i++) {

    var val = vals[i].replace(/\n|\r\n|\r/g, '<br/>');
    var icon = ''

    if (val) {
      if (validateUrl(val)) {

        icon =  '<div class="label cursor-pointer"><a target="_blank"  href=' + val + '><span class="material-icons">open_in_new</span></a></div>'

      } else {

        icon = '<div class="label cursor-pointer" onClick="copyToClpbrd(' + "'" + val + "'" + ')"><span class="material-icons">content_copy</span></div>'
    
      }
    }

    sht.push([shtHdrs[i], val, icon])

  }
  
  var tbl = new Table();
  
  tbl
    .setHeader()
    .setTableHeaderClass()
    .setData(sht)
    .setTableClass('table table-borderless')
    .setTrClass('d-flex')
    .setTcClass(['text-end col-4 h5 text-success', 'text-start col h4', 'col-1'])
    .setTdClass('py-1 pb-0 border-0 align-bottom border-bottom')
    .build('#tblSheet');

  

  gotoTab('ShowSheet')

  // setPrevNextBtns(idx, title)
        
} 

function setPrevNextBtns(dir) {

  var idx   = $("#ssIdx").val()
  var title = $('#shtTitle').text()

  console.log('asddd')

  var shtRows = secSht[title].rows

  console.log('dff', shtRows)

  var nextIdx = idx+1 < shtRows ? idx++ : null
  var prevIdx = idx-1 > 0       ? idx-- : null

  console.log('dann', nextIdx, prevIdx)

  if (dir=="prev")  showSheet(prevIdx, title)
  else              showSheet(nextIdx, title)

  // if (prevIdx)  { $("#btnSSPrev").off().on("click", showSheet(prevIdx, title))   }
  //                 $("#btnSSPrev").prop('disabled', false);
  // }  else         $("#btnSSPrev").prop('disabled', true);

  // if (nextIdx)  { $("#btnSSNext").on("click", showSheet(nextIdx, title))   }
  //                 $("#btnSSNext").prop('disabled', false);
  // } else          $("#btnSSNext").prop('disabled', true);

  console.log('hi dan')

}


function copyToClpbrd(txt) {

  navigator.clipboard.writeText(txt).then(function() {
    console.log('Async: Copying to clipboard was successful!');
    toast('Copied to clipboard', 1000)
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });

}
