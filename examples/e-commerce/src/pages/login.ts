import { ComponentParam } from "seqflow-js"
import { UserType, userDomain } from "../domains/user/User"
import { UserLoggedEvent } from "../domains/user/events"


export async function Login({ render, querySelector, dispatchDomainEvent, domEvent, waitEvent, navigate }: ComponentParam) {
  render(`<div>
  <form>
    <label for="username">Username</label>
    <input type="text" name="username" value="johnd" />
    <p class="error"></p>
    <button type="submit">Login</button>
  </form>
</div>`)

  const el = querySelector<HTMLInputElement>('input[name="username"]')
  const p = querySelector('.error')
  const button = querySelector<HTMLButtonElement>('button')

  const events = waitEvent(domEvent('submit', e => e.target instanceof HTMLFormElement))
  let user: UserType | undefined
  for await (const _ of events) {
    button.disabled = true
    const username = el.value

    user = await userDomain.login({ username })
    if (!user) {
      p.textContent = 'User not found. Try "johnd"'
      button.disabled = false
      continue
    }
    break
  }

  dispatchDomainEvent(new UserLoggedEvent(user!))
  navigate('/')
}