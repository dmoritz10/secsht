async function showSheet(idx, title) {

  var x = $("div .shtHliteProvider")
  console.log("div .shtHliteProvider class", x)

  x.addClass('bg-primary')

var y = x.get(2)
  console.log('y', y)
  

  y.addClass('bg-primary')

  if (idx === null) return                  // null is from browseProvider

  var sht = []

  var vals = shtEnc ? await decryptArr(shtVals[idx], currUser.pwd) : shtVals[idx]
  
  $("#ssSheet")[0].innerHTML = vals[shtHdrs.indexOf('Provider')]
  $("#ssIdx").val(idx)


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

function browseProvider(dir) {

  var idx   = $("#ssIdx").val()*1
  var title = $('#shtTitle').text()

  var shtRows = secSht[title].rows*1 - 1   // .rows includes hdrs

  var nextIdx = (idx+1 <  shtRows) ? idx+1 : null
  var prevIdx = (idx-1 >= 0      ) ? idx-1 : null

  if (dir=="prev")  showSheet(prevIdx, title)
  else              showSheet(nextIdx, title)

  // if (prevIdx)  { $("#btnSSPrev").off().on("click", showSheet(prevIdx, title))   }
  //                 $("#btnSSPrev").prop('disabled', false);
  // }  else         $("#btnSSPrev").prop('disabled', true);

  // if (nextIdx)  { $("#btnSSNext").on("click", showSheet(nextIdx, title))   }
  //                 $("#btnSSNext").prop('disabled', false);
  // } else          $("#btnSSNext").prop('disabled', true);

}


function copyToClpbrd(txt) {

  navigator.clipboard.writeText(txt).then(function() {
    console.log('Async: Copying to clipboard was successful!');
    toast('Copied to clipboard', 1000)
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });

}
