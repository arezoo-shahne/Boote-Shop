import { productsData } from "./products.js";

const cartIcon = document.querySelector(".cart-btn");
const backDrop = document.querySelector(".backdrop");
const cartModal = document.querySelector(".cart");
const confirmBtn = document.querySelector(".cart-item-confirm");
const productsDOM = document.querySelector(".products-center");
const cartDOM = document.querySelector(".cart-content");
const cartItemsNumber = document.querySelector(".cart-items");
const cartTotalPrice = document.querySelector(".cart-total");
const clearCartBtn = document.querySelector(".clear-cart");

let cart = [];
let btnDom = [];
class Products {
  getProducts() {
    return productsData;
  }
}

class UI {
  showProductsData(products) {
    let result = "";
    products.forEach((item) => {
      result += `<div class="product">
        <div class="img-container">
          <img src=${item.imageUrl} class="product-img" />
        </div>
        <div class="product-desc">
          <p class="product-price">$ ${item.price}</p>
          <p class="product-title">${item.title}</p>
        </div>
        <button class="btn add-to-cart" data-id=${item.id}>
         
          add to cart
        </button>
      </div> `;
      productsDOM.innerHTML = result;
    });
  }
  showCartItems(cartItem) {
    // let cartList = "";
    // console.log(Array(cartItem))
    // Array(cartItem).forEach((item) => {
    //   cartList += `<div class="cart-item">
    //   <img class="cart-item-img" src="${item.imageUrl}" />
    //   <div class="cart-item-desc">
    //     <h4>${item.title}</h4>
    //     <h5>$ ${item.price}</h5>
    //   </div>
    //   <div class="cart-item-conteoller">
    //     <i class="fas fa-chevron-up"></i>
    //     <p>${item.quantity}</p>
    //     <i class="fas fa-chevron-down"></i>
    //   </div>
    // </div>`;
    // })
    // cartDOM.innerHTML = cartList;
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img class="cart-item-img" src="${cartItem.imageUrl}" />
      <div class="cart-item-desc">
        <h4>${cartItem.title}</h4>
        <h5>${cartItem.price}</h5>
      </div>
      <div class="cart-item-conteoller">
        <i class="fas fa-chevron-up" data-id=${cartItem.id}></i>
        <p>${cartItem.quantity}</p>
        <i class="fas fa-chevron-down" data-id=${cartItem.id}></i>
        </div>
        <i class="fa fa-trash" aria-hidden="false" data-id=${cartItem.id}></i>`;
    cartDOM.appendChild(div);
  }
  setCartValue(cart) {
    let cartItemsQuantity = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      cartItemsQuantity += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);
    cartTotalPrice.innerText = `Total Price:${totalPrice.toFixed(2)}$`;
    cartItemsNumber.innerText = cartItemsQuantity;
  }
  getAddToCartBtns() {
    const addToCartBtn = [...document.querySelectorAll(".add-to-cart")];
    btnDom = addToCartBtn;
    addToCartBtn.forEach((btn) => {
      const productId = Number(btn.dataset.id);
      const isInCart = cart.find((item) => item.id === productId);
      if (isInCart) {
        btn.innerText = "Added To Cart ;)";
        btn.disabled = true;
      }
      btn.addEventListener("click", (event) => {
        const addedProduct = { ...Storage.getProducts(productId), quantity: 1 };
        event.target.innerText = "Added To Cart ;)";
        event.target.disabled = true;
        cart = [...cart, addedProduct];
        Storage.saveCart(cart);
        this.setCartValue(cart);
        this.showCartItems(addedProduct);
      });
    });
  }
  setUpApp() {
    cart = Storage.getCart() || [];
    cart.forEach((item) => this.showCartItems(item));
    this.setCartValue(cart);
  }
  cartLogic() {
    clearCartBtn.addEventListener("click", () => this.clearCart());
    cartDOM.addEventListener("click", (event) => {
      if (event.target.classList.contains("fa-chevron-up")) {
        const itemId = event.target;
        const selectedItem = cart.find((item) => item.id == itemId.dataset.id);
        selectedItem.quantity++;
        itemId.nextElementSibling.innerText = selectedItem.quantity;
        Storage.saveCart(cart);
        this.setCartValue(cart);
      } else if (event.target.classList.contains("fa-chevron-down")) {
        const itemId = event.target;
        const selectedItem = cart.find((item) => item.id == itemId.dataset.id);
        if (selectedItem.quantity === 1) {
          this.removeItem(selectedItem.id);
          cartDOM.removeChild(itemId.parentElement.parentElement);
          if (cart.length === 0) {
            closeModal();
          }
        }
        selectedItem.quantity--;
        itemId.previousElementSibling.innerText = selectedItem.quantity;
        Storage.saveCart(cart);
        this.setCartValue(cart);
      } else if (event.target.classList.contains("fa-trash")) {
        const itemId = event.target;
        const selectedItem = cart.find((item) => item.id == itemId.dataset.id);
        this.removeItem(selectedItem.id);
        Storage.saveCart(cart);
        this.setCartValue(cart);
        cartDOM.removeChild(itemId.parentElement);
        if (cart.length === 0) {
          closeModal();
        }
      }
    });
  }
  clearCart() {
    cart.forEach((cartItem) => this.removeItem(cartItem.id));
    while (cartDOM.children.length) {
      cartDOM.removeChild(cartDOM.children[0]);
    }
    closeModal();
  }
  removeItem(id) {
    cart = cart.filter((item) => parseInt(item.id) !== parseInt(id));
    this.setCartValue(cart);
    Storage.saveCart(cart);
    const buttonss = btnDom.find((btn) => parseInt(btn.dataset.id) == id);
    buttonss.innerText = "add to cart";
    buttonss.disabled = false;
  }
  changeBtnText() {}
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProducts(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new UI();
  ui.setUpApp();
  ui.showProductsData(productsData);
  ui.getAddToCartBtns(productsData);
  ui.cartLogic();
  Storage.saveProducts(productsData);
});
// *********cart modal section**********

function openModal() {
  backDrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "40%";
}

function closeModal() {
  backDrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "0";
}

cartIcon.addEventListener("click", openModal);
confirmBtn.addEventListener("click", closeModal);
backDrop.addEventListener("click", closeModal);
