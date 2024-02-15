import { Product } from "../product/ProductDomain";

class CartDomain {
  private products: Map<number, [Product, number]>

  constructor() {
    this.products = loadLocalStorage()
  }

  getProductCount(productId?: number): number {
    if (productId !== undefined) {
      const value = this.products.get(productId)
      return value ? value[1] : 0
    }
    let count = 0
    for (const [_, c] of this.products.values()) {
      count += c
    }
    return count
  }

  addToCart({ product }: { product: Product }) {
    const productId = product.id
    if (!this.products.has(productId)) {
      this.products.set(productId, [product, 0])
    }

    const value = this.products.get(productId)!

    console.log(productId, value)

    value[1] += 1

    updateLocalStorage(this.products)

    return value[1]
  }

  removeFromCart({ product }: { product: Product; }) {
    const productId = product.id
    // this never happen
    if (!this.products.has(productId)) {
      return 0
    }

    const value = this.products.get(productId)!
    value[1] -= 1

    if (value[1] === 0) {
      this.products.delete(productId)
    }

    updateLocalStorage(this.products)

    return value[1]
  }

  removeAllFromCart({ product }: { product: Product; }) {
    const productId = product.id
    this.products.delete(productId)

    updateLocalStorage(this.products)
  }

  getCart(): Cart {
    const products: Cart['products'] = []
    let total = 0
    for (const [product, count] of this.products.values()) {
      if (count === 0) {
        continue
      }
      const subTotal = product.price * count
      products.push({ product, count, subTotal })
      total += subTotal
    }
    return {
      products,
      total,
    }
  }

  checkout() {
    this.products.clear()
    updateLocalStorage(this.products)
  }
}

function updateLocalStorage(products: Map<number, [Product, number]>) {
  window.localStorage.setItem('cart', JSON.stringify(Array.from(products)))
}

function loadLocalStorage() {
  const cart = window.localStorage.getItem('cart')
  if (cart === null) {
    return new Map()
  }
  return new Map(JSON.parse(cart))
}

export const cartDomain = new CartDomain()

export interface Cart {
  products: {
    product: Product
    count: number
    subTotal: number
  }[]
  total: number
}
