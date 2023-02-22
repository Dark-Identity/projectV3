
let other =  [ 'bg1.jpg' , 'bg2.jpg' , 'bg3.jpg' , 'bg9.jpg' , 'bg10.jpg' , 'bg11.jpg' , 'bg12.jpg' , 'bg13.jpg' , 'bg14.jpg' , 'bg18.jpg' , 'bg19.jpg']
// mobile ->
let bg = [ 'bg4.jpg' , 'bg5.jpg' , 'bg6.jpg' , 'bg7.jpg' , 'bg8.jpg', 'bg16.jpg' , 'bg17.jpg' ,'bg15.jpg' , 'bg20.jpg' , 'bg21.jpg']


let item_no = 0;

const section_1 = document.querySelector('.items');
const section_2 = document.querySelector('.items_2');
const lamp = document.querySelector('.lamp');
const sofa = document.querySelector('.sofa');

const lamps = () =>{
  section_2.style.display = 'none';
  section_1.style.display = 'grid';
}
const sofas = () =>{
  section_1.style.display = 'none';
  section_2.style.display = 'grid';
}
lamp.addEventListener('click' , () =>{
  lamp.parentElement.classList.add('color_changed');
  sofa.parentElement.classList.remove('color_changed');
   lamps();
});

sofa.addEventListener('click' , () =>{
  lamp.parentElement.classList.remove('color_changed');
  sofa.parentElement.classList.add('color_changed');
    sofas();
 });
 lamps();

 const lamp_sofa = document.querySelector('.Cantainer');
 const popup_lamp = document.querySelector('.lamp_popup');
 const lams = document.querySelectorAll('.lamps');
 const pop_out = document.querySelector('.fa');
 let footer = document.querySelector('footer');



 lams.forEach( (element,i )=> {
    element.addEventListener('click' ,() =>{
      item_no = i;
        let name = element.querySelector('.item_name').innerText;
        let price = element.querySelector('.item_price').innerText;
        price = parseInt(price.replace(/\D/g , ""));
        let profit = parseFloat(element.querySelector('.item_percent').innerText);
        let days = element.querySelector('.item_days').innerText;
        let day_income = element.querySelector('.item_daily_income').innerText;
        let total_revenue = element.querySelector('.item_revenue').innerText;
        
        document.querySelectorAll('.l_popup_price').forEach((item, i) => {
          item.innerText = price;
        });
        document.querySelectorAll('.l_popup_name').forEach((item, i) => {
          item.innerText = name;
        });
        document.querySelectorAll('.l_popup_validity').forEach((item, i) => {
          item.innerText = days;
        });
        document.querySelectorAll('.l_popup_revenue').forEach((item, i) => {
          item.innerText = total_revenue;
        });
        document.querySelectorAll('.l_popup_daily_income').forEach((item, i) => {
          item.innerText = day_income;
        });

        document.querySelector('.lamp_popup_backgd').style.backgroundImage = `url(../PHOTOS/${bg[i]})`;

        let parent = document.querySelector('.lamp_popup_det');
        parent.innerHTML = "";
        let child = document.createElement('ol');
        child.innerHTML = `
        <li>After purchasing ${name}, you can get income every day</li>
        <li>${name}, daily income ${day_income}, daily yield ${profit}%, contract ${days} days, total income ${total_revenue}rs, total income rate ${(profit * days).toFixed(2)}%, purchase limit unlimited.</li>
        <li> Invite friends to buy ${name} to get invitation rewards and team income</li>
        <li>You can enjoy discounts for balance purchases, you only need to pay ${price}*95%=${ ((price/100) * 95).toFixed(2)}rs</li>`

        parent.appendChild(child);

        footer.style.display = 'none';
        lamp_sofa.style.display ='none';
        popup_lamp.style.display = 'block';
    })
 });

 pop_out.addEventListener('click' ,()=>{
    popup_lamp.style.display = 'none';
    lamp_sofa.style.display ='grid';
    footer.style.display = 'grid'
 });

 const recharge = document.querySelector('#recharge');
 const bal = document.querySelector('#balance');

 recharge.addEventListener('click', () =>{
    bal.style.border = "2px solid black";
    recharge.style.border = "2px solid white";

 });
 bal.addEventListener('click', () =>{
    recharge.style.border = "2px solid black";
    bal.style.border = "2px solid white";
});

const sofaPopup = document.querySelector('.sofa_popup');
const sofass = document.querySelectorAll('.sofas');

