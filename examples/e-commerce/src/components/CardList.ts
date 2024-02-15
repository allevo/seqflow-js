import { ChildOption, ComponentParam } from "seqflow-js";
import classes from './CardList.module.css'

export async function CardList<T extends { id: string | number }>({ dom, data }: ComponentParam<{ prefix: string, items: T[], component: (p: ComponentParam<T>) => Promise<void>}>) {
  dom.render(
    `<ol class="${classes.wrapper}">
      ${data.items.map(item => `<li class="${classes.element}" id="${data.prefix}-${item.id}"></li>`).join('')}
    </ol>
  `)
  for (const item of data.items) {
    const option: ChildOption<T> = { data: item } as ChildOption<T>
    dom.child(`${data.prefix}-${item.id}`, data.component, option)
  }
}


