import { ComponentParam } from "seqflow-js"
import { userDomain } from "../User"
import { UserLoggedEvent, UserLoggedOutEvent } from "../events"
import classes from './user-badge.module.css'

function getProfileUrl(user: { username: string }, size: number) {
  return `https://placehold.co/${size}?text=${user.username[0].toUpperCase()}`
}

export async function UserProfileBadge({ event, dom }: ComponentParam) {
  const user = await userDomain.getUser() || {
    username: 'Guest'
  }

  const profileHeaderMenuId = classes['profile-header-menu']

  const size = 40
  dom.render(`
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

  const imgEl = dom.querySelector<HTMLImageElement>('img')
  const profileHeaderMenu = dom.querySelector<HTMLElement>(`#${profileHeaderMenuId}`)

  const events = event.waitEvent(
    event.domainEvent(UserLoggedEvent),
    event.domainEvent(UserLoggedOutEvent),
    event.domEvent('click'),
    event.domEvent('mouseover'),
    event.domEvent('mouseout'),
  )
  for await (const ev of events) {
    if (ev instanceof UserLoggedEvent || ev instanceof UserLoggedOutEvent) {
      let user = await userDomain.getUser() || {
        username: 'Guest'
      }
      imgEl.src = getProfileUrl(user, size)
    } else if (ev.type === 'click') {
      if (ev.target instanceof HTMLAnchorElement) {
        event.navigate(ev.target.href)
      } else if (ev.target instanceof HTMLImageElement) {
        event.navigate('/profile')
      }
    } else if (ev.type === 'mouseover') {
      profileHeaderMenu.classList.add(classes.show)
    } else if (ev.type === 'mouseout') {
      profileHeaderMenu.classList.remove(classes.show)
    }
  }
}
