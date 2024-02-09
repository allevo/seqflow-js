import { createDomainEventClass } from "seqflow-js"
import { ProductType } from "../../types"

export const AddToCartEvent = createDomainEventClass<{ product: ProductType }>('cart', 'addToCart')
export type AddToCartEventT = InstanceType<typeof AddToCartEvent>
