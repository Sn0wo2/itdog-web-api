import {BaseTraceRouteAPI} from '@/api/endpoint/ws/common/BaseTraceRouteAPI'

export class TraceRouteAPI extends BaseTraceRouteAPI {
    constructor() {
        super({
            endpoint: 'traceroute/'
        });
    }
}