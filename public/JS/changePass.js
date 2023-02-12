async function changePass(data){
  const config = {
    method : 'POST',
    headers : {
      'content-type' : 'application/json'
    },
    body  : await JSON.stringify(data)
  }
  let res = await fetch('/change_pass' , config);
  res = await res.json();

  if(res['status'] === 1){
    window.location.href = window.location.origin + '/sign.html';
  }else {
    console.log(res['status']);
    alert('SOMETHING WENT WRONG');
    window.location.reload();
  }

}

document.querySelector("#change_pass").addEventListener('click', ()=>{
  let old_pass = document.querySelector('#old_pass').value;
  let new_pass = document.querySelector('#new_pass').value;
  let cnf_pass = document.querySelector('#cnf_pass').value;

  if(!old_pass || old_pass == 'undefined' ||
     !new_pass || new_pass == 'undefined' ||
     !cnf_pass || cnf_pass == 'undefined'
   ){
    alert('ENTER ALL VALID DETAILS');
    return;
  }else{

    if(new_pass === cnf_pass){
      let data = {
        previous_code : old_pass,
        new_code :  new_pass
      }
      changePass(data);
    }else{
      alert('PASSWORD DID NOT MATCHED');
      return;
    }

  }
})
