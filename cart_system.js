const { json } = require('body-parser');
const fs = require('fs');

const jsonDataPath = "./cart_data/";
let sender_psid = "69989";
list = [];
let item_object =     {
    "item_id": "1564s6d40",
    "item_title": "marble barble",
    "image": "/images/redshirt.png",
    "price": 150,
    "quantity": 1
  }

function cart_method(sender_psid, item_object){
    let obj_form = {
        "sender_psid": sender_psid+"_cart",
        "items_object": [item_object]
    }

    let jsonFilePath = jsonDataPath+sender_psid+"_cart.json";

    try{
        let myobj = JSON.parse(fs.readFileSync(jsonFilePath))
        //console.log(myobj)
        list = myobj.items_object;
        let found = false;
        for(let i=0; i< list.length; i++){
            if (list[i].item_id === item_object.item_id){
                found = true;
                list[i].quantity += 1
                break;
            }
        } 
        if(!found){
            list.push(item_object)
        }

        obj_form = obj_form = {
            "sender_psid": sender_psid+"_cart",
            "items_object": list
        }
        fs.writeFile(jsonFilePath, JSON.stringify(obj_form, null, 2), err => {
            if (err) {
              console.error(err)
              return;
            }
            //file written successfully
            console.log("FILE CREATED SUCCESSFULLY"); 
        });
        console.log(list)
        
    }
    catch(err)
    {
        console.log(err+"\n\n\n")
        console.log("FILE NOT FOUND"+"\n\n\n")

        // Creating the required file and write the ITEM OBJECT to it.
        fs.writeFile(jsonFilePath, JSON.stringify(obj_form, null, 2), err => {
            if (err) {
              console.error(err)
              return;
            }
            //file written successfully
            console.log("FILE CREATED SUCCESSFULLY"); 
        });
    }

}

module.exports = {
    cart_method
};