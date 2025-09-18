import {Client} from '@/Client.ts'
import type {DNSParams} from '@/types.ts'

const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    console.log('Using custom fetch client')
    console.log('Request URL:', input)

    return fetch(input, init)
}

const client = new Client({
    fetch: customFetch
})

async function testCustomFetch() {
    try {
        console.log('Testing DNS API with custom fetch client...')

        const params: DNSParams = {
            target: 'www.baidu.com',
            line: '',
            dnsType: 'a',
            dnsServerType: 'isp',
            dnsServer: ''
        }

        const result = await client.dns(params, (data) => {
            console.log('Real-time data:', data)
        })

        console.log('Final result:', result)
    } catch (error) {
        console.error('Test failed:', error)
    }
}

testCustomFetch().catch(console.error)