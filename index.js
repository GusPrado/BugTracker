require('dotenv/config')
const express = require ('express')
const path = require ('path')
const bodyParser = require('body-parser')
const { promisify } = require('util')
const sgMail = require('@sendgrid/mail');
const GoogleSpreadsheet = require('google-spreadsheet')

//Require you own JSON key file from Google API

const credentials = require('./bugtrackerkey.json')

//----------------------------------------------

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/about', (req, res) => {
    res.render('about')
})

//Config tab inside spreadsheet
const worksheetIndex = 0

app.post('/', async (req, res) => {
    try{
    const doc = new GoogleSpreadsheet(process.env.DOC_ID)
    await promisify(doc.useServiceAccountAuth)(credentials)
    //console.log('Spreadsheet opened')
    const info = await promisify(doc.getInfo)()    
    const { name, email, type, reproduce, expected, output, userAgent, userDate } = req.body
    let { source } = req.query
    if (!source){   
        source = 'direct'
    }
    //console.log(source)
    const worksheet = info.worksheets[worksheetIndex]
    await promisify(worksheet.addRow)({ 
                name,
                email,
                type,
                reproduce,
                expected,
                output,
                source,
                userAgent,
                userDate
            })

        // If CRITICAL
        // using Twilio SendGrid's v3 Node.js Library
        // https://github.com/sendgrid/sendgrid-nodejs
        if (type === 'critical'){
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            const msg = {
            //change for a valid TO: email
            to: 'xxxxxxxx@gmail.com',
            from: `${email}`,
            subject: 'CRITICAL Bug reported',
            text: `
                The user ${name} has reported a problem.
            `,
            html: `
            The user ${name} has reported a problem.
            `,
            };
            await sgMail.send(msg);
        } 

            res.render('success')
    }catch(err){
        res.send('Error on sending form.')
        console.log(err)
    }
})
        

app.listen(process.env.PORT, () => console.log(`App running on http://localhost:${process.env.PORT}`))