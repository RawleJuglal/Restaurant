import './style.css'
import { menuArray } from './data.js'

const menuFeedEl = document.getElementById('menu-feed')
const orderFeedEl = document.getElementById('order-feed')
const modalEl = document.getElementById('modal');
let userOrder = {
    pizza:0,
    hamburger:0,
    beer:0,
    isDisplayed:false,
    cardInfo:{
        name:'',
        number:'',
        ccv:''
    }
}

document.addEventListener('click', (e)=>{
    if(e.target.dataset.item){
        handleAddClick(Number(e.target.dataset.item))
    } else if (e.target.dataset.remove){
        handleRemoveClick(e.target.dataset.remove.split('-')[2])
    } else if (e.target.dataset.complete){
        handleCompleteClick()
    } else if (e.target.dataset.card){
        e.preventDefault()
        handlePayClick()
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
    if(!document.getElementById('completion').classList.contains('hidden')){
        toggleHidden(document.getElementById('completion'))
    }

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
    userOrder[value] = 0

    if(!checkForAllFalsy()){
        renderOrder()
    }
    
}

function checkForAllFalsy(){
    if(userOrder.pizza === 0 &&  userOrder.hamburger === 0 && userOrder.beer === 0){
        toggleHidden(orderFeedEl);
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
            OrderFeedHtml+= createOrderItemHtml(item)
        } else if(item.name === 'Hamburger' && userOrder.hamburger > 0){
            OrderFeedHtml+= createOrderItemHtml(item)
        } else if (item.name === 'Beer' && userOrder.beer > 0){
            OrderFeedHtml+= createOrderItemHtml(item)
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
                        <button id="order-complete" class="--restaurant-btn text-center" data-complete="modal">Complete Order</button>
                    </div>`

    orderFeedEl.innerHTML = OrderFeedHtml
    
    if(!userOrder.isDisplayed){
        toggleHidden(orderFeedEl);
        userOrder.isDisplayed = true;
    }
}

function createOrderItemHtml(item){
    const itemAmount = item.price * Number(userOrder[item.name.toLowerCase()]);
    const itemForFeed = `<div id="${item.name.toLowerCase()}-container" class="--order-item-container"><p id="order-item-${item.name}" class="--item-name">${item.name}</p>
    <button id="order-btn" class="--order-btn-remove" data-remove="order-item-${item.name.toLowerCase()}">remove</button>
    <p id="order-item-price" class="--item-price push-right">$${itemAmount}</p></div>`
    return itemForFeed
}

function handleCompleteClick(){
    toggleHidden(modalEl)
}

function handlePayClick(){
    let passed = checkInputsMeetChecks()
    passed ? saveCardInfo() : renderErrorMessage()
    
}

function checkInputsMeetChecks(){
    if(document.getElementById('cardInfo-name').value.length > 0 && Number.isInteger(Number(document.getElementById('cardInfo-number').value)) && document.getElementById('cardInfo-number').value.length === 16 && document.getElementById('cardInfo-ccv').value.length === 3 && Number.isInteger(Number(document.getElementById('cardInfo-ccv').value))){
        return true;
    } else {
        return false;
    }
}

function saveCardInfo(){
    let cardName = document.getElementById('cardInfo-name')
    let cardNumber = document.getElementById('cardInfo-number')
    let cardCCV = document.getElementById('cardInfo-ccv')

    let newCard = {
        name:cardName.value,
        number:cardNumber.value,
        ccv:cardCCV.value,
    }
    userOrder.cardInfo = newCard;

    //EMPTY CARD INFO
    cardName.value = ''
    cardNumber.value = ''
    cardCCV.value = ''

    //HIDES ERROR MESSAGE AGAIN IF THEY RESOLVE SECOND ATTEMPT
    if(!document.getElementById('error-message').classList.contains('hidden')){
        toggleHidden(document.getElementById('error-message'))
    }

    //RESET USERORDER ITEMS
    resetUserOrderItems()

    //SHOW COMPLETED ORDER DIV
    toggleHidden(document.getElementById('completion'))
    document.getElementById('completion-text').textContent = `Thanks ${userOrder.cardInfo.name}! Your order is on it's way`

    //CLOSE MODAL
    toggleHidden(document.getElementById('modal'))
}

function renderErrorMessage(){
    toggleHidden(document.getElementById('error-message'))
}

function resetUserOrderItems(){
    userOrder.pizza = 0;
    userOrder.hamburger = 0;
    userOrder.beer = 0;

    orderFeedEl.innerHTML = ''
}

function toggleHidden(ele){
    ele.classList.toggle('hidden')
}

renderFeed()