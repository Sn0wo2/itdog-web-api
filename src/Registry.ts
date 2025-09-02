import { BaseAPI } from './api/BaseAPI';
import { ItdogOptions } from './types';

export type APIConstructor<T extends BaseAPI = BaseAPI> = new (options: ItdogOptions) => T;

export class Registry {
    private static apis = new Map<string, APIConstructor>();

    static register(name: string, apiClass: APIConstructor): void {
        this.apis.set(name, apiClass);
    }

    static get(name: string): APIConstructor | undefined {
        return this.apis.get(name);
    }

    static list(): string[] {
        return Array.from(this.apis.keys());
    }

    static create<T extends BaseAPI>(name: string, options: ItdogOptions): T {
        const APIClass = this.apis.get(name);
        if (!APIClass) {
            throw new Error(`API '${name}' is not registered`);
        }
        return new APIClass(options) as T;
    }
}