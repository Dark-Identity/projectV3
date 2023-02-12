
	let other =  [ 'bg1.jpg' , 'bg2.jpg' , 'bg3.jpg' , 'bg9.jpg' , 'bg10.jpg' , 'bg11.jpg' , 'bg12.jpg' , 'bg13.jpg' , 'bg14.jpg' , 'bg15.jpg' , 'bg16.jpg']

	// mobile. category 1
	let bg = [ 'bg4.jpg' , 'bg5.jpg' , 'bg6.jpg' , 'bg7.jpg' , 'bg8.jpg']

	async function add_listeners(){
		document.querySelectorAll('.receive').forEach((item, i) => {
			item.addEventListener('click' , async()=>{
        let x = item.parentElement;
				let item_id = x.querySelector('.item_id').value;

				item.replaceWith(item.cloneNode(true));;
				let config = {
					method : 'POST',
					headers : {
						'content-type' : 'application/json'
					},
					body : await JSON.stringify({item_id})
				}
				let res = await fetch('/income_redeam' , config);
				res = await res.json();
				alert(res['status']);
				window.location.reload();
			})
		});

	}

		let parent = document.querySelector('.listView');

		window.addEventListener('load', async ()=>{
      let data = await fetch('/purchase_data');
			data = await data.json();

			if(data.length){
			  data.forEach((item, i) => {
					let child = document.createElement('div');
					child.classList.add('listItem');
          let background = '';

					if( parseInt(item['category']) === 1 ){
						background = bg[parseInt(item['item_no'])];
					}else if( parseInt(item['category']) === 2){
						background = other[parseInt(item['item_no'])];
					}

			  	let child_body = `<div class="image" style='background: url(../PHOTOS/${background}) center; background-size : contain; height : 8rem;'></div>
					<div class="text">
          <input type = "text"hidden class="item_id" value = "${item.ITEM_ID}"></input>
					<div>			<strong>Price <span> ${item.price} Rs </span></strong>			<strong>Cycle <span> ${item.validity} Days </span></strong>			<strong>Daily Income <span>${item.daily_income} Rs </span></strong>
						<strong>
							Create <span>${item.DATE}</span>
						</strong>
					</div>
					<p class="receive" style="background: rgb(438, 153, 153);" data-status="1" >get</p>
					</div>`
          child.innerHTML = child_body;
					parent.appendChild(child);
			  });

				add_listeners();
			}

		})
