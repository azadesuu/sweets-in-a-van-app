var addItemToCart = document.getElementsByClassName('addToCart')
var addOneItem= document.getElementsByClassName('plus-btn')
var removeOneItem=document.getElementsByClassName('min-btn')
var allItemsContainer = document.getElementsByClassName('one-item')




let products = [
    {   
        _id:'id for Cappuccino',
        item_name:'Cappuccino',
        price:4.99,
        tag:'Cappuccino',
        incart:0,
        
    },
    {   
        _id:'id for Latte',
        quantity:'value = incart value',
        item_name:'Latte',
        price:4.99,
        tag:'Latte',
        incart:0
    },
    {   
        _id:'id for Flat White',
        item_name:'Flat White',
        quantity:'value = incart value',
        price:4.99,
        tag:'Flat White',
        incart:0
    },
    {   
        _id:'id for Long Black',
        item_name:'Long Black',
        quantity:'value = incart value',
        price:4.99,
        tag:'Long Black',
        incart:0
    },
    {   
        _id:'id for Pain Biscuit',
        item_name:'Plain Biscuit',
        quantity:'value = incart value',
        price:8.99,
        tag:'Plain Biscuit',
        incart:0
    },
    { 
        _id:'id for Fancy Biscuit',
        item_name:'Fancy Biscuit',
        quantity:'value = incart value',
        price:8.99,
        tag:'Fancy Biscuit',
        incart:0
    },
    {
        _id:'id for Small Cake',
        item_name:'Small Cake',
        quantity:'value = incart value',
        price:8.99,
        tag:'Small Cake',
        incart:0
    },
    {
        _id:'id for Big Cake',
        item_name:'Big Cake',
        quantity:'value = incart value',
        price:8.99,
        tag:'Big Cake',
        incart:0
    }

];


for(let i=0;i<addItemToCart.length;i++){
       
    addItemToCart[i].addEventListener('click',() => { 
        if(addItemToCart[i].innerText == 'ADD TO CART'){
            removeOneItem[i].style.display='inline-block';
            addItemToCart[i].innerText=1;
            addOneItem[i].style.display='inline-block';
        }
        
        
        cartNumbers(products[i]);
        console.log("you select ",products[i]);
        totalCost(products[i]);
    })
}
for(let i=0;i<addItemToCart.length;i++){    

    addOneItem[i].addEventListener('click',() => { 
        console.log('you hit the +');
        addItemToCart[i].innerText= +(addItemToCart[i].innerText)+ +1;
        console.log(typeof('hhhhhhhhhhhhhh',addItemToCart[i].innerText))
        cartNumbers(products[i]);
        totalCost(products[i]);
    })
    removeOneItem[i].addEventListener('click',() => { 
        console.log('you hit the -');
        if(addItemToCart[i].innerText<2){
            addItemToCart[i].innerText='ADD TO CART'
            removeOneItem[i].style.display='none';
            addOneItem[i].style.display='none';
        }else{
            addItemToCart[i].innerText= addItemToCart[i].innerText-1;
        }
        cartNumbers2(products[i]);
        totalCost_min(products[i]);
        
        
    })
   

}






function onLoadCartNumbers(){
    let productNumbers = localStorage.getItem('cartNumbers');

    if(productNumbers){
        document.querySelector('.carts2 span').textContent = productNumbers
    }
}
function cartNumbers(product){
    console.log('the product is ',product);
    let productNumbers = localStorage.getItem('cartNumbers');   
    
    productNumbers=parseInt(productNumbers);
    if(productNumbers){
        localStorage.setItem('cartNumbers',productNumbers+1);
        document.querySelector('.carts2 span').textContent = productNumbers+1;
    }else{
        localStorage.setItem('cartNumbers',1);
        document.querySelector('.carts2 span').textContent = 1;
    }
    setItems(product);
    
}

function cartNumbers2(product){
    let productNumbers = localStorage.getItem('cartNumbers');   
    
    productNumbers=parseInt(productNumbers);
    if(productNumbers){
        localStorage.setItem('cartNumbers',productNumbers-1);
        document.querySelector('.carts2 span').textContent = productNumbers-1;
    }else{
        localStorage.setItem('cartNumbers',1);
        document.querySelector('.carts2 span').textContent = 1;
    }
    setItems_min(product);   
   
}


function setItems(product){
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    if(cartItems != null){
        if(cartItems[product.tag] == undefined){
            cartItems = {
                ...cartItems,
                [product.tag]:product
            }
        }
        cartItems[product.tag].incart+=1;
    }else{
        product.incart=1;
        cartItems = {
            [product.tag]: product
        }
    }
   
    
    localStorage.setItem('productsInCart',JSON.stringify(cartItems));
}

function setItems_min(product){
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    if(cartItems != null){
        if(cartItems[product.tag] == undefined){
            cartItems = {
                ...cartItems,
                [product.tag]:product
            }
        }
        cartItems[product.tag].incart-=1;
    }else{
        product.incart=0;
        cartItems = {
            [product.tag]: product
        }
    }
   
    
    localStorage.setItem('productsInCart',JSON.stringify(cartItems));
   
}
function totalCost_min(product){
    //console.log('the product price is ',product.price);
    let cartCost = localStorage.getItem('totalCost');
    
   

    if(cartCost != null){
        cartCost=parseFloat(cartCost);
        localStorage.setItem('totalCost', cartCost-product.price)

    }else{
        localStorage.setItem('totalCost', product.price);
    }
}

function totalCost(product){
    //console.log('the product price is ',product.price);
    let cartCost = localStorage.getItem('totalCost');
    
   

    if(cartCost != null){
        cartCost=parseFloat(cartCost);
        localStorage.setItem('totalCost', cartCost+product.price)

    }else{
        localStorage.setItem('totalCost', product.price);
    }
}



function dispalyCart(){
    let cartItems = localStorage.getItem('productsInCart');
    cartItems=JSON.parse(cartItems);   
    
    let productContainer = document.querySelector(".products");
    let cartCost = localStorage.getItem('totalCost');
    
    if(cartItems && productContainer){
        productContainer.innerHTML='';
        Object.values(cartItems).map(item=>{
            productContainer.innerHTML += `
            <div class='product'>
                <ion-icon name="close-circle-outline"></ion-icon>
                <span>${item.item_name}</span>
                <span class ='single-quantity'>Quantity:${item.incart}</span>
                <div class='single-itemTotal'>$${Math.round(item.price*item.incart*100)/100}</div>
                
                
            </div>
            `;
        });
        productContainer.innerHTML += `
            <div class='basketTotalContainer'>
                <h4 class = "basketTotalTitle">
                    Order Total: 
                </h4>
                <h4 class='basketTotal'>
                    $${Math.round(cartCost*100)/100}
                </h4>
        `
    }
    
}


onLoadCartNumbers();
dispalyCart();