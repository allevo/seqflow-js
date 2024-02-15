import { ComponentParam } from "seqflow-js";
import { productDomain } from "../domains/product/ProductDomain";
import { ProductCategoryList } from "../domains/product/components/ProductCategoryList";

async function Loading({ dom: { render } }: ComponentParam) {
  render(`<div>Loading...</div>`)
}

export async function Home({ dom, signal }: ComponentParam) {
  dom.render(`<div>
  <div id='loading'></div>
  <div id='categories'></div>
</div>`)
  dom.child('loading', Loading)

  const loadingElement = dom.querySelector('#loading')

  const categories = await productDomain.fetchProductsCategories(signal)

  loadingElement.remove()

  dom.child('categories', ProductCategoryList, { data: { categories } })
}
