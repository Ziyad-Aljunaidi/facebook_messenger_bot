require('dotenv').config();
const fs = require('fs');
const { send } = require('process');
const cart_system = require('./cart_system.js')

let server_domain = process.env.DOMAIN;

get_started_payload = JSON.parse(fs.readFileSync("json_payload_forms/GET_STARTED.json"));
view_cart_payload = JSON.parse(fs.readFileSync("json_payload_forms/VIEW_CART.json"));
demo_payload = JSON.parse(fs.readFileSync("json_payload_forms/DEMO.json"));
shirts_payload = JSON.parse(fs.readFileSync("json_payload_forms/SHIRTS.json"));
new_shirts_payload = JSON.parse(fs.readFileSync("json_payload_forms/new_SHIRTS.json"));
new_pants_payload = JSON.parse(fs.readFileSync("json_payload_forms/new_PANTS.json"));
pants_payload = JSON.parse(fs.readFileSync("json_payload_forms/PANTS.json"));
receipt_template = JSON.parse(fs.readFileSync("json_payload_forms/RECEIPT_TEMPLATE.json"));
plansPricing = JSON.parse(fs.readFileSync("json_payload_forms/PLANSPRICING.json"));
pricing = JSON.parse(fs.readFileSync("json_payload_forms/PRICING.json"));


// VIEW_CART.json adding domain
// url_file_loc = view_cart_payload.attachment.payload.elements[0].image_url;
// view_cart_payload.attachment.payload.elements[0].image_url = server_domain + url_file_loc;

// let sender_psid = "3870335286419004"

function generate_receipt(order_num) {
    let order_json = JSON.parse(fs.readFileSync("./orders/"+order_num+".json"));
    //console.log(order_json.custom)
    let timestamp_millis = Date.now();
    let timestamp = Math.floor(timestamp_millis/1000);

    
    receipt_template.attachment.payload.recipient_name = order_json.customer_info.name;
    receipt_template.attachment.payload.order_number = `${order_json.order_id}`;
    receipt_template.attachment.payload.payment_method = order_json.customer_info.payment_method;
    receipt_template.attachment.payload.timestamp = timestamp.toString();
    receipt_template.attachment.payload.address.street_1 = order_json.customer_info.address;
    receipt_template.attachment.payload.address.postal_code = order_json.customer_info.postal_code;
    receipt_template.attachment.payload.address.city = order_json.customer_info.province;
    receipt_template.attachment.payload.address.state = order_json.customer_info.province;
    //receipt_template.attachment.payload.address.state = order_json.customer_info.province;
    receipt_template.attachment.payload.address.country = "EG";

    receipt_template.attachment.payload.summary.subtotal = parseFloat(order_json.customer_info.total) - parseFloat(order_json.customer_info.shipping_cost);
    receipt_template.attachment.payload.summary.shipping_cost = parseFloat(order_json.customer_info.shipping_cost);
    receipt_template.attachment.payload.summary.total_cost = parseFloat(order_json.customer_info.total);

    //console.log(order_json.items_object[0].item_title)
    
    let all_elements = []
    for (let i = 0; i < order_json.items_object.length; i++) {
        let element_obj = {
            "title": order_json.items_object[i].item_title,
            "quantity": parseFloat(order_json.items_object[i].quantity),
            "price" : parseFloat(order_json.items_object[i].price) ,
            "currency": "EGP",
            "image_url": server_domain + order_json.items_object[i].image
        }
        all_elements.push(element_obj)

        
        /*
        receipt_template.attachment.payload.elements.title = order_json.items_object[i].item_title;
        receipt_template.attachment.payload.elements.quantity = order_json.items_object[i].quantity;
        receipt_template.attachment.payload.elements.price = order_json.items_object[i].price;
        receipt_template.attachment.payload.elements.currency = order_json.items_object[i].currency;
        receipt_template.attachment.payload.elements.image_url = order_json.items_object[i].image;
        */
    }

    receipt_template.attachment.payload.elements =all_elements
    

    return receipt_template;
    
}

function  compose_cart_url(sender_psid){
   
    url_file_loc = "/cart";
    
    let full_cart_url = server_domain + url_file_loc + "/?cart="+sender_psid 
    view_cart_payload.attachment.payload.buttons[0].url = full_cart_url;

    url_file_loc = view_cart_payload.attachment.payload.buttons[0].fallback_url;
    view_cart_payload.attachment.payload.buttons[0].fallback_url = full_cart_url;

    return view_cart_payload

}

// TESTING VIEW_CART URL
 /*
console.log(JSON.stringify(compose_cart_url(sender_psid), null, 2))
console.log(JSON.stringify(compose_cart_url(sender_psid), null, 2))
console.log(JSON.stringify(compose_cart_url(sender_psid), null, 2))
*/


array_elements = shirts_payload.attachment.payload.elements;

for (let i = 0; i<array_elements.length; i++){
    url_file_loc = shirts_payload.attachment.payload.elements[i].image_url;
    shirts_payload.attachment.payload.elements[i].image_url = server_domain + url_file_loc;
}

array_elements = pants_payload.attachment.payload.elements;

for (let i = 0; i<array_elements.length; i++){
    url_file_loc = pants_payload.attachment.payload.elements[i].image_url;
    pants_payload.attachment.payload.elements[i].image_url = server_domain + url_file_loc;
}

// Add to cart
let cart_list= [];
function add_to_cart(sender_psid, payload){

    let category;
    let category_code = payload.charAt(0);
    let type;
    let type_code = payload.charAt(1);
    let title;
    let title_code = parseInt(payload.charAt(2));
    let price;
    let item_info;
    let data_file;

    if (category_code === "0"){
        category = "clothes"
    }else if(category_code ==="1"){
        category = "others"
    }

    if (type_code === "0"){
        type = "shirts";
        item_info = new_shirts_payload.attachment.payload;
        data_file = new_shirts_payload.attachment.payload.elements;
        
    }else if (type_code === "1"){
        type = "pants";
        item_info = new_pants_payload.attachment.payload;
        data_file = new_pants_payload.attachment.payload.elements;
    }
    //console.log(JSON.stringify(data_file))
    for(let i = 0; i <data_file.length; i++){
        if(data_file[i].item_id === payload){

            let item_object =     {
                "item_id": data_file[i].item_id,
                "item_title":data_file[i].item_title,
                "price": data_file[i].subtitle,
                "quantity": 1,
                "image": data_file[i].image_url
              }
              //response = {"text": JSON.stringify(item_object, null, 2)}
              console.log(item_object)
              cart_system.cart_method(sender_psid, item_object)
              //response = {"text": " تم اضافة "+item_object.item_title+" الي عربة التسوق"}

        }
    }
}

//add_to_cart("5468","012");

//console.log(JSON.stringify(generate_receipt("158028497672443"), null, 2))
module.exports = {
    get_started_payload,
    view_cart_payload,
    demo_payload,
    shirts_payload,
    new_shirts_payload,
    pants_payload,
    plansPricing,
    pricing,
    add_to_cart,
    compose_cart_url,
    generate_receipt

};