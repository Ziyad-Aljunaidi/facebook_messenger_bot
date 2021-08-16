let costumer_data;
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('cart_id');

let total;
$.ajax({
    url: '/shipping_cost',
    type: 'GET',
    complete: function(data){
        total = data.responseJSON.total;
    }              
});

function getFormData() {

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone_number = document.getElementById('phone_number').value;
    let country = document.getElementById('country').value;
    let province = document.getElementById('province').value;
    let address = document.getElementById('address').value;




    $.ajax({
        url: '/shipping_cost',
        type: 'POST',
        data: {
            total,
            province
        },
        success: function(msg) {
            //alert('Email Sent');
        }               
    });

    let payment_method = $("input[type='radio'][name='radio']:checked").val();

     costumer_data = {
         sender_psid : myParam,
         costumer_info: {
            "name": name,
            "email": email,
            "phone_number": phone_number,
            "country": country,
            "province": province,
            "address": address,
            "shipping_cost": "125",
            "total": total,
            "payment_method": payment_method
         }
    }
    return costumer_data
}
/*
$('#complete_order').click(function(){
    getFormData()
    let conformation = document.querySelector('body > div > div.success-message.w-form-done')
    conformation.setAttribute("style", "display:block")

    let info_form = document.querySelector('#myform')
    info_form.setAttribute("style", "display:none")

    let approve = document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-3 ')
    approve.setAttribute("style", "display:none")
});
*/

/*
$("#submit").click(function () {
    let data = getFormData();
    
    $.ajax({
        url: '/form_info',
        type: 'POST',
        data: {
            data,
        },
        success: function(msg) {
            //alert('Email Sent');
        }               
    });


    //console.log(costumer_info)
    //let err_msg = document.getElementById("err_msg").setAttribute("style", "display:block");


  //et info_form = document.querySelector('#myform')
  //nfo_form.setAttribute("style", "display:none")
   
  // return false;
});
*/


$("#myform").submit(function(e) {
    e.preventDefault(); 
    getFormData();
    console.log("haha")


    $.ajax({
        url: '/shipping_cost',
        type:'GET',
    
        complete: function(data) {
            console.log(data.responseJSON.shipping_cost);
            console.log(data.responseJSON.total);

            costumer_data.costumer_info.shipping_cost = data.responseJSON.shipping_cost;
            let total = parseFloat(costumer_data.costumer_info.total) + parseFloat(data.responseJSON.shipping_cost);
            costumer_data.costumer_info.total = total;
            let name = document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-3')
            name.innerHTML = costumer_data.costumer_info.name;
        
            document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-4').innerHTML = costumer_data.costumer_info.email
            document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-5').innerHTML = costumer_data.costumer_info.phone_number
            document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-6').innerHTML = costumer_data.costumer_info.country
            document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-7').innerHTML = costumer_data.costumer_info.province
            document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-8').innerHTML = costumer_data.costumer_info.address
            document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-9').innerHTML = "تكلفة الشحن "+ costumer_data.costumer_info.shipping_cost +" جنيه "
            document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-10').innerHTML = costumer_data.costumer_info.payment_method;
            document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.div-block-5 > h4').innerHTML = `الاجمالي: ${total} جنيه`
        } 
    });

    let conformation = document.querySelector('body > div > div.success-message.w-form-done')
    conformation.setAttribute("style", "display:block")
    let approve = document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-3 ')
    approve.setAttribute("style", "display:none")

    let info_form = document.querySelector('#myform')
    info_form.setAttribute("style", "display:none")
})

$("#edit").click(function() {
    let conformation = document.querySelector('body > div > div.success-message.w-form-done')
    conformation.setAttribute("style", "display:none")
    let approve = document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-3 ')
    approve.setAttribute("style", "display:none")

    let info_form = document.querySelector('#myform')
    info_form.setAttribute("style", "display:block")

})

$('#conform').click(function() {
    let data = costumer_data;
    
    $.ajax({
        url: '/form_info',
        type: 'POST',
        data: {
            data,
        },
        success: function(msg) {
            //alert('Email Sent');
        }               
    });

    let conformation = document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4')
    conformation.setAttribute("style", "display:none")
    let approve = document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-3 ')
    approve.setAttribute("style", "display:block")

    let info_form = document.querySelector('#myform')
    info_form.setAttribute("style", "display:none")
})

