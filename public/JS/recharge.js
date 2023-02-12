function select(tag) {
  return document.querySelector(tag);
}
function selectAll(tag){
  return document.querySelectorAll(tag);
}

selectAll('.amm').forEach((item, i) => {
  item.addEventListener('click', ()=>{
    selectAll('.amm').forEach((item1, i) => {
      item1.classList.remove('active');
    });
    select('#amount').value = parseFloat(item.innerText.replace(/\D/g,''));
    item.classList.add('active');
  })
});


selectAll('.gateway').forEach((item, i) => {
  item.addEventListener('click' , ()=>{
    selectAll('.gateway').forEach((item1, i) => {
      item1.classList.remove('active');
    });
    item.classList.add('active');
  })
});


function prompt_user(tip , message , link){

  let child = document.createElement('div');
  child.classList.add('popup');
  child.innerHTML = `<div class="dialog_box">
  <h3>${tip}</h3>
  <p>${message}</p>
  <a href=${link}>ok</a>
  </div>`

  select('body').appendChild(child);

}

select('#copy_btn').addEventListener('click' , ()=>{
  // Get the text field
  var copyText = document.getElementById("upi_id");

   // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.innerText);
  alert('copied')

})


select('#recharge').addEventListener('click' , ()=>{
   let amount_entered = select('#amount').value;
   if(amount_entered < 1 || !amount_entered || amount_entered == undefined){
     alert('ENTER A VALID AMOUNT');
     return;
   }


   select('#payment_load').addEventListener('click' , async()=>{
     select('#payments').style.display = 'block';
     let text = Math.random()*1000;
     const textAsBuffer = new TextEncoder().encode(text);
     const hashBuffer = await window.crypto.subtle.digest('SHA-256', textAsBuffer);
     const hashArray = Array.from(new Uint8Array(hashBuffer))
     const digest = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

     let hex = digest.slice(0,10);

     select('#order_number').innerText = hex;
     selectAll('.payment_amount').forEach((item, i) => {
       item.innerText = select('#amount').value;
     });
     // let x = select('.quick_method > .active').innerText;
     // select('#method').innerText = x;
   })
})


select('#recharge').addEventListener("click" , ()=>{
  let amount_entered = select('#amount').value;

  if(amount_entered < 1 || !amount_entered || amount_entered == undefined){
    alert('ENTER A VALID AMOUNT');
    return;
  }

  selectAll('.payment_amount').forEach((item, i) => {
    item.innerText = amount_entered;
  });
  select('#yy_pay').style.left = "0vw";
})

// ========== sending data to backend ============== //

async function recharge(data){
  const config = {
    method : 'POST',
    headers : {
      'content-type' : 'application/json'
    },
    body : await JSON.stringify(data)
  }
  let res = await fetch('/recharge' , config);
  res = await res.json();

  if(res['status'] === 1){
    alert('it was success')
    window.location.reload();
  }else{
    // alert('something wnnt weornt')
    window.location.href = window.location.origin + '/sign.html';
  }

}

select('#yy_submit').addEventListener('click' , ()=>{
  let transaction_id = select('#yy_transaction').value;
  let amount = select('#yy_amount').innerText;

  if(!transaction_id || transaction_id == undefined ||
  !amount || amount == undefined){
    alert('something went wrong ');
    window.location.reload();
    return;
  }
  amount = parseFloat(amount);
  let data = {
    amount , transaction_id
  }
  recharge(data);
})

select('#yy_upi_cpy').addEventListener('click' , ()=>{
  let text = select('#yy_upi_id');
  navigator.clipboard.writeText(text.innerText);
  alert('UPI copied');
})

// select('#recharge_btn').addEventListener('click' , ()=>{
//
//   let amount = select('.payment_amount').innerText;
//   let transaction_id = select('#refrence_no').value;
//   let sn_id = select('#order_number').innerText;
//
//
//   if(
//     !amount || amount == 'undefined' ||
//     !transaction_id || transaction_id == 'undefined' ||
//     !sn_id || sn_id == 'undefined'
//   ){
//     alert("ENTER VALID DETAILS");
//     window.location.reload();
//   }else{
//     let data = {
//       amount , transaction_id , sn_id
//     }
//     recharge(data);
//   }
//
// })
