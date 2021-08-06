'use strict'

// Import dependencie and set up http server
require('dotenv').config();
const { createConnection } = require('net');
const request = require('request');
const
    express = require('express'),
    bodyparser = require('body-parser'),
    config = require("./config.js"),
    cart = require("./cart_system"),
    fs = require('fs'),
    path = require("path"),
    app = express().use(bodyparser.json()); // Creates http server

const  
    ngrok_url = process.env.DOMAIN,
    VERIFY_TOKEN = process.env.VERIFY_TOKEN,
    PAGE_ACCESS_TOKEN =  process.env.PAGE_ACCESS_TOKEN;


const static_path = path.join(__dirname, "public");
app.use(express.static(static_path));
app.use(express.urlencoded({ extended: true }));

let sender_psid_global;
const jsonDataPath = "./cart_data/";

// Setup Function For GET_STARTED Button
function setupGetStartedButton(res) { 
    var messageData = config.get_started_payload;
    // Start the request
    request({

        url: 'https://graph.facebook.com/v11.0/me/messenger_profile?access_token='+ PAGE_ACCESS_TOKEN,
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        form: messageData
    },
    function (error, response, body) {
        if(!error && response.statusCode == 200) {
            res.send(body);
        } else {
            res.send(body);
        }
    });
}

// Handles messages events
function handleMessage(sender_psid, received_message) {
    
    let response;
    let received_postback

    // Checks if the message contains text
    if(received_message.quick_reply){
        received_postback = received_message.quick_reply;
        handlePostback(sender_psid, received_postback);
        
    }
    else if (received_message.attachments) {

        // Gets the URL of the message attachment
        let attachment_url = received_message.attachments[0].payload.url;
        response = {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Is this the right picture?",
                        "subtitle": "Tap a button to answer.",
                        "image_url": attachment_url,
                        "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no",
                            }
                        ],
                    }]
                }
            }
        }
    }

    // Sends the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postback events

function handlePostback(sender_psid, received_postback) {
    let response;
    let payload = received_postback.payload;
    let new_shirts = config.new_shirts_payload.attachment.payload.elements;
    sender_psid_global = sender_psid;

    let paylod_list = {
        "GET_STARTED": {"text": "Hello, how may I help you :)"}, 
        "DEMO": config.demo_payload,
        "SHIRTS": config.shirts_payload,
        "PANTS": config.pants_payload,
        "VIEW_CART": config.view_cart_payload,
        "yes": {"text": "Thanks!"},
        "no": {"text": "Oops, try sending another image."},
       // "000": config.add_to_cart(payload)
        //"001": config.add_to_cart(payload),
        //"002": cart_list.push(config.add_to_cart(payload))
    }

    // Get the payload for the postback
    if ( paylod_list[payload]){
        response = paylod_list[payload]
    }else{
        try{
            //cart.cart_method(sender_psid, payload)
            //response = {"text": sender_psid+" "+ payload}
            config.add_to_cart(sender_psid, payload)
            console.log(payload)
            response = {"text": "تم اضافة العنصر الي عربة التسوق"}
        }
    catch(err){
            console.log(err)
            response = {"text": "Sorry can't understand that"}
        }
    }
        
    callSendAPI(sender_psid, response);

}

// Sends response message via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": response
    }

    // Send the HTTP request to the messenger Platform 
    request({
        "uri": "https://graph.facebook.com/v11.0/me/messages",
        "qs": {"access_token": PAGE_ACCESS_TOKEN},
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('message sent!')
        } else {
            console.error("Unable to send the message" + err);
        }
    });
}

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

// Creates the endpoint for our webhook
app.post('/webhook', (req, res) => {

    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {
        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {
            
            // Gets the message. entry.messaging is an array, but
            // will only ever contain one message, so we get index 0
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);

            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            //console.log('Sender PSID: ' + sender_psid);

            // Checks if the event is a message or postback and
            // pass the event to the appropiate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message);
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback);
            } 
        });

        // Returns a '200 OK' response to all requests
        res.status(200).send('EVENT_RECEIVED');

    } else {
        // Returns a '404 Not Found' if event is not from a page subscription
        res.sendStatus(404);
    }
});


// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of request
    if (mode && token) {

        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN){

            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403)
        }
    }
});


// Creates The SETUP for our GET STARTED button
app.get('/setup', function(req,res) {
    setupGetStartedButton(res);
});

app.use("/images", express.static("./images"));
app.use("/test",express.static('./public'))

app.get("/meow", function(req, res, next) {
    res.json(JSON.parse(fs.readFileSync("cart_data/"+sender_psid_global+"_cart.json")));
    

    let data = req.body;
    //console.log(data);
    
});





app.get("/test/pages/view_cart",(req, res) => {
    let myObj;
});

app.post("/request", (req, res) => {
    res.json([{
       jsonFileName: req.body.final_object.sender_psid,
       //designation_recieved: req.body.designation
    }])
    console.log(req.body.final_object.sender_psid)
    fs.writeFile(jsonDataPath+req.body.final_object.sender_psid+".json", JSON.stringify(req.body.final_object, null, 2), err => {
        if (err) {
          console.error(err)
          return;
        }
        //file written successfully
        console.log("FILE CREATED SUCCESSFULLY"); 
    });
 })
//