import {BaseTraceRouteAPI} from '@/api/endpoint/ws/common/BaseTraceRouteAPI'

export class TraceRouteAPI extends BaseTraceRouteAPI {
    constructor(useIPv6: boolean = false) {
        super({
            endpoint: useIPv6 ? 'traceroute_ipv6/' : 'traceroute/'
        });
    }
}