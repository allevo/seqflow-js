import { ComponentParam, NavigationEvent } from "seqflow-js"
import { Header } from "./components/Header"
import { Home } from "./pages/home"
import { Login } from "./pages/login"
import { Profile } from "./pages/profile"
import { UserLoggedOutEvent } from "./domains/user/events"
import { Logout } from "./pages/logout"
import { Cart } from "./pages/cart"
import classes from './router.module.css'
import { Category } from "./pages/category"
import { CartTooltip } from "./domains/cart/components/CartTooltip"
import { Checkout } from "./pages/checkout"

async function NotFound({ dom: { render } }: ComponentParam) {
  render(`<div>
  <h1>404</h1>
  <p>Not found</p>
</div>`)
}

function getComponent(path: string) {
  console.log('AAAA', path)
  switch (true) {
    case path === '/':
      return Home
    case path === '/profile':
      return Profile
    case path === '/cart':
      return Cart
    case path === '/logout':
      return Logout
    case path === '/login':
      return Login
    case path === '/checkout':
      return Checkout
    case /category/.test(path):
      return Category
    default:
      return NotFound
  }
}

export async function Router({ dom, event }: ComponentParam) {
  dom.render(`
<div id="${classes.app}">
  <div id='header'></div>
  <main id="${classes.main}"></main>
  <div id='checkout-tooltip'></div>
</div>`)
  dom.child('header', Header)
  dom.child('checkout-tooltip', CartTooltip)

  // Default route
  dom.child(classes.main, getComponent(window.location.pathname))

  const events = event.waitEvent(
    event.navigationEvent(),
    event.domainEvent(UserLoggedOutEvent),
  )
  for await (const ev of events) {
    console.log('Router event', ev)

    if (ev instanceof NavigationEvent) {
      dom.child(classes.main, getComponent(ev.path))
    } else {
      console.error('Unknown event', ev)
    }
  }
}
