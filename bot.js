'use strict'

// Import dependencie and set up http server
require('dotenv').config();
const { createConnection } = require('net');
const { send } = require('process');
const request = require('request');
const
    express = require('express'),
    bodyparser = require('body-parser'),
    config = require("./config.js"),
    cart = require("./cart_system"),
    order_generator = require("./order_id_generator"),
    fs = require('fs'),
    path = require("path"),
    querystring = require('querystring'),
    app = express().use(bodyparser.json()); // Creates http server

const  
    ngrok_url = process.env.DOMAIN,
    VERIFY_TOKEN = process.env.VERIFY_TOKEN,
    PAGE_ACCESS_TOKEN =  process.env.PAGE_ACCESS_TOKEN;

const static_path = path.join(__dirname, "public");

app.use(express.static(static_path));
app.use(express.urlencoded({ extended: true}));

const jsonDataPath = "./cart_data/";
// Handover Protocol

function handoverProtocol(sender_psid){
      // Construct the message body
      let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "target_app_id": 263902037430900,
        "metadata":"String to pass to secondary receiver app" 
    }

    // Send the HTTP request to the messenger Platform 
    request({
        "uri": "https://graph.facebook.com/v2.6/me/pass_thread_control",
        "qs": {"access_token": PAGE_ACCESS_TOKEN},
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('Thread Passed')
        } else {
            console.error("Unable to pass the thread" + err);
        }
    });
}


// Take Controk API
function takeControlApi(sender_psid){
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "metadata":"Pass this conversation to user. turn on the bot" 
    }

    // Send the HTTP request to the messenger Platform 
    request({
        "uri": "https://graph.facebook.com/v2.6/me/take_thread_control",
        "qs": {"access_token": PAGE_ACCESS_TOKEN},
        "method": "POST",
        "json": request_body
    }, (err, res, body) => {
        if (!err) {
            console.log('Thread Passed to Primary')
        } else {
            console.error("Unable to pass the thread" + err);
        }
    });

    let received_postback = {
        "payload":  "ACTIVATE_BOT"
    }

    handlePostback(sender_psid, received_postback)
}

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
        response = {"text": ""}
        callSendAPI(sender_psid, response)
    }
    else if(received_message.text) {
        
        let payload_msg = received_message.text;
        let posback = {
            "payload": payload_msg
        }
        
        switch(payload_msg) {

            // Presistent Menu
                case "تجربة البوت":
                    response = config.demo_payload;
                    callSendAPI(sender_psid, response)
                    break;

                case "الأشتراك و الأسعار":
                    //takeControlApi(sender_psid);
                    //response = {"text": "برجاء التحدث مع احد مندوبينا لمناقشة الاسعار وكيفية الاشتراك."}
                    response = config.plansPricing;
                    callSendAPI(sender_psid, response)
                    break;
        
                case "التحدث مع مندوب":
                    response = config.stp_bot;
                    //{"text": "تم ايقاف البوت, من فضلك ارسل استفسارك وسيتم الرد عليك من قبل احد مندوبينا في اسرع وقت ممكن 😊\nلاعادة تشغيل البوت برجاء ارسال كلمة activate",}
                    callSendAPI(sender_psid, response);
                    
                    handoverProtocol(sender_psid);
                    /*
                    setTimeout(() => {
                        if(reactivate == false){
                            takeControlApi(sender_psid);
                        }
                        
                    }, 6000) // 300000 = 5 min
                    */
                   
                    break;
    
                case "الذهاب الي عربة التسوق":
                    response = config.compose_cart_url(sender_psid);
                    callSendAPI(sender_psid, response)
                    break;
        
                default:
                        //console.log(err)
                        response = config.quick_err_handling;
                        callSendAPI(sender_psid, response)
                        console.log("error raised in handle postback")
            }
       //response = config.quick_err_handling;
    }

    // Sends the response message
    callSendAPI(sender_psid, response);
}

