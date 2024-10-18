import { createDomainEventClass } from "@seqflow/seqflow";

export const CHANGE_VALUE_EVENT_NAME = "changeValue" as const;
export const ExternalChangeValue = createDomainEventClass<
	{
		newValue: number;
	},
	typeof CHANGE_VALUE_EVENT_NAME
>("external", CHANGE_VALUE_EVENT_NAME);
export type ExternalChangeValue = InstanceType<typeof ExternalChangeValue>;
