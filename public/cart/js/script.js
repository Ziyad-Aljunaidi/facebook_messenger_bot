let ReceievdJson = 'meow';
let sender_psid = "654654";
let ReceievdJsonList = [];
let current_url = window.location.href;
let cart_num = current_url.split("/")[4]

const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('cart');

function get_data(callback) {
  $.ajax({
    url: '/cart_items/?cart='+myParam,

    complete: function(data) {
      //data.responseJSON.items_object[0].quantity += 111
      console.log(data.responseJSON.items_object);
      console.log(data.responseJSON.sender_psid);
      let items_list = data.responseJSON.items_object;

      sender_psid = data.responseJSON.sender_psid;

      let sender_psid_checkout = "?cart_id="+sender_psid;
      let submit_href = document.querySelector('#submit')
      submit_href.setAttribute("href", "/checkout"+sender_psid_checkout)
 
      //items_list[0].item_title = "meow meow";
      
      // JSON BUG 
      try{
        for(let i = 0; i < items_list.length; i++) {
          let li = document.createElement("LI");
          li.setAttribute('class', 'list-item')
          let h5_title = document.createElement("p");
          h5_title.setAttribute('class', 'paragraph');
  
          h5_title.innerHTML = items_list[i].item_title;
  
          let h5_price = document.createElement("p");
          h5_price.setAttribute('class', 'paragraph-2');
          h5_price.innerHTML = items_list[i].price + " جنيه";
  
          let h5_quantity = document.createElement("p");
  
          // h5_quantity.setAttribute('class', 'heading-7');
          // h5_quantity.innerHTML = "Quantity:";
          let item_img = document.createElement("img");
          
          item_img.setAttribute('class', 'image-2');
          item_img.setAttribute('width', '80px');
          item_img.setAttribute('height', '80px');
          item_img.setAttribute('loading', 'lazy');
          item_img.src = items_list[i].image;
  
          let h5_quantity_num = document.createElement("h5");
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
  
          let gray_line = document.createElement("div");
          gray_line.setAttribute('class', 'div-block-6');
  
          //let body_div = document.createElement("")
          
  
          li.appendChild(item_img);
          li.appendChild(h5_title);
          li.appendChild(h5_price);
          li.appendChild(h5_quantity);
          li.appendChild(h5_quantity_num);
          li.appendChild(dec_btn);
          li.appendChild(inc_btn);
          li.appendChild(remove_btn);
          li.appendChild(gray_line);
  
          document.querySelector('ul').appendChild(li) 
                  
        }
  
        if(document.querySelectorAll('ul>li').length === 0) {
          let emptyCart = document.querySelector("body > div.div-block-7");
          emptyCart.setAttribute("style", "display:block")
          
          let hideCart = document.querySelector("body > div:nth-child(1)");
          hideCart.setAttribute("style", "display:none")
        }

        ReceievdJson = data.responseJSON.items_object;

        for( let i = 0; i < ReceievdJson.length; i++){
          ReceievdJsonList.push([i, ReceievdJson[i]]);
        }

      }catch(err){
        console.log(err);

        let emptyCart = document.querySelector("body > div.div-block-7");
          emptyCart.setAttribute("style", "display:block")
          
        let hideCart = document.querySelector("body > div:nth-child(1)");
        hideCart.setAttribute("style", "display:none")
      }

    callback();  
    //console.log(document.querySelector('ul').textContent)
  }   
});

}


let list = [];

function push_data() {
$(document).ready(function () {

  let li_element = document.getElementsByTagName('li')
  //let meow = document.getElementsByClassName("heading-5");
  for (let i = 0; i< li_element.length; i++ ){
    let item_title = document.querySelector(`li:nth-child(${i+1}) > p.paragraph`).textContent;
    let item_price = document.querySelector(`li:nth-child(${i+1}) > p.paragraph-2`).textContent;
    let item_quantity = document.querySelector(`li:nth-child(${i+1}) > h5.heading-8`).textContent;
    let item_img = document.querySelector(`body > div:nth-child(1) > div.div-block-5 > ul > li:nth-child(${i+1}) > img`).src;
    let itemObject = 
      {
        "item_id": "15963",
        "item_title": item_price,
        "price": item_price,
        "quantity": item_quantity,
        "image": item_img
      }
    
    list.push(itemObject)
    console.log(list[i]);
  }
  

   $("#submit").click(function () {
    
      
    let new_list = JSON.stringify(ReceievdJson, null, 2);

    
    let final_object = {
      "sender_psid": sender_psid,
      "items_object": ReceievdJson
    }
    
    console.log(final_object)
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

function update_cart() {

  let final_object = {
    "sender_psid": sender_psid,
    "items_object": ReceievdJson
  }

  if(final_object.items_object.length === 0){
    let emptyCart = document.querySelector("body > div.div-block-7");
    emptyCart.setAttribute("style", "display:block")
    
    let hideCart = document.querySelector("body > div:nth-child(1)");
    hideCart.setAttribute("style", "display:none")
  }
  $.post("/request",
  {
     final_object
  },
  function (data, status) {
     console.log(data);
  });
}


function increment_btn(){
  $("li > a.button-6.w-button").click(function () {
    let li_index = $(this).parent().index();
    let int_quantity = Number(ReceievdJson[li_index].quantity);
    // Li index natural numbers -> starts from 1
    let li_index_nn = li_index + 1;
    
    int_quantity += 1;

    ReceievdJson[li_index].quantity = int_quantity;
    let h5_quantity_num = document.querySelector(`body > div > div.div-block-5 > ul > li:nth-child(${li_index_nn}) > h5.heading-8`);
    h5_quantity_num.textContent = ReceievdJson[li_index].quantity;
    console.log(ReceievdJson[li_index].quantity,ReceievdJson[li_index].item_title);
    total();
    update_cart();
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

    let h5_quantity_num = document.querySelector(`body > div > div.div-block-5 > ul > li:nth-child(${li_index_nn}) > h5.heading-8`);
    h5_quantity_num.textContent = ReceievdJson[li_index].quantity;
    console.log(ReceievdJson[li_index].quantity,ReceievdJson[li_index].item_title);
    total();
    update_cart();
  });
}

function remove_btn() {
  $("li > a.button-7.w-button").click(function () {
    let li_index = $(this).parent().index();

    // Li index natural numbers -> starts from 1
    let li_index_nn = li_index + 1;

    // Removing an element at specific position.
    ReceievdJson.splice(li_index, 1);
    console.log(ReceievdJson);

    $(`ul > li:nth-child(${li_index_nn})`).remove();
    total();
    update_cart();
  });
}


function total() {
let total_cost = 0;
  
  for( let i = 0; i < ReceievdJson.length; i++) {
    total_cost += parseFloat(ReceievdJson[i].price)* parseFloat(ReceievdJson[i].quantity);
    console.log(total_cost);
  }

  let total_val = document.querySelector('body > div > div:nth-child(2) > h4');
  total_val.setAttribute('class', 'heading-9');
  total_val.textContent= "اجمالي المبلغ: "+ total_cost + " جنيه";

  $.ajax({
    url: '/shipping_cost',
    type: 'POST',
    data: {
        "shipping_cost": "011",
        "total": total_cost
    },
    success: function(msg) {
        console.log ('total sent', total);
    }               
  });

  
}




get_data(function() {

console.log('this is receievd ' + JSON.stringify(ReceievdJson))
increment_btn();
decrement_btn();
remove_btn();
push_data();
total();
//increment_quantity(get_li_pos);
//get_li_pos();


});


// a desprate try for the add button.


