import { ComponentParam } from "seqflow-js";
import { AddToCartEvent } from "../events";
import classes from './cart-badge.module.css'

export async function CartBadge({ navigate, domEvent, render, waitEvent, businessEvent, querySelector }: ComponentParam) {
  let count = 0
  render(`
<a href="/cart" id="${classes.numberOfProductsInCart}">
  <i class="fa-solid fa-cart-shopping ${classes.icon}"></i>
  <span class="${classes.cartProductCounter}">${count}</span>
</a>`)

  const numberOfProductsInCart = querySelector(`#${classes.numberOfProductsInCart} span`)

  const events = waitEvent(
    businessEvent(AddToCartEvent),
    domEvent('click')
  )
  for await (const event of events) {
    if (event instanceof AddToCartEvent) {
      const product = event.detail
      count++
      numberOfProductsInCart.textContent = count.toString()
    } else {
      // click event
      navigate('/cart')
    }
  }

}