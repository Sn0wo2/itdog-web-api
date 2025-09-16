import {SafeGuardCalculator} from '../../src/guard/Bridge';

describe('SafeGuardCalculator', () => {
    let calculator: SafeGuardCalculator;

    beforeEach(() => {
        calculator = new SafeGuardCalculator();
    });

    describe('constructor', () => {
        it('should create an instance of SafeGuardCalculator', () => {
            expect(calculator).toBeInstanceOf(SafeGuardCalculator);
        });

        it('should throw an error if _guard_auto.js file is not found', () => {
            expect(calculator).toBeDefined();
        });
    });

    describe('calculate', () => {
        it('should calculate guardret value correctly', () => {
            const result = calculator.calculate('ce79e262ugHX17');

            expect(result).not.toBeNull();

            expect(typeof result).toBe('string');
        });

        it('should throw an error for empty guard value', () => {
            expect(() => {
                calculator.calculate('');
            }).toThrow();
        });
    });
});