const displayMenu = document.querySelector('.allDishes');
const dishprice = document.querySelector('#dish_price');
const totalamount = document.querySelector('#total_price');
const dishquantity = document.querySelector('#total_dishes');
const incartitems = document.querySelector('.items-space');
const cartbutton = document.querySelector('.footer');
const section = document.querySelector('.section');
const cartview = document.querySelector('.hiddencart');
const clearcartbtn = document.querySelector('.clear-cart');
const placeorderbtn = document.querySelector('.place-order');
const search = document.getElementById('search');
const result = document.querySelector('.result');

let cart = [];
let buttonsDom = [];
let searchword = '';

var added = 0;
function addCart() {
    let inCart = document.querySelector('.addtoCart');
    inCart.classList.add('disp');
    let removed = document.querySelector('.removefCart');
    removed.classList.remove('disp');
    added ++;
    document.getElementById('items_no').innerHTML = added;
}

function displayingcart() {
 section.classList.add('swipe')   ;
 cartview.classList.add('showingcart');
}
function closecart () {
 section.classList.remove('swipe')   ;
 cartview.classList.remove('showingcart');
}

class Menu {
    async getMenu() {
        try {
            let result = await fetch('http://localhost/Backend/Menu.php', {
                method : 'GET'
            }).then(res => res.json()).then(data => {
                let food = data.dishes.map(item => {
                    const {dish_id, name , price, image, half_price, veg, rest_id, rest_name} = item;
                    return {dish_id, name , price, image, half_price, veg, rest_id, rest_name}
                })
                return food ;
            });
            return result;
        } catch (error) {
            Error:` THere was an error with json file${error}`
        }
    }
}

class UI {

