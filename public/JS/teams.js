let navigation_btns = document.querySelectorAll('.team_navigator > div')

async function get_data(i){
  let parent = document.querySelector('.team_info_container');
  let data ;
  console.log('am i being called');
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
    data = await fetch('/members_lev_2');
    data = await data.json();
    parent.innerHTML = '';

    if(data['status'] === 0){
      window.location.href = window.location.origin + '/sign.html';
      return;
    }

    data.forEach((item, i) => {
      console.log(item);
       let child = document.createElement('div');
       child.classList.add('team_info_box');

       if(item['USER'] !== undefined || item['USER']){
         let name = item['USER'].toString().slice(0,4);
         child.innerHTML = `<h4>${name}######</h4> <h4>${item["MEMBERS"]}</h4> <h4>${item['DEPOSIT']}</h4>`
         parent.appendChild(child);
       }

    });
  }else if(i == 2){
    data = await fetch('/members_lev_3');
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
  }

}

get_data(0);

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
navigation_btns.forEach((item, i) => {
  item.addEventListener('click' , ()=>{
    navigation_btns.forEach((item, i) => {
      item.classList.remove('team_navigator_selected')
    });
    get_data(i);
    item.classList.add('team_navigator_selected')
  })
});
