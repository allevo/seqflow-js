import { createDomainEventClass } from "seqflow-js";
import type { UserType } from "./UserDomain";

export const UserLoggedEvent = createDomainEventClass<UserType>(
	"user",
	"userLoggedIn",
);
export type UserLoggedEvent = InstanceType<typeof UserLoggedEvent>;

export const UserLoggedOutEvent = createDomainEventClass<null>(
	"user",
	"userLoggedOut",
);
export type UserLoggedOutEvent = InstanceType<typeof UserLoggedOutEvent>;
