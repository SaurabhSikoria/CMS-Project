const alldishes = document.getElementById('alldishes');
const maindish = document.querySelector('.main');
const orderdish = document.querySelector('.order');
const profile = document.querySelector('.profile');
const delievery = document.querySelector('.delievery');
const alldelievery = document.querySelector('#alldelievery');
const ownerinfo = JSON.parse(localStorage.getItem('owner'));
const allorders = document.querySelector('#allorders');
const {owner_id, rest_name, email, mobile, username} = JSON.parse(ownerinfo);
function showOrder () {
  maindish.style.display = 'none';
  profile.style.display = 'none';
  delievery.style.display = 'none';
  orderdish.style.display = 'block';
  getOrder();
} 
async function getOrder() {
  let result = await fetch('http://localhost/Backend/manageorders.php?'+owner_id, {
  method:'GET'}).then(res => res.json()).then(data => {
  data = data.map(item => {
      const {order_id, dish_name, custName, price, quantity, image, veg, plate} = item;
      return {order_id, dish_name, custName, price, quantity, image, veg, plate}
  })
  return data ;
});
let draft = '';
  result.forEach(item => {
    let veg = '';
    if(item.veg == 0) 
    veg = `<img src="./image/veg.png" class='veg-type' alt="Veg">`;
    else if (item.veg == 1)
    veg = `<img src="./image/non-veg.png" class='veg-type' alt="Non-Veg">`;
    draft += `<div class="singleorder">${veg}
    <div class="left">
    <img src="./image/${item.image}" alt="Image">
    <button class="success" onclick="accept(${item.order_id})">Accept</button>
    <button class="danger" onclick="denied(${item.order_id})">Reject</button>
    </div>
    <div class="order_details">
        <p>Customer : <strong>${item.custName}</strong></p>
        <p>Dish : <strong>${item.dish_name}</strong></p>
        <p>Quantity : <strong>${item.quantity}</strong></p>
        <p>Price : <strong>${item.price}</strong></p>
    </div>
  </div>`;
  })
  allorders.innerHTML = draft;
}
function accept(id) {
  fetch('http://localhost/Backend/manageorders.php?accept='+id, { 
    method : 'PATCH'
  }).then(res => res.text()).then(data => console.log(data))
}
function denied(id) {
  fetch('http://localhost/Backend/manageorders.php?denied='+id, { 
    method : 'PATCH'
  }).then(res => res.text()).then(data => console.log(data))
}
function profileDisplay() {
  maindish.style.display = 'none';
  profile.style.display = 'block';
  delievery.style.display = 'none';
  orderdish.style.display = 'none';
}
async function delievered() {
  maindish.style.display = 'none';
  profile.style.display = 'none';
  delievery.style.display = 'block';
  orderdish.style.display = 'none';
  let result = await  fetch('http://localhost/Backend/manageorders.php?DelieveryId='+owner_id, {
    method: 'GET'
  }).then(res => res.json()).then(data => {
    data = data.map(item => {
        const {order_id, dish_name, custName, price, quantity, image, veg, plate} = item;
        return {order_id, dish_name, custName, price, quantity, image, veg, plate}
    })
    return data ;
  });
  console.log(result)
  let draft = '';
    result.forEach(item => {
      let veg = '';
          if(item.veg == 0) 
          veg = `<img src="./image/veg.png" class='veg-type' alt="Veg">`;
          else if (item.veg == 1)
          veg = `<img src="./image/non-veg.png" class='veg-type' alt="Non-Veg">`;
      draft += `<div class="singleorder">
      <div class="left">
      <img src="./image/${item.image}" alt="Image">${veg}
      <h3 id="del_stat">Delievered<h3/>
      </div>
      <div class="order_details">
          <p>Customer : <strong>${item.custName}</strong></p>
          <p>Dish : <strong>${item.dish_name}</strong></p>
          <p>Quantity : <strong>${item.quantity}</strong></p>
          <p>Price : <strong>${item.price}</strong></p>
      </div>
    </div>`;
    })
    alldelievery.innerHTML = draft;
}
function Logout() {
  localStorage.clear();
  location.replace('registration.html');
}
function Active () {
  maindish.style.display = 'block';
  profile.style.display = 'none';
  delievery.style.display = 'none';
  orderdish.style.display = 'none';
}
function slide1(all){
    var slide = document.getElementById(all);
    slide.scrollIntoView();
  }
  let para2 = document.getElementById('dialogbox');
  let cross1 = document.getElementById('cross');
  const form11 = document.getElementById('form1');
  let form1 = document.createElement('form');
  form1.className='form2';
  async function create(){
  
     para2.style.display='flex';
     cross1.style.display='block';
    //  document.querySelector('.form2').style.display='none';
     form11.style.display='flex';
     para2.appendChild(form11);
     let cond = 0;
     if(cond == 0 ) {
      cond =  settingid(form11);
     }
  }
  
  function settingid(form) {
    let inp = document.createElement('input');
    inp.setAttribute('name', 'rest_id');
    inp.setAttribute('type', 'text');
    inp.setAttribute('value', ''+owner_id);
    inp.style.display = 'none' ;
    form.appendChild(inp);
    let val = 1;
    return val;
  }
  async function cross(){
  
     para2.style.display='none';
     cross1.style.display='none';
     location.reload();
   }

  

