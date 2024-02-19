import { ComponentParam } from "seqflow-js";
import { Cart } from "../CartDomain";
import { Product } from "../../product/ProductDomain";
import classes from './CartProductList.module.css'
import { ChangeCartEvent } from "../events";

export async function CartProduct({ dom, data, event, domains }: ComponentParam<{ product: Product, count: number, subTotal: number }>) {
  dom.render(`
<div class="${classes.product}" id="cart-product-${data.product.id}">
  <div class="${classes.left}">
    <img class="${classes.productImage}" src="${data.product.image}" alt="${data.product.title}" />
    <div>${data.product.price} €</div>
  </div>
  <div class="${classes.productTitle}">
    <p>${data.product.title}</p>
  </div>
  <div>x ${data.count}</div>
  <div>= ${data.subTotal} €</div>
  <button class="remove-from-cart">
    <i class="fa-solid fa-trash"></i>
  </button>
</div>`)

  const button = dom.querySelector('.remove-from-cart')!

  const events = event.waitEvent(
    event.domEvent('click')
  )
  for await (const ev of events) {
    if (button.contains(ev.target as Node)) {
      domains.cart.removeAllFromCart({ product: data.product })
      event.dispatchDomainEvent(new ChangeCartEvent({ product: data.product, action: 'remove-all' }))
    }
  }

}

export async function CartProductList({ dom, data, event, domains }: ComponentParam<{ cart: Cart }>) {
  dom.render(`
<div id="cart-product-list">
  <ul class="${classes.cartProducts}" id="cart-products">
    ${data.cart.products.map(({ product: { id } }) => `<li id="cart-item-${id}"></li>`).join('')}
  </ul>
  <hr />
  <div class="${classes.cartTotal}" id="cart-total">
    total: ${data.cart.total} €
  </div>
  <div class="${classes.cartCheckout}" id="cart-checkout">
    <button id="checkout-button">Checkout</button>
  </div>
  <div id="cart-login">
    <a id="cart-login-link" href="/login">Go to login</button>
  </div>
</div>`)
  for (const { product, count, subTotal } of data.cart.products) {
    dom.child(`cart-item-${product.id}`, CartProduct, { data: { product, count, subTotal } })
  }

  const cartCheckoutWrapper = dom.querySelector('#cart-checkout')!
  const cartLoginWrapper = dom.querySelector('#cart-login')!
  const cartLoginLink = dom.querySelector('#cart-login-link')!
  const checkoutButton = dom.querySelector('#checkout-button')!
  const cartTotal = dom.querySelector('#cart-total')!
  const cartProducts = dom.querySelector('#cart-products')!

  const isLogged = domains.user.isLoggedIn()
  if (isLogged) {
    cartLoginWrapper.remove()
  } else {
    cartCheckoutWrapper.remove()
  } 

  const events = event.waitEvent(
    event.domEvent('click'),
    event.domainEvent(ChangeCartEvent)
  )
  for await (const ev of events) {
    if (ev.target === cartLoginLink) {
      event.navigate('/login')
    }
    if (ev.target === checkoutButton && isLogged) {
      event.navigate('/checkout')
    }
    if (ev instanceof ChangeCartEvent) {
      const cart = domains.cart.getCart()
      cartProducts.innerHTML = cart.products.map(({ product: { id } }) => `<li id="cart-item-${id}"></li>`).join('')
      for (const { product, count, subTotal } of cart.products) {
        dom.child(`cart-item-${product.id}`, CartProduct, { data: { product, count, subTotal } })
      }
      cartTotal.textContent = `total: ${cart.total} €`
    }
  }
}