sofass.forEach((element,i ) =>{
   element.addEventListener('click', ()=>{
     item_no = i;
     let name = element.querySelector('.item_name').innerText;
     let price = element.querySelector('.item_price').innerText;
     price = parseInt(price.replace(/\D/g , ""));
     let profit = parseFloat(element.querySelector('.item_percent').innerText);
     let days = element.querySelector('.item_days').innerText;
     let day_income = element.querySelector('.item_daily_income').innerText;
     let total_revenue = element.querySelector('.item_revenue').innerText;

     document.querySelectorAll('.s_popup_price').forEach((item, i) => {
       item.innerText = price;
     });
     document.querySelectorAll('.s_popup_name').forEach((item, i) => {
       item.innerText = name;
     });
     document.querySelectorAll('.s_popup_validity').forEach((item, i) => {
       item.innerText = days;
     });
     document.querySelectorAll('.s_popup_revenue').forEach((item, i) => {
       item.innerText = total_revenue;
     });
     document.querySelectorAll('.s_popup_daily_income').forEach((item, i) => {
       item.innerText = day_income;
     });

     document.querySelector('.sofa_popup_backgd').style.backgroundImage = `url(../PHOTOS/${other[i]})`;

     let parent = document.querySelector('.sofa_popup_det');
     parent.innerHTML = "";
     let child = document.createElement('ol');
     child.innerHTML = `
       <li>After purchasing ${name}, you can get income every day</li>
       <li>${name}, daily income ${day_income}, daily yield ${profit}%, contract ${days} days, total income ${total_revenue}rs, total income rate ${(profit * days).toFixed(2)}%, purchase limit unlimited.</li>
       <li> Invite friends to buy ${name} to get invitation rewards and team income</li>
       <li>You can enjoy discounts for balance purchases, you only need to pay ${price}*95%=${ ((price/100) * 95).toFixed(2)}rs</li>`

    parent.appendChild(child);
    footer.style.display = 'none';
    lamp_sofa.style.display ='none';
    sofaPopup.style.display ="block";
   })
});

let sofa_back = document.querySelector('#sofa_popup_out')

sofa_back.addEventListener('click' , ()=>{
  footer.style.display = 'grid';
  lamp_sofa.style.display = 'block'
  sofa_back.parentElement.parentElement.style.display = 'none';
})


document.querySelectorAll('.lamps > .background').forEach((item, i) => {
  item.style.backgroundImage = `url(../PHOTOS/${bg[i]})`;
});


document.querySelectorAll('.sofas > .background_s').forEach((item, i) => {
  item.style.backgroundImage = `url(../PHOTOS/${other[i]})`;
});


// =================== sending data to backend ====================

async function item_purchase(data){

  let btn1=  document.querySelector('#sofa_purchase_btn')
  let btn2= document.querySelector('#lamp_purchase_btn')
  btn1.replaceWith(btn1.cloneNode(true));;
  btn2.replaceWith(btn2.cloneNode(true));;
const config = {
    method : 'POST',
    headers : {
      'content-type' : 'application/json'
    },
    body : await JSON.stringify(data)
  }

  let res = await fetch('/item_purchase' , config);
  res = await res.json();

  if(res['status'] === 1){
    document.querySelector('#loading_animation').remove();
    setTimeout(function () {
      window.location.reload();
    }, 2000);
  }else{
    alert(res['status']);
    window.location.href = window.location.origin + '/sign.html';
  }

}


let btn = document.querySelector('#lamp_purchase_btn')
btn.addEventListener('click' , ()=>{
  btn.replaceWith(btn.cloneNode(true));

  let child = document.createElement('section');
  child.setAttribute('id' , 'loading_animation');
  child.innerHTML =
   `<div class="load_box">
      <div>
        <ion-icon name="reload-outline"></ion-icon>
      </div>
    </div>`;

  let parent = document.querySelector('body');
  document.querySelector('.lamp_popup').scrollTo(0,0);

  let price = parseInt(document.querySelector('.l_popup_price').innerText.replace(/\D/g , '') );
  let daily_income =  parseInt(document.querySelector('.l_popup_daily_income').innerText.replace(/\D/g , '') );
  let validity = parseInt(document.querySelector('.l_popup_validity').innerText.replace(/\D/g , '') );
  let product = document.querySelector('.l_popup_name').innerText;

  parent.appendChild(child);

  if(
    price == 'undefined' || !price ||
    daily_income == 'undefined' || !daily_income ||
    validity  == 'undefined' || !validity ||
    product == 'undefined' || !product
  ){
    window.location.reload();
  }else{
    let data = {
      price , daily_income , validity , product ,
      category : 1,
      item_no
    }

    item_purchase(data);
  }

})

let btn2 = document.querySelector('#sofa_purchase_btn')
btn2.addEventListener('click' , ()=>{
  btn2.replaceWith(btn2.cloneNode(true));
  let child = document.createElement('section');
  child.setAttribute('id' , 'loading_animation');
  child.innerHTML =
   `<div class="load_box">
      <div>
        <ion-icon name="reload-outline"></ion-icon>
      </div>
    </div>`;

  let parent = document.querySelector('body');
  document.querySelector('.lamp_popup').scrollTo(0,0);

  let price = parseInt(document.querySelector('.s_popup_price').innerText.replace(/\D/g , '') );
  let daily_income =  parseInt(document.querySelector('.s_popup_daily_income').innerText.replace(/\D/g , '') );
  let validity = parseInt(document.querySelector('.s_popup_validity').innerText.replace(/\D/g , '') );
  let product = document.querySelector('.s_popup_name').innerText;

  parent.appendChild(child);

  if(
    price == 'undefined' || !price ||
    daily_income == 'undefined' || !daily_income ||
    validity  == 'undefined' || !validity ||
    product == 'undefined' || !product
  ){
    alert('Enter all the valid details')
    window.location.reload();
  }else{
    let data = {
      price , daily_income , validity , product ,
      category : 2,
      item_no
    }

    item_purchase(data);

  }

})
