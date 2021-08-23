let total ;//Default value
let costumer_data;
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('cart_id');


let customer_data = "Noice"; // Defaul value
/*
let getProvince = () => {
    return new Promise ((resolve, reject) => {
        let total;
        try{

            resolve("Done!!")
            return total
        }catch(err){
            reject(err)
        }
    });
}

*/

async function handleCheckout() {
    let myTotal = new Promise( function(Resolve, Reject) {
        $.ajax({
            url: '/shipping_cost',
            type: 'GET',
            success: function(data){
                Resolve(data.total);
            },
            error: function(err){
                Reject(err)
            }
        });
    });
    total = await myTotal;
}

console.log(handleCheckout());

function getFormData() {

    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone_number = document.getElementById('phone_number').value;
    let country = document.getElementById('country').value;
    let province = document.getElementById('province').value;
    let postal_code = document.getElementById('postal_code').value;
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

     customer_data = {
         sender_psid : myParam,
         customer_info: {
            "name": name,
            "email": email,
            "phone_number": phone_number,
            "country": country,
            "province": province,
            "address": address,
            "postal_code": postal_code,
            "shipping_cost": "",
            "total": total,
            "payment_method": payment_method
         }
    }
    return province;
}



$("#myform").submit(function(e) {
    e.preventDefault(); 
    handleCheckout();
    getFormData();

    $.ajax({
        url: '/shipping_cost',
        type:'GET',
    
        complete: function(data) {
            console.log(data.responseJSON.shipping_cost);
            console.log(data.responseJSON.total);
        
            customer_data.customer_info.shipping_cost = data.responseJSON.shipping_cost;
            let total = parseFloat(customer_data.customer_info.total) + parseFloat(data.responseJSON.shipping_cost);
            customer_data.customer_info.total = total;
            let name = document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-3')
            name.innerHTML = customer_data.customer_info.name;
        
            document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-4').innerHTML = customer_data.customer_info.email
            document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-5').innerHTML = customer_data.customer_info.phone_number
            document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-6').innerHTML = customer_data.customer_info.country
            document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-7').innerHTML = customer_data.customer_info.province
            document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-8').innerHTML = customer_data.customer_info.address
            document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-11').innerHTML = customer_data.customer_info.postal_code;
            document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-9').innerHTML = "تكلفة الشحن "+ customer_data.customer_info.shipping_cost +" جنيه "
            document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-10').innerHTML = customer_data.customer_info.payment_method;
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
    let data = customer_data;
    
    $.ajax({
        url: '/form_info',
        type: 'POST',
        data: {
            data,
        },
        success: function(msg) {
            // console.log(msg);
        }               
    });

    let conformation = document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4')
    conformation.setAttribute("style", "display:none")
    let approve = document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-3 ')
    approve.setAttribute("style", "display:block")

    let info_form = document.querySelector('#myform')
    info_form.setAttribute("style", "display:none")
})

