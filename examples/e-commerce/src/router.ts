import { ComponentParam, NavigationEvent } from "seqflow-js"
import { Header } from "./components/header"
import { userDomain } from "./domains/user/User"
import { Home } from "./pages/home"
import { Login } from "./pages/login"
import { Profile } from "./pages/profile"
import { UserLoggedOutEvent } from "./domains/user/events"
import { Logout } from "./pages/logout"

async function NotFound({ render }: ComponentParam) {
  render(`<div>
  <h1>404</h1>
  <p>Not found</p>
</div>`)
}

export async function Router({ render, waitEvent, child, navigationEvent, businessEvent }: ComponentParam) {
  render(`<div id='header'></div><main id='main'></main>`)


  child('header', Header)

  const user = await userDomain.restoreUser()
  if (user) {
    // Default route
    child('main', Home)
  } else {
    child('main', Login)
  }

  const events = waitEvent(
    navigationEvent(),
    businessEvent(UserLoggedOutEvent),
  )
  for await (const ev of events) {
    console.log('Router event', ev)

    if (ev instanceof NavigationEvent) {
      const user = await userDomain.restoreUser()
      console.log('URL', ev.path)

      if (ev.path === '/') {
        child('main', Home)
      } else if (ev.path === '/profile') {
        child('main', Profile, {
          data: {
            user: user!,
          }
        })
      } else if (ev.path === '/logout') {
        child('main', Logout)
      } else {
        child('main', NotFound)
      }
    } else if (ev instanceof UserLoggedOutEvent) {
      child('main', Login)
    } else {
      console.error('Unknown event', ev)
    }
  }
}
