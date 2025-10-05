import {BasePingAPI} from '@/api/endpoint/ws/common/BasePingAPI'

export class PingAPI extends BasePingAPI {
    constructor() {
        super({
            endpoint: 'ping_ipv6/'
        });
    }
}