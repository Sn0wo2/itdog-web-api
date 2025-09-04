import {Client} from "../src";
import {DEFAULT_GENERIC_API_TESTS, DEFAULT_SIMPLE_TESTS, TestRunner} from "./test-helpers";

const client = new Client();
const testRunner = new TestRunner(client);

async function runAllTests() {
    await testRunner.runSimpleTests(DEFAULT_SIMPLE_TESTS);

    console.warn('\n' + '='.repeat(50) + '\n');

    await testRunner.runGenericAPITests(DEFAULT_GENERIC_API_TESTS);
}

runAllTests().catch(console.error);