class Menu {
    async getMenu() {
        let result = fetch('http://localhost/Backend/managingapi.php?q='+owner_id, {
        method:'GET'}).then(res => res.json()).then(data => {
        let food = data.dishes;
        food = food.map(item => {
            const {dish_id, name, category ,half_price, price, veg, rest_id, image, status} = item;
            return {dish_id, name, category ,half_price, price, veg, rest_id, image, status}
        })
        return food ;
      });
      return result;
    }
}

class UI {
    showdishes(dishes) {
        let dish = '';
        dishes.forEach(item => {
          let veg = '';
          if(item.veg == 0) {
            veg = `<span class="type"><img src='image/non-veg.png'></span>`
          } else if (item.veg == 1) {
            veg = `<span class="type"><img src='image/veg.png'></span>`;
          }
          let avail = '';
          if(item.status == 'active') {
            avail = '<input type="checkbox" checked=true>';
          } else {
            avail = '<input type="checkbox" checked=false>';
          }
            dish += `<li class="listing">
            <img src="image/${item.image}" alt="image">${veg}
            <label class="labelling">
              <p contenteditable="false" class="dname" >${item.name}</p>
              <p contenteditable="false" class="catname">${item.category}</p>
              <p contenteditable="false" class="half">${item.half_price}</p>
              <p contenteditable="false" class="full">${item.price}</p>
            </label>
            <span><img class="preview" src="Image/Mail.svg" data-id=${item.dish_id}></span> 
            <span><img class="Edit_dish" id="logo1" src="Image/Edit.svg" data-id=${item.dish_id} ></span>
            <span><img class="delete_dish" src="Image/Delete.svg" data-id=${item.dish_id}></span>
            <label class="switch">${avail}<span class="slider" data-id=${item.dish_id}></span></label>
          </li>`;
        });
        alldishes.innerHTML = dish;
    }

