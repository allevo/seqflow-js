import { ComponentParam } from "seqflow-js";

export async function Checkout({ dom, event, domains }: ComponentParam) {
  domains.cart.checkout()

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
