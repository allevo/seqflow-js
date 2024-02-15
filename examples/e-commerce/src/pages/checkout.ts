import { ComponentParam } from "seqflow-js";
import { cartDomain } from '../domains/cart/CartDomain'
import { CheckoutEndedCartEvent } from "../domains/cart/events";

export async function Checkout({ dom, event }: ComponentParam) {
  cartDomain.checkout()
  event.dispatchDomainEvent(new CheckoutEndedCartEvent(null))

  dom.render(`
<p>Well done!</p>
<a id="go-home-after-checkout" href="/">Go home</a>
`)
  const goHomeAfterCheckout = dom.querySelector('#go-home-after-checkout')!

  const events = event.waitEvent(
    event.domEvent('click')
  )
  for await (const ev of events) {
    if (ev.target === goHomeAfterCheckout) {
      event.navigate('/')
    }
  }
}
