import { ComponentParam } from "seqflow-js"
import { userDomain } from "../domains/user/UserDomain"
import { UserLoggedOutEvent } from "../domains/user/events"

export async function Logout({ dom, event }: ComponentParam) {
  // blank
  dom.render('')
  await userDomain.logout()
  event.dispatchDomainEvent(new UserLoggedOutEvent(null))
  event.navigate('/')
}
