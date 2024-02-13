import { ComponentParam, start, createBusinessEventBus } from 'seqflow-js'
import { userDomain } from './domains/user/User'
import { Router } from './router'

async function main({ dom }: ComponentParam) {
  await userDomain.restoreUser()

  dom.render(`<div id='router'></div>`)
  dom.child('router', Router)
}

start(document.getElementById('root')!, main, {
  log(log) {
    console.log(log)
  },
  businessEventBus: {
    user: createBusinessEventBus(),
    cart: createBusinessEventBus(),
  },
  navigationEventBus: new EventTarget(),
})

declare module 'seqflow-js' {
  interface BusinessEventBus {
    user: ReturnType<typeof createBusinessEventBus>
    cart: ReturnType<typeof createBusinessEventBus>
  }
}
