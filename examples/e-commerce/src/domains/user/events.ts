import { createDomainEventClass } from "@seqflow/seqflow";
import type { UserType } from "./UserDomain";

export const UserLoggedEvent = createDomainEventClass<UserType, "userLoggedIn">(
	"user",
	"userLoggedIn",
);
export type UserLoggedEvent = InstanceType<typeof UserLoggedEvent>;

export const UserLoggedOutEvent = createDomainEventClass(
	"user",
	"userLoggedOut",
);
export type UserLoggedOutEvent = InstanceType<typeof UserLoggedOutEvent>;
