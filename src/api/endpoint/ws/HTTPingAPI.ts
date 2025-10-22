import {BaseHTTPingAPI} from '@/api/endpoint/ws/common/BaseHTTPingAPI'

export class HTTPingAPI extends BaseHTTPingAPI {
    constructor(useIPv6: boolean = false) {
        super({
            endpoint: useIPv6 ? 'httping_ipv6/' : 'httping/'
        });
    }
}