import {BasePingAPI} from '@/api/endpoint/ws/common/BasePingAPI'

export class PingAPI extends BasePingAPI {
    constructor(useIPv6: boolean = false) {
        super({
            endpoint: useIPv6 ? 'ping_ipv6/' : 'ping/'
        });
    }
}