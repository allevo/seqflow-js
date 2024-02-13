import { ComponentParam } from "seqflow-js";
import { AddToCartEvent } from "../events";
import classes from './cart-badge.module.css'

export async function CartBadge({ event, dom }: ComponentParam) {
  let count = 0
  dom.render(`
<a href="/cart" id="${classes.numberOfProductsInCart}">
  <i class="fa-solid fa-cart-shopping ${classes.icon}"></i>
  <span class="${classes.cartProductCounter}">${count}</span>
</a>`)

  const numberOfProductsInCart = dom.querySelector(`#${classes.numberOfProductsInCart} span`)

  const events = event.waitEvent(
    event.domainEvent(AddToCartEvent),
    event.domEvent('click')
  )
  for await (const ev of events) {
    if (ev instanceof AddToCartEvent) {
      const product = ev.detail
      count++
      numberOfProductsInCart.textContent = count.toString()
    } else {
      // click event
      event.navigate('/cart')
    }
  }

}