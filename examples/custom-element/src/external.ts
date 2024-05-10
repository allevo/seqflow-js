import { createDomainEventClass } from "seqflow-js";

export const CHANGE_VALUE_EVENT_NAME = "changeValue";
export const ExternalChangeValue = createDomainEventClass<{
	newValue: number;
}>("external", CHANGE_VALUE_EVENT_NAME);
export type ExternalChangeValue = InstanceType<typeof ExternalChangeValue>;
