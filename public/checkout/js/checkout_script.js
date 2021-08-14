let costumer_info;
function getFormData() {
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let phone_number = document.getElementById('phone_number').value;
    let country = document.getElementById('country').value;
    let province = document.getElementById('province').value;
    let address = document.getElementById('address').value;

    let payment_method = $("input[type='radio'][name='radio']:checked").val();

    costumer_info = {
        "name": name,
        "email": email,
        "phone_number": phone_number,
        "country": country,
        "province": province,
        "address": address,
        "payment_method": payment_method
    }
    return costumer_info
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

    let name = document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-3')
    name.innerHTML = costumer_info.name;

    document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-4').innerHTML = costumer_info.email
    document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-5').innerHTML = costumer_info.phone_number
    document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-6').innerHTML = costumer_info.country
    document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-7').innerHTML = costumer_info.province
    document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-8').innerHTML = costumer_info.address
    document.querySelector('body > div > div.success-message.w-form-done > div > div.div-block-4 > div.text-block-9').innerHTML = costumer_info.payment_method
    

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
    let data = costumer_info;
    
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

