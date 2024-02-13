import { ComponentParam } from "seqflow-js"
import { ProductType } from "../types"
import { Product } from "./product"
import classes from './product-list.module.css'

export async function Products({ dom, data }: ComponentParam<{ products: ProductType[] }>) {
  const ids = data.products.map(p => p.id)
  dom.render(`<ol class="${classes.productList}" id='products'>${ids.map(id => `<li id="product-${id}"></id>`)}</ol>`)

  for (const product of data.products) {
    dom.child(`product-${product.id}`, Product, { data: { product } })
  }
}
