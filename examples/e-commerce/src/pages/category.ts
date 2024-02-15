import { ComponentParam } from "seqflow-js"
import { productDomain } from "../domains/product/ProductDomain"
import { CardList } from "../components/CardList"
import { ProductItem } from "../domains/product/components/ProductItem"


async function Loading({ dom: { render } }: ComponentParam) {
  render(`<div>Loading...</div>`)
}

export async function Category({ dom, signal }: ComponentParam) {
  dom.render(`<div>
  <div id='loading'></div>
  <div id="banner"></div>
  <div id='products'></div>
</div>`)
  dom.child('loading', Loading)

  const segments = window.location.pathname.split('/')
  segments.shift()
  const p = segments.map(s => decodeURIComponent(s))

  const loadingElement = dom.querySelector('#loading')
  const { 1: categoryId } = p

  const products = await productDomain.fetchProductsByCategory({ categoryId }, signal)

  loadingElement.remove()

  dom.child('products', CardList, {
    data: {
      prefix: 'category',
      items: products,
      component: ProductItem
    }
  })
}
