let ReceievdJson = 'meow';
let sender_psid;
let ReceievdJsonList = [];

function get_data(callback) {
  $.ajax({
    url: '/meow',

    complete: function(data) {
      //data.responseJSON.items_object[0].quantity += 111
      console.log(data.responseJSON.items_object);
      console.log(data.responseJSON.sender_psid);
      let items_list = data.responseJSON.items_object
      sender_psid = data.responseJSON.sender_psid;
      //items_list[0].item_title = "meow meow";

      for(let i = 0; i < items_list.length; i++) {

        let img = document.createElement("img");
        img.setAttribute('class', 'image-2');
        img.setAttribute('loading', 'lazy');
        img.setAttribute('src', 'images/untitled.jpg');
        let li = document.createElement("LI");
        li.setAttribute('class', 'list-item')
        let h5_title = document.createElement("p");
        h5_title.setAttribute('class', 'heading-5');

        h5_title.innerHTML = items_list[i].item_title;

        let h5_price = document.createElement("p");
        h5_price.setAttribute('class', 'heading-6');
        h5_price.innerHTML = items_list[i].price;
        let h5_quantity = document.createElement("p");

        h5_quantity.setAttribute('class', 'heading-7');
        h5_quantity.innerHTML = "Quantity:";

        let h5_quantity_num = document.createElement("p");
        h5_quantity_num.setAttribute('class', 'heading-8');
        h5_quantity_num.innerHTML = items_list[i].quantity;
        
        let dec_btn = document.createElement("a");
        dec_btn.setAttribute('class', 'button-5 w-button');
        dec_btn.innerHTML = "-";

        let inc_btn = document.createElement("a");
        inc_btn.setAttribute('class', 'button-6 w-button');
        inc_btn.innerHTML = "+";



        let remove_btn = document.createElement("a");
        remove_btn.setAttribute('class', 'button-7 w-button');
        remove_btn.innerHTML= "remove";

        li.appendChild(img);
        li.appendChild(h5_title);
        li.appendChild(h5_price);
        li.appendChild(h5_quantity);
        li.appendChild(h5_quantity_num);
        li.appendChild(dec_btn);
        li.appendChild(inc_btn);
        li.appendChild(remove_btn);

        document.querySelector('ul').appendChild(li) 
              
    }
    ReceievdJson = data.responseJSON.items_object;
    for( let i = 0; i < ReceievdJson.length; i++){
      ReceievdJsonList.push([i, ReceievdJson[i]]);
    }
    
    callback();  
    //console.log(document.querySelector('ul').textContent)
  }   
});

}


let list = []

function push_data() {
$(document).ready(function () {

  let li_element = document.getElementsByTagName('li')
  //let meow = document.getElementsByClassName("heading-5");
  for (let i = 0; i< li_element.length; i++ ){
    let item_title = document.querySelector(`li:nth-child(${i+1}) > p.heading-5`).textContent;
    let item_price = document.querySelector(`li:nth-child(${i+1}) > p.heading-6`).textContent;
    let item_quantity = document.querySelector(`li:nth-child(${i+1}) > p.heading-8`).textContent;
    let itemObject = 
      {
        "item_id": "15963",
        "item_title": item_price,
        "price": item_price,
        "quantity": item_quantity
      }
    
    list.push(itemObject)
    console.log(list[i])
  }
  
  

   
   $("#submit").click(function () {
      
    let new_list = JSON.stringify(ReceievdJson, null, 2);
    let final_object = {
      "sender_psid": sender_psid,
      "items_object": ReceievdJson
    }
    console.log(new_list)
     $.post("/request",
        {
           final_object
        },
        function (data, status) {
           console.log(data);
           console.log("HAHAHA")

        });
   });
 });
}

function increment_btn(){
  $("li > a.button-6.w-button").click(function () {
    let li_index = $(this).parent().index();

    // Li index natural numbers -> starts from 1
    let li_index_nn = li_index + 1;

    ReceievdJson[li_index].quantity += 1;

    let h5_quantity_num = document.querySelector(`body > div > div.div-block-5 > ul > li:nth-child(${li_index_nn}) > p.heading-8`);
    h5_quantity_num.textContent = ReceievdJson[li_index].quantity;
    console.log(ReceievdJson[li_index].quantity,ReceievdJson[li_index].item_title);
  });
}

function decrement_btn() {
  $("li > a.button-5.w-button").click(function () {
    let li_index = $(this).parent().index();

    // Li index natural numbers -> starts from 1
    let li_index_nn = li_index + 1;
    let quantity = ReceievdJson[li_index].quantity;

    if (ReceievdJson[li_index].quantity > 1){
      ReceievdJson[li_index].quantity -= 1;
    }

    let h5_quantity_num = document.querySelector(`body > div > div.div-block-5 > ul > li:nth-child(${li_index_nn}) > p.heading-8`);
    h5_quantity_num.textContent = ReceievdJson[li_index].quantity;
    console.log(ReceievdJson[li_index].quantity,ReceievdJson[li_index].item_title);
  });
}

function remove_btn() {
  $("li > a.button-7.w-button").click(function () {
    let li_index = $(this).parent().index();
    /*
    for( let i = 0; i < ReceievdJson.length; i++){
      ReceievdJsonList.push([i, ReceievdJson[i]]);
    }
    */
    

    // Li index natural numbers -> starts from 1
    let li_index_nn = li_index + 1;

    // Removing an element at specific position.
    ReceievdJson.splice(li_index, 1);
    console.log(ReceievdJson)
    //delete ReceievdJson[li_index]
    //console.log(ReceievdJson)
    $(`ul > li:nth-child(${li_index_nn})`).remove();
  });
}


get_data(function() {

console.log('this is receievd ' + JSON.stringify(ReceievdJson))
increment_btn();
decrement_btn();
remove_btn();
push_data();
//increment_quantity(get_li_pos);
//get_li_pos();


});


// a desprate try for the add button.

