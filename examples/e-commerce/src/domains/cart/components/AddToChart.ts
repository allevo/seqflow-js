import { ComponentParam } from "seqflow-js"
import { AddToCartEvent } from "../events"
import { ProductType } from "../../../types"

export async function AddToCart({ render, data, querySelector, waitEvent, dispatchDomainEvent, domEvent }: ComponentParam<{ product: ProductType }>) {
  render(`
<div>
    <button type="button">Add to cart</button>
</div>`)

  const button = querySelector('button')!
  const events = waitEvent(domEvent('click', e => e.target === button))
  for await (const _ of events) {
    dispatchDomainEvent(new AddToCartEvent({ product: data.product }))
  }
}
