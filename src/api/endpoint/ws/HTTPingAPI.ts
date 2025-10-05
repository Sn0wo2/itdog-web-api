import {BaseHTTPingAPI} from '@/api/endpoint/ws/common/BaseHTTPingAPI'

export class HTTPingAPI extends BaseHTTPingAPI {
    constructor() {
        super({
            endpoint: 'httping'
        });
    }
}