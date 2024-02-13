import { ComponentParam, NavigationEvent } from "seqflow-js"
import { Header } from "./components/header"
import { userDomain } from "./domains/user/User"
import { Home } from "./pages/home"
import { Login } from "./pages/login"
import { Profile } from "./pages/profile"
import { UserLoggedOutEvent } from "./domains/user/events"
import { Logout } from "./pages/logout"
import { Cart } from "./pages/cart"

async function NotFound({ render }: ComponentParam) {
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

export async function Router({ render, waitEvent, child, navigationEvent, businessEvent }: ComponentParam) {
  render(`<div id='header'></div><main id='main'></main>`)

  child('header', Header)

  // Default route
  child('main', getComponent(window.location.pathname))

  const events = waitEvent(
    navigationEvent(),
    businessEvent(UserLoggedOutEvent),
  )
  for await (const ev of events) {
    console.log('Router event', ev)

    if (ev instanceof NavigationEvent) {
      const user = await userDomain.restoreUser()
      console.log('URL', ev.path)

      child('main', getComponent(ev.path))
    } else if (ev instanceof UserLoggedOutEvent) {
      console.log('UserLoggedOutEvent', ev)
      child('main', Login)
    } else {
      console.error('Unknown event', ev)
    }
  }
}