    showmenu(dishes) {
        let result = '';
        dishes.forEach(dish => {
            let veg = '';
            if(dish.veg == 0) 
            veg = `<img src="./image/veg.png" class='veg-type' alt="Veg">`;
            else if (dish.veg == 1)
            veg = `<img src="./image/non-veg.png" class='veg-type' alt="Non-Veg">`;
            result += `<div class="items ">    
            <div class="card">
                <img src="./image/${dish.image}" class="rounded" alt="Here comes the image">${veg}
                <div class="card-body">
                    <h4 class="card-title text-uppercase">${dish.rest_name}</h4>
                    <h5 class="card-title text-uppercase">${dish.name}</h5>
                    <div class="card-text text-lowercase">${dish.price}</div>
                    <button class='cd-btn btn btn-primary text-capitalize addtoCart' data-id=${dish.dish_id}>add to cart</button>
                </div>
            </div>
        </div>`;
        }) ;
        displayMenu.innerHTML = result;
    }
    cartbtn() {
        const buttons = [...document.querySelectorAll('.addtoCart')];
        buttonsDom = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            let inCart = cart.find(item => item.dish_id === id);
            if(inCart) {
                button.disabled = true;
                button.innerHTML = 'Added';
                button.classList.remove('btn-primary');
                button.classList.add('btn-success');
            } 
            button.addEventListener('click', event => {
                event.target.innerHTML = 'Added';
                event.target.disabled = true;
                event.target.classList.remove('btn-primary');
                event.target.classList.add('btn-success');
                //get item form menu
                let cartitem = { ...Storage.getItems(id), amount:1};
                cart = [...cart, cartitem];
                Storage.saveCart(cart);
                //set cart values
                this.valuesinCart(cart);
                this.addtoCart(cartitem);
                
            })
        })
    }; 
    valuesinCart(cart) {
        let temp = 0;
        let itemstotal = 0;
        cart.map(item => {
            temp += item.price * item.amount;
            itemstotal += item.amount;
        });
        dishquantity.innerHTML = itemstotal;
        totalamount.innerHTML = parseFloat(temp.toFixed(2));
    };
    addtoCart(item) {
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `<div>
        <img class="cart-img" src=${item.image} alt="ITEM IMAGE">
        <div class="quantity">
            <button class=" btn-primary amt dec-item" data-id=${item.dish_id}>-</button>
            <h3 class="d-quantity">${item.amount}</h3>
            <button class=" btn-primary amt inc-item" data-id=${item.dish_id}>+</button>
        </div>
        </div>
        <div class="cart-info">
            <h4>${item.name}</h4>
            <p>Details related to Order</p>
            <h4>restuarant</h4>
        </div>
        <div class="rice">
            <h5><span class="dish_price">Rs.${item.price}</span></h5>
            <button class="btn btn-danger remove-dish" data-id=${item.dish_id}>Remove</button>
        </div>`;
        incartitems.appendChild(div);
    }
    setupApp() {
        cart = Storage.getCart();
        this.valuesinCart(cart);
        cart.forEach(item => this.addtoCart(item));
    }
    cartworking() {
        clearcartbtn.addEventListener('click', () => {
            this.clearcart();
        });
        placeorderbtn.addEventListener('click',() => {
        var result = confirm("You Wanna confirm placing your Order");
        if(result){
            let order = localStorage.getItem('cartitems');
            // let test = JSON.parse(order);
            // var keys = Object.keys(test[0]);
            // for(let i=0; i<5; i++)
            // console.log(keys[i]);
                fetch('http://localhost/Backend/Menu.php', {
                    method : 'POST',
                    body : order
                }).then(res => res.text()).then(data => console.log(data))
        }})
        // listening to cart
        incartitems.addEventListener('click', event => {
            if (event.target.classList.contains('remove-dish')) {
                let removedish = event.target;
                let id = removedish.dataset.id;
                incartitems.removeChild(removedish.parentElement.parentElement);
                this.removeDish(id);
            } else if(event.target.classList.contains('inc-item')) {
                let increment = event.target;
                let id = increment.dataset.id;
                let oneinCart = cart.find(item => item.dish_id === id);
                oneinCart.amount = oneinCart.amount + 1;
                 Storage.saveCart(cart);
                 this.valuesinCart(cart);
                increment.previousElementSibling.innerHTML = oneinCart.amount;
            } else if(event.target.classList.contains('dec-item')) {
                let decrement = event.target;
                let id = decrement.dataset.id;
                let oneinCart = cart.find(item => item.dish_id === id);
                if(oneinCart.amount <= 1) {
                    incartitems.removeChild(decrement.parentElement.parentElement.parentElement);
                    this.removeDish(id);
                }
                else if(oneinCart.amount > 1) {
                oneinCart.amount = oneinCart.amount - 1;
                 Storage.saveCart(cart);
                 this.valuesinCart(cart);
                decrement.nextElementSibling.innerHTML = oneinCart.amount;
                }
            }
        });
    }
    clearcart() {
        let cartitems = cart.map(item => item.dish_id);
        cartitems.forEach(id => this.removeDish(id));
        while(incartitems.children.length > 0) {
            incartitems.removeChild(incartitems.children[0]);
        }
    }
    removeDish(id) {
        cart = cart.filter(item => item.dish_id !== id);
        console.log(cart);
        this.valuesinCart(cart);
        Storage.saveCart(cart);
        let button = this.getoneButton(id);
        button.disabled = false;
        button.innerHTML = 'Add to Cart';
        button.classList.add('btn-primary');
        button.classList.remove('btn-success');
    }
    getoneButton(id) {
        return buttonsDom.find(button => button.dataset.id === id);l
    }
    searching(options) {
        result.innerHTML = '';
        options.filter(data => {
            return (
                data.name.toLowerCase().includes(searchword)
            );
        }).forEach(e => {
            const li = document.createElement('li');
            li.innerHTML = e.name;
            result.appendChild(li);
        });
    }
}


class Storage {
    static saveitems (items) {
        localStorage.setItem('items', JSON.stringify(items))
    };
    static getItems(id) {
        let items = JSON.parse(localStorage.getItem('items'));
        return items.find(item => item.dish_id === id);
    }
    static saveCart(cart) {
        localStorage.setItem('cartitems', JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem('cartitems') ? JSON.parse(localStorage.getItem('cartitems')):[]
    }
}

document.addEventListener('DOMContentLoaded', () => {
 const menu = new Menu();
 const ui = new UI();

 ui.setupApp();
 menu.getMenu().then(data => {
     console.log(data);
     ui.showmenu(data);
     Storage.saveitems(data);
    }).then(() =>{ ui.cartbtn(); ui.cartworking();} );
});

search.addEventListener('input', (event) => {
 const menu = new Menu();
 const ui = new UI();
 menu.getMenu().then(data => {
    searchword =  event.target.value.toLowerCase();
    if(searchword.length !== 0) {
        ui.searching(data)
    } else {
        result.innerHTML = '';
    }
    });    
})
