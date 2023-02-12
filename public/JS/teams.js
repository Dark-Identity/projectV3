let navigation_btns = document.querySelectorAll('.team_navigator > div')

async function get_data(i){
  let parent = document.querySelector('#level1');
  let data ;

  if(i == 0){

    data = await fetch('/members_lev_1');
    data = await data.json();
    parent.innerHTML = '';

    if(data['status'] === 0){
      window.location.href = window.location.origin + '/sign.html';
      return;
    }

    data.forEach((item, i) => {
       let child = document.createElement('div');
       child.classList.add('team_info_box');
       if(item['USER'] !== undefined || item['USER']){
         let name = item['USER'].toString().slice(0,4);
         child.innerHTML = `<h4>${name}######</h4> <h4>${item["MEMBERS"]}</h4> <h4>${item['DEPOSIT']}</h4>`
         parent.appendChild(child);
       }
    });

  }else if(i == 1){
    let data2;
    let parent2 = document.querySelector('#level2');
    data2 = await fetch('/members_lev_2');
    data2 = await data2.json();
    console.log('level2' , data2);
    parent2.innerHTML = '';

    if(data2['status'] === 0){
      window.location.href = window.location.origin + '/sign.html';
      return;
    }

    data2.forEach((item, i) => {
       let child = document.createElement('div');
       child.classList.add('team_info_box');
       console.log(item);
       if(item.length > 0){

       if(item[0]['USER'] !== undefined || item[0]['USER']){
         let name = item[0]['USER'].toString().slice(0,4);
         child.innerHTML = `<h4>${name}######</h4> <h4>${item[0]["MEMBERS"]}</h4> <h4>${item[0]['DEPOSIT']}</h4>`
         parent2.appendChild(child);
       }
     }

    });
  }else if(i == 2){
    let data3;
    let parent3 = document.querySelector('#level3');
    data3 = await fetch('/members_lev_3');
    data3 = await data3.json();
    console.log('level3' , data3);
    parent3.innerHTML = '';

    if(data3['status'] === 0){
      window.location.href = window.location.origin + '/sign.html';
      return;
    }

    data3.forEach((item, i) => {
       let child = document.createElement('div');
       child.classList.add('team_info_box');
       if(item.length > 0){

       if(item[0]['USER'] !== undefined || item[0]['USER']){
         let name = item[0]['USER'].toString().slice(0,4);
         child.innerHTML = `<h4>${name}######</h4> <h4>${item[0]["MEMBERS"]}</h4> <h4>${item[0]['DEPOSIT']}</h4>`
         parent3.appendChild(child);
       }
     }
    });
  }

}

 get_data(0);
 get_data(1);
 get_data(2);

async function get_required_data(){
  let data = await fetch('/teams_data');
  data = await data.json();

  if(data['status'] === 0){
    window.location.href = window.location.origin + "/sign.html";
    return;
  }else{
    document.querySelector('#M_number').innerText = data['number'];
    document.querySelector('#M_invited').innerText = data['invited'];
    document.querySelector('#M_team').innerText = data['team'];
  }

}
get_required_data();

let cards = document.querySelectorAll('.team_info_container > div');

navigation_btns.forEach((item, i) => {
  item.addEventListener('click' , ()=>{
    navigation_btns.forEach((item, i) => {
      item.classList.remove('team_navigator_selected')
    });
    // get_data(i);
    for(let j = 0; j<cards.length; j++){
      cards[j].style.left = '-100vw';
    }
    cards[i].style.left = '0';

    item.classList.add('team_navigator_selected')
  })
});
