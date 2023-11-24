import { StopRequest } from "../stop/stop-request";

export interface RouteRequest {
    start: Date;
    description: string;
    stops: StopRequest[];
}
