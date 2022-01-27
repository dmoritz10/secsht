# secsht
 
Prompt for username / password on Auth page after authentication

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



