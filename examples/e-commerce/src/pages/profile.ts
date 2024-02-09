import { ComponentParam } from "seqflow-js";
import { UserType } from "../domains/user/User";

export async function Profile({ render, data }: ComponentParam<{ user: UserType }>) {
  render(`<div>
  <h1>Profile</h1>
  <dl>
    <dt>Username</dt>
    <dd>${data.user.username}</dd>
    <dt>Email</dt>
    <dd>${data.user.email}</dd>
  </dl>
</div>`)
}