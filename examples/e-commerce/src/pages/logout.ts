import { ComponentParam } from "seqflow-js"
import { userDomain } from "../domains/user/User"
import { UserLoggedOutEvent } from "../domains/user/events"

export async function Logout({ render, dispatchDomainEvent, navigate }: ComponentParam) {
  // blank
  render('')
  await userDomain.logout()
  dispatchDomainEvent(new UserLoggedOutEvent(null))
  navigate('/')
}
