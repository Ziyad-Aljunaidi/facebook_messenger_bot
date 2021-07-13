require('dotenv').config();
const fs = require('fs')

let server_domain = process.env.DOMAIN;

 
get_started_payload = JSON.parse(fs.readFileSync("json_payload_forms/GET_STARTED.json"));
view_cart_payload = JSON.parse(fs.readFileSync("json_payload_forms/VIEW_CART.json"));
demo_payload = JSON.parse(fs.readFileSync("json_payload_forms/DEMO.json"));
shirts_payload = JSON.parse(fs.readFileSync("json_payload_forms/SHIRTS.json"));
pants_payload = JSON.parse(fs.readFileSync("json_payload_forms/PANTS.json"));

// VIEW_CART.json adding domain
url_file_loc = view_cart_payload.attachment.payload.elements[0].image_url;
view_cart_payload.attachment.payload.elements[0].image_url = server_domain + url_file_loc;

url_file_loc = view_cart_payload.attachment.payload.elements[0].buttons[0].url;
view_cart_payload.attachment.payload.elements[0].buttons[0].url = server_domain + url_file_loc;

url_file_loc = view_cart_payload.attachment.payload.elements[0].buttons[0].fallback_url;
view_cart_payload.attachment.payload.elements[0].buttons[0].fallback_url = server_domain + url_file_loc;

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

module.exports = {
    get_started_payload,
    view_cart_payload,
    demo_payload,
    shirts_payload,
    pants_payload
};