import { ComponentParam } from "seqflow-js"
import { AddToCartEvent } from "../events"
import { ProductType } from "../../../types"

export async function AddToCart({ dom, event, data }: ComponentParam<{ product: ProductType }>) {
  dom.render(`
<div>
    <button type="button">Add to cart</button>
</div>`)

  const button = dom.querySelector('button')!
  const events = event.waitEvent(event.domEvent('click'))
  for await (const _ of events) {
    event.dispatchDomainEvent(new AddToCartEvent({ product: data.product }))
  }
}
