import { ComponentParam } from "seqflow-js";
import { AddToCartEvent } from "../events";

export async function CartBadge({ render, waitEvent, businessEvent, querySelector }: ComponentParam) {
  let count = 0
  render(`<div id="number-of-products-in-cart">${count}</div>`)

  const numberOfProductsInCart = querySelector('#number-of-products-in-cart')

  const events = waitEvent(
    businessEvent(AddToCartEvent)
  )
  for await (const event of events) {
    const product = event.detail
    count++
    numberOfProductsInCart.textContent = count.toString()
  }

}