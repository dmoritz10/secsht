
async function testEncrypted(title) {

    var objSht = await openShts(
        [
            { title: title, type: "headers" }
        ])

    console.log(objSht)

    var shtHdrs = objSht[title].colHdrs

    console.log(shtHdrs)

    if (shtHdrs[0] == 'Provider') {

        return {
            enc: false,
            secSht: true
        }

    }

    console.log(await decryptMessage(shtHdrs[0], currUser.pwd))
console.log(currUser.pwd)

    if (await decryptMessage(shtHdrs[0], currUser.pwd) == "Provider") {

        return {
            enc: true,
            secSht: true
        }

    }

    return {
        enc: null,
        secSht: false
    }

}

async function encryptSheet(title) {

    var objSht = await openShts(
        [
            { title: title, type: "all" }
        ])

    console.log(objSht)

    var shtHdrs = objSht[title].colHdrs
    var shtArr = [shtHdrs].concat(objSht[title].vals)

    console.log('shtArr', shtArr)

    var decHdrs = await decryptMessage(shtHdrs[0], currUser.pwd)

    console.log(decHdrs)

    if (decHdrs == "Provider") {
        bootbox.alert('Sheet "' + shtTitle + '" is already encrypted.');
        return
    }

    if (shtHdrs[0] != 'Provider') {
        bootbox.alert('Sheet "' + shtTitle + '" not a valid Secure Sheet.');
        return
    }

    var encShtArr = await encryptArr(shtArr, currUser.pwd)

    console.log(encShtArr)

    await updateSheet(title, encShtArr)

}


async function encryptArr(msg, pwd) {

    console.log('msg', msg)

    var rtn = []

    if (is2dArray(msg)) {

        console.log('msg 2d', msg)

        for (var i = 0; i < msg.length; i++) {
            var r = msg[i]
            var row = []
            for (var j = 0; j < r.length; j++) {
                row.push(await encryptMessage(r[j], pwd))
            }
            rtn.push(row)
        }

    } else {
        console.log('msg 1d', msg)

        for (var i = 0; i < msg.length; i++) {
            rtn.push(await encryptMessage(msg[i], pwd))
        }

    }

    return rtn

}

async function decryptArr(msg, pwd) {

    console.log('dan')

    var rtn = []

    if (is2dArray(msg)) {

        console.log('msg', msg)

        for (var i = 0; i < msg.length; i++) {
            var r = msg[i]
            var row = []
            for (var j = 0; j < r.length; j++) {
                row.push(await decryptMessage(r[j], currUser.pwd))
            }
            rtn.push(row)
        }

    } else {

        for (var i = 0; i < msg.length; i++) {
            rtn.push(await decryptMessage(msg[i], currUser.pwd))
        }

    }

    return rtn

}

async function encryptMessage(msg, password) {

    const encoder = new TextEncoder();

    const toBase64 = buffer =>
        btoa(String.fromCharCode(...new Uint8Array(buffer)));

    const PBKDF2 = async (
        password, salt, iterations,
        length, hash, algorithm = 'AES-CBC') => {

        keyMaterial = await window.crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );


        return await window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: encoder.encode(salt),
                iterations,
                hash
            },
            keyMaterial,
            { name: algorithm, length },
            false, // we don't need to export our key!!!
            ['encrypt', 'decrypt']
        );
    }


    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(16));
    const plain_text = encoder.encode(msg);
    const key = await PBKDF2(password, salt, 100000, 256, 'SHA-256');

    const encrypted = await window.crypto.subtle.encrypt(
        { name: "AES-CBC", iv },
        key,
        plain_text
    );

    var ciphertext = toBase64([
        ...salt,
        ...iv,
        ...new Uint8Array(encrypted)
    ])

    console.log({
        salt: toBase64(salt),
        iv: toBase64(iv),
        encrypted: toBase64(encrypted),
        concatennated: ciphertext
    });

    return ciphertext

}

async function decryptMessage(ciphertext, password) {

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const fromBase64 = buffer =>
        Uint8Array.from(atob(buffer), c => c.charCodeAt(0));

    const PBKDF2 = async (
        password, salt, iterations,
        length, hash, algorithm = 'AES-CBC') => {

        const keyMaterial = await window.crypto.subtle.importKey(
            'raw',
            encoder.encode(password),
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        );
        return await window.crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: encoder.encode(salt),
                iterations,
                hash
            },
            keyMaterial,
            { name: algorithm, length },
            false, // we don't need to export our key!!!
            ['encrypt', 'decrypt']
        );
    };


    const salt_len = iv_len = 16;

    const encrypted = fromBase64(ciphertext);

    const salt = encrypted.slice(0, salt_len);
    const iv = encrypted.slice(0 + salt_len, salt_len + iv_len);
    const key = await PBKDF2(password, salt, 100000, 256, 'SHA-256');

    const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-CBC", iv },
        key,
        encrypted.slice(salt_len + iv_len)
    )
        .then(function (decrypted) {
            console.log('deecrypted', decoder.decode(decrypted));
            return decoder.decode(decrypted);
        })
        .catch(function (err) {
            console.log(err)
            console.error(err);
            return err
        });

    return decrypted

}

async function updateSheet(title, vals) {

    console.log('updateSheet')
    console.log(shtId)
    console.log('shtTitle', shtTitle)
    console.log(vals)
  
    await checkAuth()
  
    var resource = {
      "majorDimension": "ROWS",
      "values": vals   
    }
  
  
    var rng = calcRngA1(1, 1, vals.length, vals[0].length)

    var params = {
    spreadsheetId: spreadsheetId,
    range: "'" + title + "'!" + rng,
    valueInputOption: 'RAW'
    };


    await gapi.client.sheets.spreadsheets.values.update(params, resource)
        .then(function (response) {
            console.log('Sheet update successful')
            console.log(response)
        }, function (reason) {
            console.error('error updating sheet "' + title + '": ' + reason.result.error.message);
            alert('error updating sheet "' + title + '": ' + reason.result.error.message);
        });

} 