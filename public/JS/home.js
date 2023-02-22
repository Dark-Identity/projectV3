function select(tag) {
  return document.querySelector(tag);
}

function selectAll(tag){
  return document.querySelectorAll(tag);
}


var swiper = new Swiper(".mySwiper", {
      spaceBetween: 30,
      centeredSlides: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });

// ------------------- BACK BUTTON ------------------------
selectAll('.back_btn').forEach((item, i) => {
  item.addEventListener('click' , ()=>{
    item.parentElement.parentElement.style.left = '-100vw';
  })
});

// --------------------LOAD THE POPUPS --------------------
selectAll('.navigator').forEach((item, i) => {
  item.addEventListener('click' , ()=>{
    selectAll('.home_popups')[i].style.left = '0vw';
  })
});


// --------------------------QR CODE GENERATION ---------------------

let qr_code_element = document.querySelector("#qrcode");

function generate(value) {
  qr_code_element.style = "";

  var qrcode = new QRCode(qr_code_element, {

    text: `${value}`,
    width: 180, //128
    height: 180,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

}

//---------- calling the generate function with a value having our inv code;

async function get_inv(){
  let inv = await fetch('/get_inv_code');
  inv = await inv.json();
  if(inv['INV'] !== 0){
    document.querySelector('.inv_code > h1').innerText = inv['INV'];
    select('#inv_link').innerText = window.location.origin+'/signup.html?'+inv['INV'];
    generate(window.location.origin+'/signup.html?'+inv['INV']);
  }else{
    window.location.href = window.location.origin + "/sign.html";
    return;
  }

}

get_inv();

async function copyPageUrl(text) {
  try {
    await navigator.clipboard.writeText(text);
    alert('LINK COPIED');
  } catch (err) {
    alert('Failed to copy');
  }
}

select('#cpy_btn').addEventListener('click' , ()=>{
  let inv =   document.querySelector('.inv_code > h1').innerText;
  let str = window.location.origin + '/signup.html?' + inv;
  // navigator.clipboard.writeText(str);
  copyPageUrl(str)
})
