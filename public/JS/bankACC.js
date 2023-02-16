
async function set_bank_details(data){

  const config = {
    method : 'POST',
    headers : {
      'content-type' : 'application/json'
    },
    body : await JSON.stringify(data)
  }
  let res = await fetch('/set_bank_details' , config);
  res = await res.json();
  if(res['status'] === 1){
    alert('BANK DETAILS ADDED');
    window.location.reload();
  }else{
    alert(res['status']);
    window.location.reload();
  }

}

document.querySelector('#bank_acc_create').addEventListener('click' , ()=>{

  let name = document.querySelector('#u_name').value;
  let Bank_name = document.querySelector('#Bank_name').value;
  let ac_number = document.querySelector('#Acc_numb').value;
  let withdraw_pass = document.querySelector('#withdraw_pass').value;
  let phone = document.querySelector('#phone').value;
  let ifsc = document.querySelector('#ifsc').value;

  if(
    !name || name == undefined ||
    !Bank_name || Bank_name == undefined ||
    !ac_number || ac_number == undefined ||
    !withdraw_pass || withdraw_pass == undefined ||
    !phone || phone == undefined||
    !ifsc || ifsc == undefined
  ){
    alert('ENTER ALL THE DETAILS');
    return;
  }else{
    let data = {
      name , Bank_name , ac_number , withdraw_pass , ifsc
    };
    set_bank_details(data);
  }

})
