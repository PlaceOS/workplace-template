import { registerAssetMocks } from './lib/api/assets.mock';
import { registerBookingMocks } from './lib/api/bookings.mock';
import { registerCalendarMocks } from './lib/api/calendars.mock';
import { registerEventMocks } from './lib/api/events.mock';
import { registerSurveyMocks } from './lib/api/surveys.mock';
import { registerSystemMocks } from './lib/api/systems.mock';
import { registerUserMocks } from './lib/api/users.mock';
import { registerZoneMocks } from './lib/api/zones.mock';
import { registerAllMocks, registerMocks } from './mocks';

// Mock the registerMockEndpoint function from @placeos/ts-client
jest.mock('@placeos/ts-client', () => ({
    registerMockEndpoint: jest.fn(),
    mockSystem: jest.fn(),
    registerSystem: jest.fn(),
}));

// Mock the log function from @placeos/common
jest.mock('@placeos/common', () => ({
    log: jest.fn(),
    predictableRandomInt: jest.fn(() => 42),
    timePeriodsIntersect: jest.fn(() => true),
    flatten: jest.fn((arr) => arr.flat()),
    HashMap: {},
    padString: jest.fn((str, len) => str.toString().padStart(len, '0')),
}));

// Mock data imports
jest.mock('./lib/api/assets.data', () => ({
    MOCK_ASSETS: [],
    MOCK_CATEGORIES: [],
    MOCK_PRODUCTS: [],
    MOCK_PURCHASE_ORDERS: [],
}));

jest.mock('./lib/api/bookings.data', () => ({
    MOCK_BOOKINGS: [],
}));

jest.mock('./lib/api/events.data', () => ({
    MOCK_EVENTS: [],
}));

jest.mock('./lib/api/users.data', () => ({
    ACTIVE_USER: {
        id: 'test-user',
        email: 'test@example.com',
        name: 'Test User',
    },
    MOCK_GUESTS: [],
    MOCK_STAFF: [],
}));

jest.mock('./lib/api/spaces.data', () => ({
    MOCK_SPACES: [],
}));

jest.mock('./lib/api/zone.data', () => ({
    MOCK_BUILDINGS: [],
    MOCK_LEVELS: [],
    MOCK_ORGS: [],
    MOCK_ZONES: [],
}));

jest.mock('./lib/systems-bindings.mock', () => ({
    createSystem: jest.fn(),
}));

describe('Mock Registration System', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registerAllMocks', () => {
        it('should be a function', () => {
            expect(typeof registerAllMocks).toBe('function');
        });

        it('should call registerAllMocks without throwing', () => {
            expect(() => registerAllMocks()).not.toThrow();
        });

        it('should accept options parameter', () => {
            expect(() =>
                registerAllMocks({ enableLogging: false }),
            ).not.toThrow();
        });
    });

    describe('registerMocks convenience object', () => {
        it('should have all expected mock categories', () => {
            expect(registerMocks).toHaveProperty('zones');
            expect(registerMocks).toHaveProperty('users');
            expect(registerMocks).toHaveProperty('systems');
            expect(registerMocks).toHaveProperty('events');
            expect(registerMocks).toHaveProperty('calendars');
            expect(registerMocks).toHaveProperty('bookings');
            expect(registerMocks).toHaveProperty('assets');
            expect(registerMocks).toHaveProperty('surveys');
        });

        it('should have all functions as callable', () => {
            Object.values(registerMocks).forEach((mockFn) => {
                expect(typeof mockFn).toBe('function');
            });
        });
    });

    describe('individual registration functions', () => {
        const registrationFunctions = [
            { name: 'registerUserMocks', fn: registerUserMocks },
            { name: 'registerBookingMocks', fn: registerBookingMocks },
            { name: 'registerEventMocks', fn: registerEventMocks },
            { name: 'registerCalendarMocks', fn: registerCalendarMocks },
            { name: 'registerAssetMocks', fn: registerAssetMocks },
            { name: 'registerSurveyMocks', fn: registerSurveyMocks },
            { name: 'registerSystemMocks', fn: registerSystemMocks },
            { name: 'registerZoneMocks', fn: registerZoneMocks },
        ];

        registrationFunctions.forEach(({ name, fn }) => {
            it(`${name} should be a function`, () => {
                expect(typeof fn).toBe('function');
            });

            it(`${name} should not throw when called`, () => {
                expect(() => fn()).not.toThrow();
            });
        });
    });

    describe('mock registration behavior', () => {
        it('should call individual registration functions when registerAllMocks is called', () => {
            // Import the registerMockEndpoint mock
            const { registerMockEndpoint } = require('@placeos/ts-client');

            // Call registerAllMocks
            registerAllMocks();

            // Verify that registerMockEndpoint was called (indicating mocks were registered)
            expect(registerMockEndpoint).toHaveBeenCalled();
        });

        it('should register mocks when individual functions are called', () => {
            const { registerMockEndpoint } = require('@placeos/ts-client');

            // Call an individual registration function
            registerUserMocks();

            // Verify that registerMockEndpoint was called
            expect(registerMockEndpoint).toHaveBeenCalled();
        });

        it('should handle registerAllMocks with logging disabled', () => {
            const { log } = require('@placeos/common');

            registerAllMocks({ enableLogging: false });

            // With logging disabled, log should not be called for the success message
            expect(log).not.toHaveBeenCalledWith(
                'MOCKS',
                'All mocks registered with application.',
            );
        });

        it('should handle registerAllMocks with logging enabled', () => {
            const { log } = require('@placeos/common');

            registerAllMocks({ enableLogging: true });

            // With logging enabled, log should be called
            expect(log).toHaveBeenCalledWith(
                'MOCKS',
                'All mocks registered with application.',
            );
        });
    });

    describe('convenience object mapping', () => {
        it('should map convenience functions to individual registration functions', () => {
            expect(registerMocks.users).toBe(registerUserMocks);
            expect(registerMocks.bookings).toBe(registerBookingMocks);
            expect(registerMocks.events).toBe(registerEventMocks);
            expect(registerMocks.calendars).toBe(registerCalendarMocks);
            expect(registerMocks.assets).toBe(registerAssetMocks);
            expect(registerMocks.surveys).toBe(registerSurveyMocks);
            expect(registerMocks.systems).toBe(registerSystemMocks);
            expect(registerMocks.zones).toBe(registerZoneMocks);
        });
    });
});
