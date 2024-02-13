import { ComponentParam } from "seqflow-js";
import { UserType, userDomain } from "../domains/user/User";

export async function Profile({ render, navigate }: ComponentParam) {
  const user = await userDomain.getUser()
  if (!user) {
    navigate('/login')
    return
  }
  render(`<div>
  <h1>Profile</h1>
  <dl>
    <dt>Username</dt>
    <dd>${user.username}</dd>
    <dt>Email</dt>
    <dd>${user.email}</dd>
  </dl>
</div>`)
}