    functioning() {
          let cpy0 = document.querySelector('#dname');
          let cpy1 = document.querySelector('#fprice');
          let cpy2 = document.querySelector('#hprice');
          let cpy3 = document.querySelector('.category');
      alldishes.addEventListener('click', event => {
        if(event.target.classList.contains('delete_dish')){
        var result = confirm("Are you sure you want to delete this dish?");
        if (result) {
          let id = event.target.dataset.id;
          alldishes.removeChild(event.target.parentElement.parentElement);
          fetch(`http://localhost/Backend/managingapi.php?q=${id}`, {
            method: 'DELETE'
          }).then(res => res.text()).then(res => console.log(res)).then(() => {
             let dmess = document.querySelector('.delscreen');
             let content = document.querySelector('.dcontent');
             dmess.style.display ='block';
             content.addEventListener('click', () => dmess.style.display ='none')
             window.addEventListener('click', (e) => {
               if(e.target == dmess)
              dmess.style.display ='none' })
          })
          .catch(err => console.log(err));
        }}
        else if(event.target.classList.contains('Edit_dish')) {
          form1.innerHTML='';
          para2.style.display='flex';
          cross1.style.display='block';
          form11.style.display='none';
          form1.style.display='block';
       
          para2.append(form1);
          let copyele = event.target.parentElement.previousElementSibling.previousElementSibling;
          let copyele2 = event.target.parentElement.parentElement.children[0];
          let copyele3 = event.target;
          
          let copyele4=document.querySelector('#form1 label input');
          let copyele41=document.querySelector('#form1 label input:last-child');
          let copyele5=document.createElement('input');
          cpy0.defaultValue = copyele.children[0].textContent;
          cpy1.defaultValue = copyele.children[3].textContent;
          cpy2.defaultValue = copyele.children[2].textContent;
          let temp = copyele.children[1].textContent;
          for(var i, j =0 ;i = cpy3.options[j]; j++)
          {
            if(i.value == temp) {
              cpy3.selectedIndex = j;
              break;
            }
          }
          form1.appendChild(cpy0);
          form1.appendChild(cpy1);
          form1.appendChild(cpy2);
          form1.appendChild(cpy3);

          copyele5.setAttribute('type','file');
          copyele5.setAttribute('class','ImgEdit');
          copyele5.setAttribute('name','image');
          copyele2.className='Imgele';
           form1.appendChild(copyele2.cloneNode());
           
           form1.appendChild(copyele3.cloneNode());
           let copyele31 =document.querySelector('.form2 #logo1');
           copyele31.after(copyele5);
           
           form1.appendChild(copyele4.cloneNode());
           form1.appendChild(copyele41.cloneNode());
           form1.innerHTML+='<button id="Editing" onclick="cross()" type="submit">Save</button>';
           
       let para = document.querySelectorAll('.form2 input[type="text"]');
       
       for (var i = 0; i < para.length; i++) {
       
             para[i].className+=' boxinput';
             para[i].contentEditable='true';
       
       }
       form1.addEventListener('submit', (e) => {
        e.preventDefault();
        const formdata = new FormData(form1);
        fetch('http://localhost/Backend/managingapi.php?'+event.target.dataset.id, {
          method: 'POST',
          body: formdata
        }).then(res => res.text()).then(item => console.log(item)).catch((err) => console.error(err))
      })
        }
        else if (event.target.classList.contains('preview')) {
          let data = event.target.parentElement.previousElementSibling;
          let img = event.target.parentElement.parentElement.children[0];
          let preview = document.querySelector('.delscreen').cloneNode();
          console.log(preview)
        }
        else if (event.target.classList.contains('slider')) {
          const item = event.target.parentElement.parentElement;
          const slider = event.target.previousElementSibling;
          let id = event.target.dataset.id;
          if (slider.checked == true){
            slider.setAttribute('checked','false');
            slider.setAttribute('unchecked','true');
            item.style.background='#f8f8f8;';
            item.style.opacity=.3;
            item.disabled=true;
            // fetch('http://localhost/Backend/managingapi.php?disable='+id, { method : 'POST'
            // }).then(res => res.text()).then(status => console.log(status)).catch(err => console.error(err));
            }
            else{
            slider.setAttribute('checked','true');
            slider.setAttribute('unchecked','false');
            item.style.opacity=1;
            item.disabled=false;
            item.style.background='rgba(255,255,255,0.3)';
            // fetch('http://localhost/Backend/managingapi.php?enable='+id, { method : 'POST'
            // }).then(res => res.text()).then(status => console.log(status)).catch(err => console.error(err));
            }
        }
      })
    }
}
const isAuthenticated = () => {
  if(typeof window == "undefined") {
      return false;
  }
  if ( localStorage.getItem('owner')) {
      return true;
  }
  else {
      return false;
  }
}
if(isAuthenticated()){
  document.addEventListener('DOMContentLoaded', () => {
      const menu = new Menu();
      const ui = new UI();

      menu.getMenu().then((data) => {
          ui.showdishes(data);
          ui.functioning();
      })
  });
} else {
  const error = document.createElement('h1');
  const wrapper = document.querySelector('.wrapper');
  error.innerHTML = '***You Need to be Authorized user to access this page***';
  wrapper.innerHTML = '';
  wrapper.appendChild(error)
}
form11.addEventListener('submit', (e) => {
  e.preventDefault();
  const formdata = new FormData(form11);
  fetch('http://localhost/Backend/managingapi.php', {
    method: 'POST',
    body: formdata
  }).then(res => res.text()).then(item => console.log(item)).catch((err) => console.error(err))
});