// Handles messaging_postback events

async function handlePostback(sender_psid, received_postback) {
    let response = [];
    
    let payload = received_postback.payload;
   // sender_psid_global = sender_psid;

   switch(payload) {

    // Presistent Menu
        case "custom_question_0":
        case "DEMO":
            response = config.demo_payload;
            callSendAPI(sender_psid, response)
            break;

        case "custom_question_1":
        case "PLANS":
            //takeControlApi(sender_psid);
            //response = {"text": "برجاء التحدث مع احد مندوبينا لمناقشة الاسعار وكيفية الاشتراك."}
            response = config.plansPricing;
            callSendAPI(sender_psid, response)
            break;

        case "custom_question_2": 
        case "AGENT":
            response = config.stp_bot;
            //{"text": "تم ايقاف البوت, من فضلك ارسل استفسارك وسيتم الرد عليك من قبل احد مندوبينا في اسرع وقت ممكن 😊\nلاعادة تشغيل البوت برجاء ارسال كلمة activate",}
            callSendAPI(sender_psid, response);
            
            handoverProtocol(sender_psid);
            /*
            setTimeout(() => {
                if(reactivate == false){
                    takeControlApi(sender_psid);
                }
                
            }, 6000) // 300000 = 5 min
            */
           
            break;

        case "custom_question_3":
        case "VIEW_CART":
            response = config.compose_cart_url(sender_psid);
            callSendAPI(sender_psid, response)
            break;

    // DEMO Quick Replies
        case "SHIRTS":
            response =  config.shirts_payload;
            callSendAPI(sender_psid, response)
            break;
            
        case "PANTS":
            response = config.pants_payload;
            callSendAPI(sender_psid, response)
            break;
    
    // Generate a receipt
        case "RECEIPT":
            response = received_postback.response;
            callSendAPI(sender_psid, response)
            break;

    // To Re-Activate The Bot takeControlApi
        case "ACTIVATE_BOT":
             response = {"text": "تم اعادة تشغيل البوت"};
             callSendAPI(sender_psid, response);
             break;

        case "REACTIVATE_BOT":
            takeControlApi(sender_psid);
            break;
       case "PLANSPRICING":
           response = config.plansPricing;
           callSendAPI(sender_psid, response)
           break;

       case "PRICING": 
           let response0 = {"text": "في 500 جنيه تدفع مرة واحدة فقط لبرمجة البوت و تهيئته لاحتياجات صفحتك, والدفع بيتم بعد استلام البوت واختباره على صفحتك حتى تكون راضي عنه تماما."}
           response = config.pricing;
           callSendAPI(sender_psid, response);
           callSendAPI(sender_psid, response0);
           break;

        case "MORE_INFO":
            response = {"text": "برجاء التواصل مع احد مندوبينا او الاتصال علي 01030533078 للاستعلام عن كيفية الاشتراك و المتطلبات لبناء البوت الخاص بك 😊"};
            callSendAPI(sender_psid, response)
            break;

        case "SHOP_MORE":
            response = {
                "text": "تحب تتسوق في ايه؟",
                "quick_replies":[
                    {
                      "content_type":"text",
                      "title":"تشيرتات",
                      "payload":"SHIRTS"
                    },{
                      "content_type":"text",
                      "title":"بنطلونات",
                      "payload":"PANTS"
                    }
                ]
            }
            callSendAPI(sender_psid, response)
            break;

        default:
            try{
                config.add_to_cart(sender_psid, payload)
                console.log(payload)
                response = config.shop_more
                callSendAPI(sender_psid, response)
            }catch(err){
                console.log(err)
                response = config.quick_err_handling;
                callSendAPI(sender_psid, response)
                console.log("error raised in handle postback")
            }
    }
    // callSendAPI(sender_psid, response)
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
            
            // check the incoming message, standby event.
            if(entry.standby) {
                let webhook_standby= entry.standby[0];

                if(webhook_standby && webhook_standby.message) {
                    try{
                        let activate_word = webhook_standby.message.text
                        activate_word = activate_word.toLowerCase();
                        if( activate_word === "activate" || webhook_standby.message.text === "back" || webhook_standby.message.text === "exit" || webhook_standby.message.text === "اعادة تشغيل البوت") {
                            takeControlApi(webhook_standby.sender.id);
                        }
                    }catch(err){
                        console.log(err)
                    }

                }
                return;
            }

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

app.use("/checkout", express.static('./public/checkout'))

app.get("/cart_items", async function(req, res, next) {

    let cart_num = req.query.cart;
    let cart_content;
    try{
        cart_content = await JSON.parse(fs.readFileSync('./cart_data/'+cart_num+"_cart.json"));
        // console.log(cart_content)
        try{
            res.json(cart_content);
        }catch(err){
            console.log(err);
        }
    }catch(err){
        // console.log(err);
        cart_content = JSON.parse(fs.readFileSync('./cart_data/cart_sample.json'));
        try{
            res.json(cart_content);
        }catch(err){
            console.log(err);
        }
    }
});

app.post("/request", (req, res) => {

    try {
        res.json([{
            jsonFileName: req.body.final_object.sender_psid
         }]);
        
    } catch (error) {
        console.log(error);
    }

    // console.log(req.body.final_object.sender_psid);
    fs.writeFile(jsonDataPath+req.body.final_object.sender_psid+".json", JSON.stringify(req.body.final_object, null, 2), err => {
        if (err) {
          console.error(err);
          return;
        }
        //file written successfully
        console.log("FILE CREATED/UPDATED SUCCESSFULLY"); 
    });
});

app.post("/form_info", (req, res) => {
    try {
        res.json([{
            jsonFileName: req.body.data
         }]);
         let cart_id = req.body.data.sender_psid;
         let customer_info = req.body.data.customer_info
         // console.log(req.body.data)
         let cart = JSON.parse(fs.readFileSync(jsonDataPath+cart_id+".json"));
         let final_cart = {
             "sender_psid": cart.sender_psid,
             "items_object": cart.items_object,
             customer_info
         }
         
         console.log(final_cart)
         fs.writeFileSync(jsonDataPath+cart_id+".json", JSON.stringify(final_cart, null, 2), err => {
             if(err) {
                 console.log(err);
             }
         })

         let reciept = order_generator.generateOrderID(final_cart);
         let local_sender_psid = final_cart.sender_psid;
         local_sender_psid = local_sender_psid.slice(0, -5)
         console.log(JSON.stringify(reciept, null, 3))

         let postpack = {
             "payload" : "RECEIPT",
             "response" : reciept,
         }

         handlePostback(local_sender_psid, postpack)
         let current_cart = JSON.parse(fs.readFileSync(`./cart_data/${local_sender_psid}_cart.json`));
         current_cart.items_object = [];
         current_cart.customer_info = {};
         
         fs.writeFileSync(`./cart_data/${local_sender_psid}_cart.json`, JSON.stringify(current_cart, null, 2), err => {
            if(err) {
                console.log(err);
            }
        })

    } catch (error) {
        console.log(error);
    }
});

let shipping_cost, total;
app.post("/shipping_cost", (req, res) => {

    total = req.body.total;
    try {
        res.json([{
            jsonFileName: req.body.province
         }]);
        let shippng_cost_json = JSON.parse(fs.readFileSync('./shipping_costs.json'));
        shipping_cost = shippng_cost_json[req.body.province];
        total = req.body.total;
        // console.log("total: ", total)
    } catch (error) {
        console.log(error);
    }
});


app.get("/shipping_cost", (req, res) => {
    res.json({"shipping_cost": shipping_cost, "total": total});
});




// 404 PAGE NOT FOUND
app.get('*', function(req, res){
    
    res.status(404).sendFile(static_path+"/404NotFound.html");
    
  });

