import { Stop } from "../stop/stop"

export interface Route {
    id: number,
    start: Date,
    description: string,
    stops: Stop[],
    finished: boolean
}
