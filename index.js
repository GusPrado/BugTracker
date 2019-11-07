const express = require ('express')
const path = require ('path')
const bodyParser = require('body-parser')

const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtrackerkey.json')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }))

//Configurations
const docId = '1cI8_UL1DCiXH8eNsQWScFutl3PJvm9FscHFgWNmr2P0'
const worksheetIndex = 0

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/', (req, res) => {

    const doc = new GoogleSpreadsheet(docId)
    doc.useServiceAccountAuth(credentials, (err) => {
    if (err) {
        console.log('Spreadsheet could not be opened')
    } else {
        console.log('Spreadsheet opened')
        doc.getInfo((err, info) => {
            const { name, email, type, reproduce, expected, output } = req.body
            const worksheet = info.worksheets[worksheetIndex]
            worksheet.addRow({ 
                name,
                email,
                type,
                reproduce,
                expected,
                output,
            }, err => {
                res.send('Bug reported!')
            })
        })
    }
})

    
})

app.listen(3000, () => console.log('App running on port #3000'))