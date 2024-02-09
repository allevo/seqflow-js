import { ComponentParam } from "seqflow-js"
import { ProductType } from "../types"
import classes from './product.module.css'
import { AddToCart } from "../domains/cart/components/AddToChart"

export async function Product({ render, data, child }: ComponentParam<{ product: ProductType }>) {
  const buttonId = `add-to-cart-${data.product.id}`

  render(`
<div class="${classes.product}">
  <div class="${classes.imageWrapper}" />
    <img 
      width="100"
      height="auto"
      class="${classes.image}"
      src="${data.product.image}" />
    <p class="price">${data.product.price}</p>
  </div>

  <div class="${classes.wrapper}">
    <p class="${classes.title}">${data.product.title}</p>
    <p class="${classes.price}">${data.product.description}</p>
  </div>
  <div id="${buttonId}"></div>
</div>`)

  child(buttonId, AddToCart, {
    data: {
      product: data.product
    }
  })
}
