# ITDOG Web API

A TypeScript library for network testing functionality using itdog.cn Web API.

## Installation

```bash
npm install itdog-web-api
```

## Usage

### Basic Usage

```typescript
import {Client} from 'itdog-web-api'

const client = new Client()

// Ping test
const result = await client.ping({target: 'baidu.com'})
console.log(result)
```

### Using Custom Fetch Client

You can pass a custom fetch client to the Client constructor to enable features like proxy support:

```typescript
import {Client} from 'itdog-web-api'
import {HttpsProxyAgent} from 'https-proxy-agent'

// Create a custom fetch client with proxy support
const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    // Add proxy agent to requests
    const proxyAgent = new HttpsProxyAgent('http://proxy.example.com:8080')

    // Merge proxy agent with existing options
    const options = {
        ...init,
        agent: proxyAgent
    }

    // Call the original fetch function
    return fetch(input, options)
}

// Pass the custom fetch client to the Client constructor
const client = new Client({
    fetch: customFetch
})

// Use the client as usual
const result = await client.dns({target: 'baidu.com'})
console.log(result)
```

### API Methods

- `ping(options)` - Perform a ping test
- `tcping(options)` - Perform a TCP ping test
- `http(options)` - Perform an HTTP test
- `dns(options)` - Perform a DNS lookup
- `traceRoute(options)` - Perform a traceroute test
- `batchTCPing(options)` - Perform batch TCP ping tests
- `generic(endpoint, params, method)` - Call a custom API endpoint

## Configuration

The Client constructor accepts an options object with the following properties:

- `baseURL` - The base URL for API requests (default: 'https://www.itdog.cn/')
- `hashToken` - The hash token for API authentication
- `fetch` - A custom fetch client for making HTTP requests

## ⚠️ Disclaimer / 免责声明

This project is an unofficial TypeScript library that provides convenient access to itdog.cn services. This library is not affiliated with or endorsed by itdog.cn. The underlying APIs may change without notice, which could affect the functionality of this library. This library is provided "as is" for educational and development purposes. The author is not responsible for any damages, service interruptions, or issues that may arise from using this library. If you believe this project infringes on your rights, please contact me via email on my profile or create an issue.

本项目是一个非官方的 TypeScript 库，为 itdog.cn 服务提供便捷的