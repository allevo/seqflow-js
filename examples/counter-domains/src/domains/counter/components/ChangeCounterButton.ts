import { ComponentParam } from "seqflow-js";

export async function ChangeCounterButton({ dom, event, domains, data }: ComponentParam<{ delta: number, text: string }>) {
  dom.render(`<button type="button">${data.text}</button>`)
  const events = event.waitEvent(event.domEvent('click'))
  for await (const _ of events) {
    domains.counter.applyDelta(data.delta)
  }
}
