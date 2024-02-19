import { ComponentParam } from "seqflow-js";
import { components } from "../domains/product";

async function Loading({ dom: { render } }: ComponentParam) {
  render(`<div>Loading...</div>`)
}

export async function Home({ dom, signal, domains }: ComponentParam) {
  dom.render(`<div>
  <div id='loading'></div>
  <div id='categories'></div>
</div>`)
  dom.child('loading', Loading)

  const loadingElement = dom.querySelector('#loading')

  const categories = await domains.product.fetchProductsCategories(signal)

  loadingElement.remove()

  dom.child('categories', components.ProductCategoryList, { data: { categories } })
}
