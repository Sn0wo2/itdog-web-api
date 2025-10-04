import {Request} from "@/Request"
import {ClientOptions, RawResponse, RequestConfig} from "@/types";

export abstract class BaseAPI {
    protected options: ClientOptions | undefined;

    protected constructor(options?: ClientOptions) {
        this.options = options
    }

    protected setOptions(options: ClientOptions): this {
        this.options = options
        return this
    }

    protected async rawRequest(config: RequestConfig): Promise<RawResponse> {
        return Request.makeGuardRequest(config)
    }
}