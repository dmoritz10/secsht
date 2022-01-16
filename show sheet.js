async function showSheet(idx) {

  gotoTab('ShowSheet')

  $("#ssSheet")[0].innerHTML = shtVals[idx][shtHdrs.indexOf('Provider')]

  var sht = []

  var shtObj = makeObj(shtVals[idx], shtHdrs)

  for (var i=1; i<shtHdrs.length;i++) {

    var val = shtVals[idx][i]
    var icon = ''

    if (val) {
      if (validateUrl(val)) {

        icon =  '<div class="label cursor-pointer"><a target="_blank"  href=' + val + '><span class="material-icons">open_in_new</span></a></div>'

      } else {

        icon = '<div class="label cursor-pointer" onClick="copyToClpbrd(' + "'" + val + "'" + ')"><span class="material-icons">content_copy</span></div>'
    
      }
    }

    sht.push([shtHdrs[i], shtVals[idx][i], icon])

  }
  
  var tbl = new Table();
  
  tbl
    .setHeader()
    .setTableHeaderClass()
    .setData(sht)
    .setTableClass('table')
    .setTrClass('d-flex')
    .setTcClass(['text-right col-4 h5 text-success', 'text-left col h4', 'col-1'])
    .setTdClass('py-1 pl-0 border-0 align-bottom')
    .build('#tblSheet');
        
} 

function copyToClpbrd(txt) {

  navigator.clipboard.writeText(txt).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}
