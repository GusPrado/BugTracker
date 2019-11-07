const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtrackerkey.json')

const doc = new GoogleSpreadsheet('1cI8_UL1DCiXH8eNsQWScFutl3PJvm9FscHFgWNmr2P0')
doc.useServiceAccountAuth(credentials, (err) => {
    if (err) {
        console.log('Spreadsheet could not be opened')
    } else {
        console.log('Spreadsheet opened')
        doc.getInfo((err, info) => {
            const worksheet = info.worksheets[0]
            worksheet.addRow({ name: 'Gus2', email: 'gus2@test.com' }, err => {
                console.log('Line added')
            })
        })
    }
})