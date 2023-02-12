function select(tag) {
  return document.querySelector(tag);
}
function selectAll(tag){
  return document.querySelectorAll(tag);
}


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

select('#recharge').addEventListener('click' , ()=>{
   selectAll('.payment_amount').forEach((item, i) => {
     item.innerText = select('#amount').value;
   });
   prompt_user('Tip !' , 'recharge successfull' , 'payment.html');
})
