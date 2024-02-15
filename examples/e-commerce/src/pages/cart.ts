import { ComponentParam } from "seqflow-js";
import { cartDomain } from '../domains/cart/CartDomain'
import { userDomain } from '../domains/user/UserDomain'
import { CartProductList } from "../domains/cart/components/CartProductList";

export async function Cart({ dom }: ComponentParam) {
  const cart = cartDomain.getCart()
  dom.render(`<div id="cart-product-list"></div>`)

  if (cart.products.length !== 0) {
    dom.child('cart-product-list', CartProductList, { data: { cart } })
  } else {
    dom.render(`<div>Cart is empty</div>`)
  }
}
