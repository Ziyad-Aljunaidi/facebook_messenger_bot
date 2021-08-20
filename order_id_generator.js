
const fs = require('fs');
const config = require('./config.js');

console.log(Date.now())
console.log()

function generateOrderID(cart_object) {
    let random_num = Math.floor(Math.random() * 100 ) + 1;
    let orderID = random_num * Date.now();
    cart_object["order_id"] = orderID;
    orderFilePath = "./orders/"+orderID+".json"
    fs.writeFileSync(orderFilePath, JSON.stringify(cart_object, null, 2));
    
    // return orderID;
    return config.generate_receipt(orderID);

}


let obj = {
    "sender_psid": "3870335286419004_cart",
    "items_object": [
      {
        "item_id": "011",
        "item_title": "Sweat Pants",
        "price": "9 LE",
        "quantity": "2",
        "image": "/images/sweatpants.png"
      },
      {
        "item_id": "012",
        "item_title": "Denim Jeans",
        "price": "22 LE",
        "quantity": "1",
        "image": "/images/jeans_pants.png"
      },
      {
        "item_id": "002",
        "item_title": "Polo Shirt",
        "price": "15 LE",
        "quantity": "1",
        "image": "/images/poloshirt.png"
      },
      {
        "item_id": "003",
        "item_title": "Long Sleeve Shirt",
        "price": "18 LE",
        "quantity": "3",
        "image": "/images/long_sleeve_shirt.png"
      }
    ],
    "costumer_info": {
      "name": "Ziyad Aljunaidi",
      "email": "zadj9965@gmail.com",
      "phone_number": "01113357439",
      "country": "egypt",
      "province": "Cairo",
      "address": "7g/4, ST. Al-lasilki, Maadi, Cairo",
      "shipping_cost": "15",
      "total": "124",
      "payment_method": "دفع عند الاستلام"
    }
  }

//generateOrderID(obj)
//console.log(JSON.stringify(generateOrderID(obj), null, 3));

  module.exports = {
    generateOrderID
  }