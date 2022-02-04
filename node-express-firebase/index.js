'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const firebase = require('firebase');

const port = 8080
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

//firebase set up
const firebaseConfig = {
    apiKey: "AIzaSyDOV9jmoxnFD04NLswjXRVT3pKvEPcQudA",
    authDomain: "skili-fa5a1.firebaseapp.com",
    databaseURL: "https://skili-fa5a1-default-rtdb.firebaseio.com",
    projectId: "skili-fa5a1",
    storageBucket: "skili-fa5a1.appspot.com",
    messagingSenderId: "515878586296",
    appId: "1:515878586296:web:f7608d9dc0c21a0650b14d",
    measurementId: "G-F0WL3NXV1L"
  }
firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();


//Twilio setups
var accountSid 
var client
var authToken
firestore.collection('verify').doc('twilioToken').get()
.then(token => {
    accountSid = token.data().accountSid
    authToken = token.data().authToken
    client = require('twilio')(accountSid, authToken)
})

//generate and store an access code in database, return the code
async function CreateNewAccessCode(phoneNumber){
    console.log(`generating new code for ${phoneNumber}`)
    const sixDigit = Math.floor(100000 + Math.random() * 900000)
    //store code in database with phone number as ID
    await firestore.collection('verify').doc(`${phoneNumber}`).set({
        accessCode: sixDigit
    })
    
    //send sms with verification code to phone number
    client.messages
    .create({ 
        body: `Your verification code is: ${sixDigit}`,  
        messagingServiceSid: 'MG11503eb7f5a5fb7566b98caf2a5cef6f',      
        to: `+1${phoneNumber}`
    }) 
    .then(message => console.log(message.sid)) 
    .done();
    return sixDigit
}

//validate the code received with code from database return true if valid
async function ValidateAccessCode(accessCode, phoneNumber){
    console.log(`validating ${phoneNumber}, ${accessCode}`)
    //retrieve access code from database
    var entry = await firestore.collection('verify').doc(`${phoneNumber}`).get()
    var dbcode = entry.data().accessCode
    console.log(`db code logged for ${phoneNumber} is ${dbcode}`)
    var isValid = (dbcode == accessCode)
    if (isValid) {
        await firestore.collection('verify').doc(`${phoneNumber}`).set({
            accessCode: ''
        })
        console.log('Verified, emptying access code in DB')
    }
    return isValid
}

app.post('/verify',express.json({type: '*/*'}), async (req, res, next) => {
    try {
        console.log(authToken)
        const accessCode = req.body.code
        const phoneNumber = req.body.phone

        var msg
        //user did not submit a code
        if (!accessCode) {
            console.log(`code generated for ${phoneNumber} is ${await CreateNewAccessCode(phoneNumber)}`)
            msg = `A verification code was sent to ${phoneNumber}`
        }
        else {
            var entry = await firestore.collection('verify').doc(`${phoneNumber}`).get()
            //submitted phone number is in database
            if (entry.exists) {
                var isValid = await ValidateAccessCode(accessCode, phoneNumber)
                msg = (isValid? 'Verified':'Wrong code, please try again')
            }
            //code present but phone number not in database, generate code
            else {
                console.log(`code generated for ${phoneNumber} is ${await CreateNewAccessCode(phoneNumber)}`)
                msg = `${phoneNumber} not exists in system, sending code`
            }
        }
        res.send(JSON.stringify({ 
            message: msg
        }))
    } catch (error) {
        res.status(400).send(error.message);
    }
});


app.listen(port, () => console.log('Server is listening on url http://localhost:' + port));
