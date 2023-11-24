import { Order } from "../order/order";

export interface Stop {
    id: number,
    postalCode: string,
    houseNumber: string,
    delivered: boolean,
    routeId: number,
    order: Order
}
