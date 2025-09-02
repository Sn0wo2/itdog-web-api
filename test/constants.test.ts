import {API_BASE_URL, ITDOG_HASH_TOKEN} from '../src/data/const';

describe('Constants', () => {
    test('API_BASE_URL is defined and valid', () => {
        expect(API_BASE_URL).toBeDefined();
        expect(typeof API_BASE_URL).toBe('string');
        expect(API_BASE_URL.length).toBeGreaterThan(0);
        expect(API_BASE_URL.startsWith('http')).toBe(true);
    });

    test('ITDOG_HASH_TOKEN is defined', () => {
        expect(ITDOG_HASH_TOKEN).toBeDefined();
        expect(typeof ITDOG_HASH_TOKEN).toBe('string');
        expect(ITDOG_HASH_TOKEN.length).toBeGreaterThan(0);
    });
});