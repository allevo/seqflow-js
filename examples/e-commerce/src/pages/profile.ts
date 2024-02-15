import { ComponentParam } from "seqflow-js";
import { UserType, userDomain } from "../domains/user/UserDomain";

export async function Profile({ dom, event }: ComponentParam) {
  const user = await userDomain.getUser()
  if (!user) {
    event.navigate('/login')
    return
  }
  dom.render(`<div>
  <h1>Profile</h1>
  <dl>
    <dt>Username</dt>
    <dd>${user.username}</dd>
    <dt>Email</dt>
    <dd>${user.email}</dd>
  </dl>
</div>`)
}