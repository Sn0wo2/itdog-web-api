import {BaseTCPingAPI} from '@/api/endpoint/ws/common/BaseTCPingAPI'

export class TCPingAPI extends BaseTCPingAPI {
    constructor(useIPv6: boolean = false) {
        super({
            endpoint: useIPv6 ? 'tcping_ipv6/' : 'tcping/'
        });
    }
}
