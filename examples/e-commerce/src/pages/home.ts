import { ComponentParam } from "seqflow-js";
import { Products } from "../components/product-list";
import { ProductType } from "../types";


async function Loading({ render }: ComponentParam) {
  render(`<div>Loading...</div>`)
}

export async function Home({ render, querySelector, child, signal }: ComponentParam) {
  render(`<div>
  <h1>Home</h1>
  <p>Welcome to my store</p>
  <div id='loading'></div>
  <div id='products'></div>
</div>`)
  child('loading', Loading)

  const loadingElement = querySelector('#loading')

  const res = await fetch('https://fakestoreapi.com/products', { signal })
  const products = await res.json() as ProductType[]
  loadingElement.remove()

  child('products', Products, { data: { products } })
}
