const GoogleSpreadsheet = require('google-spreadsheet')
//Require you own JSON key file from Google API

const credentials = require('./bugtrackerkey.json')

//----------------------------------------------
const { promisify } = require('util')

const addRowToSheet = async() => {
    const doc = new GoogleSpreadsheet(process.env.DOC_ID)
    await promisify(doc.useServiceAccountAuth)(credentials)
    console.log('Spreadsheet opened')
    const info = await promisify(doc.getInfo)()
    const worksheet = info.worksheets[0]
    await promisify(worksheet.addRow)({ name: 'TEST', email: 'test@test.com' })
}

addRowToSheet()
