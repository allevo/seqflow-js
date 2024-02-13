import { ComponentParam } from "seqflow-js"
import { userDomain } from "../User"
import { UserLoggedEvent, UserLoggedOutEvent } from "../events"
import classes from './user-badge.module.css'

function getProfileUrl(user: { username: string }, size: number) {
  return `https://placehold.co/${size}?text=${user.username[0].toUpperCase()}`
}

export async function UserProfileBadge({ navigate, render, domEvent, waitEvent, businessEvent, querySelector }: ComponentParam) {
  const user = await userDomain.getUser() || {
    username: 'Guest'
  }

  const profileHeaderMenuId = classes['profile-header-menu']

  const size = 40
  render(`
<div>
  <a class="${classes.logoWrapper}" href="/profile">
    <img
      width="${size}"
      height="${size}"
      class="${classes.logo}"
      src="${getProfileUrl(user, size)}"
      alt="Profile Picture"
    />
  </a>
  <div style="position: relative; float: right;">
    <div id="${profileHeaderMenuId}">
      <ol>
        <li><a href="/profile">Profile</a></li>
        <li><a href="/logout">Logout</a></li>
      </ol>
    </div>
  </div>
</div>`)

  const imgEl = querySelector<HTMLImageElement>('img')
  const profileHeaderMenu = querySelector<HTMLElement>(`#${profileHeaderMenuId}`)

  const events = waitEvent(
    businessEvent(UserLoggedEvent),
    businessEvent(UserLoggedOutEvent),
    domEvent('click'),
    domEvent('mouseover'),
    domEvent('mouseout'),
  )
  for await (const event of events) {
    if (event instanceof UserLoggedEvent || event instanceof UserLoggedOutEvent) {
      let user = await userDomain.getUser() || {
        username: 'Guest'
      }
      imgEl.src = getProfileUrl(user, size)
    } else if (event.type === 'click') {
      if (event.target instanceof HTMLAnchorElement) {
        navigate(event.target.href)
      } else if (event.target instanceof HTMLImageElement) {
        navigate('/profile')
      }
    } else if (event.type === 'mouseover') {
      profileHeaderMenu.classList.add(classes.show)
    } else if (event.type === 'mouseout') {
      profileHeaderMenu.classList.remove(classes.show)
    }
  }
}
