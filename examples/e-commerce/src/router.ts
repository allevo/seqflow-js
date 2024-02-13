import { ComponentParam, NavigationEvent } from "seqflow-js"
import { Header } from "./components/header"
import { userDomain } from "./domains/user/User"
import { Home } from "./pages/home"
import { Login } from "./pages/login"
import { Profile } from "./pages/profile"
import { UserLoggedOutEvent } from "./domains/user/events"
import { Logout } from "./pages/logout"
import { Cart } from "./pages/cart"

async function NotFound({ dom: { render } }: ComponentParam) {
  render(`<div>
  <h1>404</h1>
  <p>Not found</p>
</div>`)
}

function getComponent(path: string) {
  console.log('AAAA', path)
  switch (path) {
    case '/':
      return Home
    case '/profile':
      return Profile
    case '/cart':
      return Cart
    case '/logout':
      return Logout
    case '/login':
      return Login
    default:
      return NotFound
  }
}

export async function Router({ dom, event }: ComponentParam) {
  dom.render(`<div id='header'></div><main id='main'></main>`)
  dom.child('header', Header)

  // Default route
  dom.child('main', getComponent(window.location.pathname))

  const events = event.waitEvent(
    event.navigationEvent(),
    event.domainEvent(UserLoggedOutEvent),
  )
  for await (const ev of events) {
    console.log('Router event', ev)

    if (ev instanceof NavigationEvent) {
      dom.child('main', getComponent(ev.path))
    } else if (ev instanceof UserLoggedOutEvent) {
      dom.child('main', Login)
    } else {
      console.error('Unknown event', ev)
    }
  }
}
