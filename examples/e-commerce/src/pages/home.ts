import { ComponentParam } from "seqflow-js";
import { Products } from "../components/product-list";
import { ProductType } from "../types";


async function Loading({ dom: { render } }: ComponentParam) {
  render(`<div>Loading...</div>`)
}

export async function Home({ dom, signal }: ComponentParam) {
  dom.render(`<div>
  <div id='loading'></div>
  <div id='products'></div>
</div>`)
  dom.child('loading', Loading)

  const loadingElement = dom.querySelector('#loading')

  const res = await fetch('https://fakestoreapi.com/products', { signal })
  const products = await res.json() as ProductType[]
  loadingElement.remove()

  dom.child('products', Products, { data: { products } })
}
