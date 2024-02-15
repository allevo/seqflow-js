import { ComponentParam } from "seqflow-js";
import { ChangeCartEvent, CheckoutEndedCartEvent } from "../events";
import { cartDomain } from '../CartDomain'
import classes from './cart-badge.module.css'

export async function CartBadge({ event, dom }: ComponentParam) {
  let count = cartDomain.getProductCount()
  dom.render(`
<a href="/cart" class="${classes.numberOfProductsInCart}">
  <i class="fa-solid fa-cart-shopping ${classes.icon}"></i>
  <span class="${classes.cartProductCounter}">${count}</span>
</a>`)

  const numberOfProductsInCart = dom.querySelector(`.${classes.numberOfProductsInCart} span`)

  const events = event.waitEvent(
    event.domainEvent(ChangeCartEvent),
    event.domainEvent(CheckoutEndedCartEvent),
    event.domEvent('click')
  )
  for await (const ev of events) {
    if (ev instanceof ChangeCartEvent || ev instanceof CheckoutEndedCartEvent) {
      numberOfProductsInCart.textContent = `${cartDomain.getProductCount()}`
    } else {
      // click event
      event.navigate('/cart')
    }
  }

}