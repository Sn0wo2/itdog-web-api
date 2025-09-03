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

##### batchTCPing(hosts, port?, onMessage?)

TCP ping multiple hosts simultaneously.

```typescript
await client.batchTCPing(['google.com', 'github.com'], '443', (data) => {
    console.log('Real-time batch data:', data);
});
```

**Parameters:**

- `hosts: string[]` - Array of target hosts to ping
- `port?: string` - The port to ping (optional)
- `onMessage?: (data: unknown) => void` - Optional callback for real-time data

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

#### Direct API Classes

```typescript
import {PingAPI, TCPingAPI, BatchTCPingAPI} from 'itdog-web-api';

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