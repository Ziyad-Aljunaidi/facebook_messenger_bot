require('dotenv').config();
const fs = require('fs')

let json_data_payload = {}
//const json_data = require("./json_payload_forms");

let server_domain = process.env.DOMAIN;

//let VIEW_CART = json_data;
//console.log(VIEW_CART)
 
get_started_payload = JSON.parse(fs.readFileSync("json_payload_forms/GET_STARTED.json"));
view_cart_payload = JSON.parse(fs.readFileSync("json_payload_forms/VIEW_CART.json"));
demo_payload = JSON.parse(fs.readFileSync("json_payload_forms/DEMO.json"));
shirts_payload = JSON.parse(fs.readFileSync("json_payload_forms/SHIRTS.json"));
pants_payload = JSON.parse(fs.readFileSync("json_payload_forms/PANTS.json"));

//console.log(get_started_json)
//let json_view_cart = json_payload_forms.
//console.log(view_cart)

// VIEW_CART.json adding domain
url_file_loc = view_cart_payload.attachment.payload.elements[0].image_url;
view_cart_payload.attachment.payload.elements[0].image_url = server_domain + url_file_loc;

url_file_loc = view_cart_payload.attachment.payload.elements[0].buttons[0].url;
view_cart_payload.attachment.payload.elements[0].buttons[0].url = server_domain + url_file_loc;

url_file_loc = view_cart_payload.attachment.payload.elements[0].buttons[0].fallback_url;
view_cart_payload.attachment.payload.elements[0].buttons[0].fallback_url = server_domain + url_file_loc;

//console.log(view_cart_payload.attachment.payload.elements[0].image_url);
//console.log(view_cart_payload.attachment.payload.elements[0].buttons[0].url);
//console.log(view_cart_payload.attachment.payload.elements[0].buttons[0].fallback_url = server_domain + url_file_loc);


array_elements = shirts_payload.attachment.payload.elements;

for (let i = 0; i<array_elements.length; i++){
    url_file_loc = shirts_payload.attachment.payload.elements[i].image_url;
    shirts_payload.attachment.payload.elements[i].image_url = server_domain + url_file_loc;

}

//console.log(array_elements)

array_elements = pants_payload.attachment.payload.elements;

for (let i = 0; i<array_elements.length; i++){
    url_file_loc = pants_payload.attachment.payload.elements[i].image_url;
    pants_payload.attachment.payload.elements[i].image_url = server_domain + url_file_loc;

}

console.log(array_elements)



//console.log(json_view_cart.attachment.payload.elements[0].image_u
module.exports = {
    get_started_payload,
    view_cart_payload,
    demo_payload,
    shirts_payload,
    pants_payload
};