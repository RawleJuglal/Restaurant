import './style.css'
import { menuArray } from './data.js'

const menuFeedEl = document.getElementById('menu-feed')
const orderFeedEl = document.getElementById('order-feed')
let userOrder = {
    pizza:0,
    hamburger:0,
    beer:0,
    isDisplayed:false,
}

document.addEventListener('click', (e)=>{
    if(e.target.dataset.item){
        // console.log('we have a data item')
        handleAddClick(Number(e.target.dataset.item))
    } else if (e.target.dataset.remove){
        handleRemoveClick(e.target.dataset.remove.split('-')[2])
    }  else {
        console.log('we did not get an index')
    }
})

function getFeedHTML(){
    let menuFeedHtml = ''
    menuArray.forEach((item)=>{
        let ingredientStr = item.ingredients.map((ingredient)=>{
                return ingredient
        }).reduce((prevStr, currStr)=>{
            return prevStr += `, ${currStr}`;
        })
        // console.log(ingredientStr)
        menuFeedHtml+=`<div id="${item.id}" class="--menu-item-container">
        <div id="item-img">
          <span id="item-emoji" class="item-emoji">${item.emoji}</span>
        </div>
        <div id="item-info">
          <p id="item-name" class="--item-name">${item.name}</p>
          <p id="item-ingredients" class="--item-ingredients">${ingredientStr}</p>
          <p id="item-price" class="--item-price">$${item.price}</p>
        </div>
        <div id="item-btn" class="--item-btn">
          <button id="item-add-btn" class="--item-add-btn" data-item="${item.id}"><i class="fa-solid fa-plus" data-item="${item.id}"></i></button>
        </div>
      </div>`
    })

    return menuFeedHtml
}

function renderFeed(){
    menuFeedEl.innerHTML = getFeedHTML()
}

function handleAddClick(value){
    if(value === 0){
        userOrder.pizza = userOrder.pizza +1;
    } else if (value === 1){
        userOrder.hamburger = userOrder.hamburger +1;
    } else if (value === 2){
        userOrder.beer = userOrder.beer +1;
    } else {
        console.log('we did not get a matching value')
    }
    renderOrder()
}

function handleRemoveClick(value){
    if(value === 'pizza'){
        userOrder.pizza = 0;
    } else if (value === 'hamburger'){
        userOrder.hamburger = 0;
    } else if (value === 'beer'){
        userOrder.beer = 0;
    }
    if(!checkForAllFalsy()){
        renderOrder()
    }
    
}

function checkForAllFalsy(){
    if(userOrder.pizza === 0 &&  userOrder.hamburger === 0 && userOrder.beer === 0){
        orderFeedEl.classList.toggle('hidden')
        userOrder.isDisplayed = false;
        return true;
    } else {
        return false;
    }
}

function renderOrder(){
    orderFeedEl.innerHTML = ''
    let OrderFeedHtml = ''
    OrderFeedHtml += `<div id="order-text-container" class="--order-text-container">
    <h1 id="order-title" class="--order-title text-center">Your Order</h1>
    <div id="order-item-container" class="--order-items-container">`
    menuArray.forEach((item)=>{
        if(item.name === 'Pizza' && userOrder.pizza > 0){
            const pizzaAmount = item.price * userOrder.pizza;
            OrderFeedHtml+= `<div id="${item.name.toLowerCase()}-container" class="--order-item-container"><p id="order-item-${item.name}" class="--item-name">${item.name}</p>
            <button id="order-btn" class="--order-btn-remove" data-remove="order-item-${item.name.toLowerCase()}">remove</button>
            <p id="order-item-price" class="--item-price push-right">$${pizzaAmount}</p></div>`
        } else if(item.name === 'Hamburger' && userOrder.hamburger > 0){
            const burgerAmount = item.price * userOrder.hamburger;
            OrderFeedHtml+= `<div id="${item.name.toLowerCase()}-container" class="--order-item-container"><p id="order-item-${item.name}" class="--item-name">${item.name}</p>
            <button id="order-btn" class="--order-btn-remove" data-remove="order-item-${item.name.toLowerCase()}">remove</button>
            <p id="order-item-price" class="--item-price push-right">$${burgerAmount}</p></div>`
        } else if (item.name === 'Beer' && userOrder.beer > 0){
            const beerAmount = item.price * userOrder.beer;
            OrderFeedHtml+= `<div id="${item.name.toLowerCase()}-container" class="--order-item-container"><p id="order-item-${item.name}" class="--item-name">${item.name}</p>
            <button id="order-btn" class="--order-btn-remove" data-remove="order-item-${item.name.toLowerCase()}">remove</button>
            <p id="order-item-price" class="--item-price push-right">$${beerAmount}</p></div>`
        } else {
            console.log(`didn't have any ${item.name}`)
        }
    })
    let totalPrice = (menuArray[0].price * userOrder.pizza) + (menuArray[1].price * userOrder.hamburger) + (menuArray[2].price * userOrder.beer);
    OrderFeedHtml+=`</div>
                        <div id="total-container" class="--total-container">
                        <p id="order-total" class="--order-total">Total price:</p>
                        <p id="order-amount" class="--order-amount push-right">$${totalPrice}</p>
                        </div>
                        <button id="order-complete" class="--order-complete text-center">Complete Order</button>
                    </div>`
    // console.log(OrderFeedHtml)
    orderFeedEl.innerHTML = OrderFeedHtml
    
    if(!userOrder.isDisplayed){
        orderFeedEl.classList.toggle('hidden')
        userOrder.isDisplayed = true;
    }
}

renderFeed()