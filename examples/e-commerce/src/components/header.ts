import { ComponentParam } from "seqflow-js";
import { userDomain } from "../domains/user/User";
import classes from './header.module.css'
import { CartBadge } from "../domains/cart/components/CartBadge";
import { UserLoggedEvent, UserLoggedOutEvent } from "../domains/user/events";
import { UserProfileBadge } from "../domains/user/components/UserBadge";

export async function Header({ dom, event }: ComponentParam) {
  let user = await userDomain.getUser()

  dom.render(`
  <header>
    <div class="${classes.topHeader}">
      <h1 id="${classes.storeLogo}"><a href="/">My Store</a></h1>
      <div id="userProfileBadge" class="${classes.displayOnLogged}">
      </div>
      <div id="login" class="${classes.displayOnUnlogged}">
        <button id="login-button">Sign in</button>
      </div>
      <div id="cartBadge">
      </div>
    </div>
  </header>
`)
  dom.child('userProfileBadge', UserProfileBadge)
  dom.child('cartBadge', CartBadge)


  console.log('USER', user)

  const header = dom.querySelector<HTMLHeadElement>('header')
  let className: string
  if (user) {
    className = classes.logged
  } else {
    className = classes.unlogged
  }
  header.classList.add(className)

  const loginButton = dom.querySelector<HTMLButtonElement>('#login-button')
  const storeLogo = dom.querySelector<HTMLAnchorElement>(`#${classes.storeLogo}`)
  const storeLogoInner = dom.querySelector<HTMLAnchorElement>(`#${classes.storeLogo} *`)
  const events = event.waitEvent(
    event.domainEvent(UserLoggedEvent),
    event.domainEvent(UserLoggedOutEvent),
    event.domEvent('click')
  )

  for await (const ev of events) {
    if (ev instanceof UserLoggedEvent) {
      header.classList.add(classes.logged)
    } else if (ev instanceof UserLoggedOutEvent) {
      header.classList.remove(classes.logged)
    } else if (ev.target === loginButton) {
      event.navigate('/login')
    } else if (ev.target === storeLogo || ev.target === storeLogoInner) {
      event.navigate('/')
    } else {
      console.error('Unknown event', ev)
    }
  }
}