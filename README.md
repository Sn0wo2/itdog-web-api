# 🌐 itdog-web-api

> A TypeScript library for ping functionality using itdog.cn Web API

[![TypeScript CI](https://github.com/Sn0wo2/itdog-web-api/actions/workflows/ts.yml/badge.svg)](https://github.com/Sn0wo2/itdog-web-api/actions/workflows/ts.yml)
[![Release](https://github.com/Sn0wo2/itdog-web-api/actions/workflows/release.yml/badge.svg)](https://github.com/Sn0wo2/itdog-web-api/actions/workflows/release.yml)

[![npm version](https://img.shields.io/npm/v/itdog-web-api?color=blue)](https://www.npmjs.com/package/itdog-web-api)
[![GitHub release](https://img.shields.io/github/v/release/Sn0wo2/itdog-web-api?color=blue)](https://github.com/Sn0wo2/itdog-web-api/releases)
[![GitHub License](https://img.shields.io/github/license/Sn0wo2/itdog-web-api)](LICENSE)

---

## 📦 Installation

```bash
npm install itdog-web-api
# or
pnpm add itdog-web-api
# or
yarn add itdog-web-api
```

## 🚀 Quick Start

```typescript
import {Client} from 'itdog-web-api';

const client = new Client();

// Ping a host
const pingResult = await client.ping('google.com', (data) => {
    console.log('Ping data:', data);
});

// TCP ping with port
const tcpingResult = await client.tcping('google.com', '80', (data) => {
    console.log('TCPing data:', data);
});

// Batch TCP ping multiple hosts
const batchResult = await client.batchTCPing(['google.com', 'github.com'], '443', (data) => {
    console.log('Batch TCPing data:', data);
});

// HTTP connectivity test
const httpResult = await client.http('https://www.example.com', {
    checkMode: 'fast',
    method: 'get',
    redirectNum: 5
}, (data) => {
    console.log('HTTP test data:', data);
});
```

## 📖 API Reference

### Client

#### Constructor

```typescript
const client = new Client(options ? : ClientOptions);
```

**ClientOptions:**

- `baseURL?: string` - Custom base URL for the API (default: itdog.cn API)
- `hashToken?: string` - Optional hash token for authentication

#### Methods

##### ping(target, onMessage?)

Ping a target host.

```typescript
await client.ping('example.com', (data) => {
    console.log('Real-time ping data:', data);
});
```

**Parameters:**

- `target: string` - The target host to ping
- `onMessage?: (data: unknown) => void` - Optional callback for real-time data

##### tcping(target, port?, onMessage?)

TCP ping a target host on a specific port.

```typescript
await client.tcping('example.com', '80', (data) => {
    console.log('Real-time TCPing data:', data);
});
```

**Parameters:**

- `target: string` - The target host to ping
- `port?: string` - The port to ping (optional)
- `onMessage?: (data: unknown) => void` - Optional callback for real-time data

##### batchTCPing(hosts, port?, onMessage?, options?)

TCP ping multiple hosts simultaneously with customizable testing nodes.

```typescript
// Basic usage with default nodes
await client.batchTCPing(['google.com', 'github.com'], '443', (data) => {
    console.log('Real-time batch data:', data);
});

// Advanced usage with custom nodes
await client.batchTCPing(
    ['google.com', 'github.com'],
    '443',
    (data) => console.log('Real-time data:', data),
    {
        nodeIds: ['1310', '1227', '1339'], // Beijing, Shanghai, Guangzhou
        cidrFilter: true,
        gateway: 'first'
    }
);
```

**Parameters:**

- `hosts: string[]` - Array of target hosts to ping
- `port?: string` - The port to ping (optional)
- `onMessage?: (data: unknown) => void` - Optional callback for real-time data
- `options?: object` - Optional configuration
    - `nodeIds?: string | string[]` - Testing node IDs (see Node Selection below)
    - `cidrFilter?: boolean` - Filter network/gateway/broadcast addresses in CIDR
    - `gateway?: 'first' | 'last'` - Gateway address position

##### http(host, options?, onMessage?)

Test HTTP connectivity to a website.

```typescript
await client.http('https://example.com', {
    checkMode: 'fast',
    method: 'get',
    redirectNum: 5,
    dnsServerType: 'isp'
}, (data) => {
    console.log('Real-time HTTP test data:', data);
});
```

**Parameters:**

- `host: string` - The target URL to test
- `options?: HttpOptions` - HTTP test configuration (optional)
- `onMessage?: (data: unknown) => void` - Optional callback for real-time data

**HttpOptions:**

- `line?: string` - Test line selection
- `checkMode?: 'fast' | 'normal'` - Test mode (default: 'fast')
- `ipv4?: string` - Specific IPv4 address to use
- `method?: 'get' | 'post' | 'head'` - HTTP method (default: 'get')
- `referer?: string` - HTTP referer header
- `userAgent?: string` - Custom user agent
- `cookies?: string` - HTTP cookies
- `redirectNum?: number` - Maximum redirects to follow (default: 5)
- `dnsServerType?: 'isp' | 'custom'` - DNS server type (default: 'isp')
- `dnsServer?: string` - Custom DNS server (when dnsServerType is 'custom')

##### generic(endpoint, params?, method?, onMessage?)

Make a generic API call to any itdog.cn endpoint.

```typescript
await client.generic('/custom-endpoint/', {param1: 'value1'}, 'POST', (data) => {
    console.log('Generic API data:', data);
});
```

**Parameters:**

- `endpoint: string` - The API endpoint to call
- `params?: Record<string, unknown>` - Parameters to send (default: {})
- `method?: string` - HTTP method (default: 'POST')
- `onMessage?: (data: unknown) => void` - Optional callback for real-time data

### Advanced Usage

#### Custom API Configuration

```typescript
import {GenericAPI, GenericAPIConfig} from 'itdog-web-api';

const config: GenericAPIConfig = {
    endpoint: '/custom-ping/',
    method: 'POST'
};

const customAPI = client.createAPI(config);
const result = await customAPI.execute({target: 'example.com'});
```

#### Node Selection (Stateless)

Know available nodes before making calls:

```typescript
import {Client, DEFAULT_NODES, getNodesByCategory, getRandomNodes} from 'itdog-web-api';

// View all available nodes (before any API call)
console.log('Available nodes:', DEFAULT_NODES);
console.log('Telecom nodes:', getNodesByCategory('中国电信'));
console.log('Default random selection:', getRandomNodes()); // 4 nodes, one from each ISP

const client = new Client();

// Auto-select 4 random nodes (1 from each category)
const result1 = await client.batchTCPing(['example.com'], '443');
console.log('Used nodes:', result1.nodeIds);

// Manual selection
const result2 = await client.batchTCPing(['example.com'], '443', null, {
    nodeIds: ['1310', '1254', '1246', '1213'] // Beijing Telecom, Shanghai Unicom, Henan Mobile, Tokyo
});
```

**Categories:**

- `中国电信` - China Telecom (4 nodes)
- `中国联通` - China Unicom (4 nodes)
- `中国移动` - China Mobile (4 nodes)
- `港澳台、海外` - Overseas (4 nodes)

#### Direct API Classes

```typescript
import {PingAPI, TCPingAPI, BatchTCPingAPI, HttpAPI} from 'itdog-web-api';

const pingAPI = new PingAPI({baseURL: 'https://custom-api.com'});
const result = await pingAPI.execute({target: 'example.com'});
```

## 🛠️ Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Build the project
pnpm build

# Run linter
pnpm lint

# Run example
pnpm example
```

## 📝 Examples

Check out the [example](./example) directory for more usage examples.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ⚠️ Disclaimer / 免责声明

This project is an unofficial TypeScript library that provides convenient access to itdog.cn services. This library is not affiliated with or endorsed by itdog.cn. The underlying APIs may change without notice, which could affect the functionality of this library. This library is provided "as is" for educational and development purposes. The author is not responsible for any damages, service interruptions, or issues that may arise from using this library. If you believe this project infringes on your rights, please contact me via email on my profile or create an issue.

本项目是一个非官方的 TypeScript 库，为 itdog.cn 服务提供便捷的访问方式。本库与 itdog.cn 无任何关联或认可关系。底层接口可能随时发生变化，这可能会影响本库的功能。本库按"原样"提供，仅供学习和开发目的使用。作者不对使用本库可能产生的任何损害、服务中断或问题承担责任。如果您认为本项目侵犯了您的权利，请通过我主页的邮箱或 issues 联系我。