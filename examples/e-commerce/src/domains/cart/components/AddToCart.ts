import { ComponentParam } from "seqflow-js"
import { ChangeCartEvent } from "../events"
import { Product } from "../../product/ProductDomain"
import { cartDomain } from "../CartDomain"
import classes from './AddToCart.module.css'

export async function AddToCart({ dom, event, data }: ComponentParam<{ product: Product }>) {
  const initCount = cartDomain.getProductCount(data.product.id)

  dom.render(`
<div>
    <button class="${classes.firstAddToCart} ${classes.show}" type="button">Add to cart</button>
      <div class="${classes.otherAddToCartWrapper}">
        <button class="${classes.removeFromCart}">-</button>
        <span class="count">${initCount}</span>
        <button class="${classes.secondAddFromCart}">+</button>
      </div>
</div>`)

  const firstAddToCart = dom.querySelector(`.${classes.firstAddToCart}`)!
  const otherAddToCartWrapper = dom.querySelector(`.${classes.otherAddToCartWrapper}`)!
  const removeFromCart = dom.querySelector(`.${classes.removeFromCart}`)!
  const secondAddFromCart = dom.querySelector(`.${classes.secondAddFromCart}`)!
  const count = dom.querySelector('.count')!

  if (initCount > 0) {
    count.textContent = `${initCount}`
    firstAddToCart.classList.remove(classes.show)
    otherAddToCartWrapper.classList.add(classes.show)
  }

  const events = event.waitEvent(event.domEvent('click'))
  for await (const ev of events) {
    switch (true) {
      case ev.target === firstAddToCart: {
        const c = cartDomain.addToCart({ product: data.product })
        count.textContent = `${c}`
        event.dispatchDomainEvent(new ChangeCartEvent({ product: data.product, action: 'add' }))
        otherAddToCartWrapper.classList.add(classes.show)
        firstAddToCart.classList.remove(classes.show)
        break
      }
      case ev.target === removeFromCart: {
        const remain = cartDomain.removeFromCart({ product: data.product })
        count.textContent = `${remain}`
        event.dispatchDomainEvent(new ChangeCartEvent({ product: data.product, action: 'remove' }))
        if (remain === 0) {
          otherAddToCartWrapper.classList.remove(classes.show)
          firstAddToCart.classList.add(classes.show)
        }
        break
      }
      case ev.target === secondAddFromCart: {
        const c = cartDomain.addToCart({ product: data.product })
        count.textContent = `${c}`
        event.dispatchDomainEvent(new ChangeCartEvent({ product: data.product, action: 'add' }))
        break
      }
    }
  }
}
