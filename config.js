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

// VIEW_CART.json adding domain
url_file_loc = view_cart_payload.attachment.payload.elements[0].image_url;
view_cart_payload.attachment.payload.elements[0].image_url = server_domain + url_file_loc;

//console.log(JSON.stringify(view_cart_payload));
//fs.writeFileSync("json_payload_forms/VIEW_CART.json",JSON.stringify(view_cart_payload, null, 2));


//let sender_psid = "3870335286419004"

function  compose_cart_url(sender_psid){
   

    url_file_loc = "/cart";
    
    let full_cart_url = server_domain + url_file_loc + "/?cart="+sender_psid 
    view_cart_payload.attachment.payload.elements[0].buttons[0].url = full_cart_url;

    url_file_loc = view_cart_payload.attachment.payload.elements[0].buttons[0].fallback_url;
    view_cart_payload.attachment.payload.elements[0].buttons[0].fallback_url = full_cart_url;

    return view_cart_payload

    
}
 /*
console.log(JSON.stringify(compose_cart_url(sender_psid), null, 2))
console.log(JSON.stringify(compose_cart_url(sender_psid), null, 2))
console.log(JSON.stringify(compose_cart_url(sender_psid), null, 2))
*/
//view_cart_payload.attachment.elements[0].buttons[0].payload

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
        item_info = shirts_payload.attachment.payload;
        data_file = new_shirts_payload.attachment.payload.elements;
        
    }else if (type_code === "1"){
        type = "pants";
        item_info = pants_payload.attachment.payload;
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
    //cart_system.cart_method(sender_psid, btn_paylod)
    //title = item_info.elements[title_code].title;
    //price = item_info.elements[title_code].subtitle;
//
    //item_object = {
    //    "product_id": btn_paylod,
    //    "quantity": 1,
    //    "item_info":{
    //        "category": category,
    //        "type": type,
    //        "title": title,
    //        "price": price,
    //    }  
    //}   
    //return item_object
}

//add_to_cart("5468","012");
module.exports = {
    get_started_payload,
    view_cart_payload,
    demo_payload,
    shirts_payload,
    new_shirts_payload,
    pants_payload,
    add_to_cart,
    compose_cart_url

};