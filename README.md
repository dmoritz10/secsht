# secsht
 
Prompt for username / password on Auth page after authentication

Prompt to change password => 
    for each sheetdecrypt old pw then encrypt new pw
    decrypt/encrypt shtList

use username to build file name
    if file not found then invalid username

use password to decrypt

Build an encrypt all pages function - where to put it

If Settings.shtList = "The ..." prompt user to encrypt entire workbook.  
    Re-prompt for password to make sure it matches the original one entered

if decrypt(Settings.shtList) != "The ..." then password invalid

if A1 = "Provider" then not encrypted
if decrypt(A1) = 'Provider' then it is encrypted and the password is valid

Should headings be internal to program ?
If not, should headings be encrypted also ?
If so, then how to determine if encrypted or not ?  Could use a Setting


After Add or Modify, sort by Provider after decrypting col A.  
    Must capture the original Idx

No, add to end, modify in place.  Sorting is done in memory prior to showing Providers.
    After add/mod, the entire sheet is re-read and re-listed.



Authentication

User Name
    open file
    if Settings.shtList = "The ..."
        prompt for enter and confirm password
        encrypt Settings.shtList - update Options
        1stTime = true
        Show sheets
       
    else
        prompt for password
        decrypt Settings.shtList using password
        if = "The ..."
            1stTime = false
            Show sheets
        else
            invalid password
            stop


Show sheets
    Selection = if a1 = Provider or decrypted a1 = Provider

    if a1 = "Provider" 
        show encrypt button / warning
        show download button
    else
        show decrypt button / warning
        show download button

    By not selecting sheets based on nbr of columns = 11, we cannot detect password mismatches between Settings.shtList and sheets

            "sheet cannot be decrypted"
            serious error: Settings.shtList is out of sync with Provider !!!
            This could happen if sheets are encrypted and someone fucks with Settings.shtList

