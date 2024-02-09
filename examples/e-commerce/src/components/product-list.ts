import { ComponentParam } from "seqflow-js"
import { ProductType } from "../types"
import { Product } from "./product"
import classes from './product-list.module.css'

export async function Products({ render, data, child }: ComponentParam<{ products: ProductType[] }>) {
  const ids = data.products.map(p => p.id)
  render(`<ol class="${classes.productList}" id='products'>${ids.map(id => `<li id="product-${id}"></id>`)}</ol>`)

  for (const product of data.products) {
    child(`product-${product.id}`, Product, { data: { product } })
  }
}
