import { ComponentParam } from "seqflow-js";
import { userDomain } from "../domains/user/User";
import classes from './header.module.css'
import { CartBadge } from "../domains/cart/components/CartBadge";
import { UserLoggedEvent, UserLoggedOutEvent } from "../domains/user/events";
import { UserProfileBadge } from "../domains/user/components/UserBadge";

export async function Header({ navigate, render, waitEvent, domEvent, child, businessEvent, querySelector }: ComponentParam) {
  let user = await userDomain.getUser()

  render(`
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
  child('userProfileBadge', UserProfileBadge)
  child('cartBadge', CartBadge)


  console.log('USER', user)

  const header = querySelector<HTMLHeadElement>('header')
  let className: string
  if (user) {
    className = classes.logged
  } else {
    className = classes.unlogged
  }
  header.classList.add(className)

  const loginButton = querySelector<HTMLButtonElement>('#login-button')
  const storeLogo = querySelector<HTMLAnchorElement>(`#${classes.storeLogo}`)
  const storeLogoInner = querySelector<HTMLAnchorElement>(`#${classes.storeLogo} *`)
  const events = waitEvent(
    businessEvent(UserLoggedEvent),
    businessEvent(UserLoggedOutEvent),
    domEvent('click')
  )

  for await (const event of events) {
    if (event instanceof UserLoggedEvent) {
      header.classList.add(classes.logged)
    } else if (event instanceof UserLoggedOutEvent) {
      header.classList.remove(classes.logged)
    } else if (event.target === loginButton) {
      navigate('/login')
    } else if (event.target === storeLogo || event.target === storeLogoInner) {
      navigate('/')
    } else {
      console.error('Unknown event', event)
    }
  }
}