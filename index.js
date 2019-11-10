const express = require ('express')
const path = require ('path')
const bodyParser = require('body-parser')
const { promisify } = require('util')
const sgMail = require('@sendgrid/mail');

const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtrackerkey.json')

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(bodyParser.urlencoded({ extended: true }))

//Configurations
const docId = '1cI8_UL1DCiXH8eNsQWScFutl3PJvm9FscHFgWNmr2P0'
const worksheetIndex = 0
const sendGridKey = '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'

app.get('/', (req, res) => {
    res.render('home')
})

app.post('/', async (req, res) => {
    try{
    const doc = new GoogleSpreadsheet(docId)
    await promisify(doc.useServiceAccountAuth)(credentials)
    //console.log('Spreadsheet opened')
    const info = await promisify(doc.getInfo)()    
    const { name, email, type, reproduce, expected, output, userAgent, userDate } = req.body
    let { source } = req.query
    if (!source){   
        source = 'direct'
    }
    console.log(source)
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
        // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        if (type === 'critical'){
            sgMail.setApiKey(sendGridKey);
            const msg = {
            to: 'gustavo.gpprado@gmail.com',
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
        

app.listen(3000, () => console.log('App running on port #3000'))