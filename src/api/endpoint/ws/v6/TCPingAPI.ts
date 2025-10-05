import {BaseTCPingAPI} from '@/api/endpoint/ws/common/BaseTCPingAPI'

export class TCPingAPI extends BaseTCPingAPI {
    constructor() {
        super({
            endpoint: 'tcping_ipv6/'
        });
    }
}
