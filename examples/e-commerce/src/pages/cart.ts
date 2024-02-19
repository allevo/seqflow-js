import { ComponentParam } from "seqflow-js";
import { components } from "../domains/cart";

export async function Cart({ dom, domains }: ComponentParam) {
  const cart = domains.cart.getCart()
  dom.render(`<div id="cart-product-list"></div>`)

  if (cart.products.length !== 0) {
    dom.child('cart-product-list', components.CartProductList, { data: { cart } })
  } else {
    dom.render(`<div>Cart is empty</div>`)
  }
}
