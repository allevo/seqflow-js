import { ComponentParam } from "seqflow-js";
import { UserType, userDomain } from "../domains/user/User";
import classes from './header.module.css'
import { CartBadge } from "../domains/cart/components/CartBadge";
import { UserLoggedEvent, UserLoggedOutEvent } from "../domains/user/events";

async function UserProfileBadge({ render, data }: ComponentParam<{ user: UserType }>) {
  const size = 40
  const profileUrl = `https://placehold.co/${size}?text=${data.user.username[0].toUpperCase()}`
  render(`
<img
  width="${size}"
  height="${size}"
  class="${classes.logo}"
  src="${profileUrl}"
  alt="Profile Picture"
/>`)
}

async function NavigationBar({ render, waitEvent, domEvent, navigate }: ComponentParam) {
  render(`
<a href="/">Home</a>
<a href="/profile">Profile</a>
<a href="/cart">Cart</a>
<a href="/logout">Logout</a>
`)

  const events = waitEvent(
    domEvent('click', ev => ev.target instanceof HTMLElement)
  )
  for await (const event of events) {
    const a = event.target as HTMLAnchorElement
    const href = new URL(a.href)
    navigate(href.pathname)
  }
}

async function Empty({ render }: ComponentParam) {
  render('')
}

export async function Header({ render, waitEvent, child, businessEvent, querySelector }: ComponentParam) {
  let user = await userDomain.getUser()

  render(`
  <header>
    <div class="${classes.topHeader}">
      <h1>My Store</h1>
      <div>
        ${user ? `Hello, ${user.username}` : ''}
      </div>
      <div id="userProfileBadge" class="${classes.logoWrapper}">
      </div>
      <div id="cartBadge">
    </div>
  </header>
  <nav id="headerNavigation">
  </nav>
`)
  child('headerNavigation', NavigationBar)
  child('cartBadge', CartBadge)

  const navigationBar = querySelector('#headerNavigation')
  if (user) {
    child('userProfileBadge', UserProfileBadge, {
      data: {
        user: user!,
      }
    })
  } else {
    navigationBar.style.display = "none";
  }

  const events = waitEvent(
    businessEvent(UserLoggedEvent),
    businessEvent(UserLoggedOutEvent),
  )
  for await (const event of events) {
    console.log('header', event)
    if (event instanceof UserLoggedEvent) {
      child('userProfileBadge', UserProfileBadge, {
        data: {
          user: user!,
        }
      })
      navigationBar.style.display = "block";
    } else {
      child('userProfileBadge', Empty)
      navigationBar.style.display = "none";
    }
  }
}