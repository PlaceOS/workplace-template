import { log } from '@placeos/common';

import { registerAssetMocks } from './lib/api/assets.mock';
import { registerBookingMocks } from './lib/api/bookings.mock';
import { registerCalendarMocks } from './lib/api/calendars.mock';
import { registerEventMocks } from './lib/api/events.mock';
import { registerSurveyMocks } from './lib/api/surveys.mock';
import { registerSystemMocks } from './lib/api/systems.mock';
import { registerUserMocks } from './lib/api/users.mock';
import { registerZoneMocks } from './lib/api/zones.mock';

export interface MockRegistrationOptions {
    /** Whether to log mock registration */
    enableLogging?: boolean;
}

/**
 * Register all API mocks
 */
export function registerAllMocks(options: MockRegistrationOptions = {}) {
    const { enableLogging = true } = options;

    registerZoneMocks();
    registerUserMocks();
    registerSystemMocks();
    registerEventMocks();
    registerCalendarMocks();
    registerBookingMocks();
    registerAssetMocks();
    registerSurveyMocks();

    if (enableLogging) {
        log('MOCKS', 'All mocks registered with application.');
    }
}

/**
 * Register specific mock categories
 */
export const registerMocks = {
    zones: registerZoneMocks,
    users: registerUserMocks,
    systems: registerSystemMocks,
    events: registerEventMocks,
    calendars: registerCalendarMocks,
    bookings: registerBookingMocks,
    assets: registerAssetMocks,
    surveys: registerSurveyMocks,
};

// Legacy export for backward compatibility
export default {
    ZONE_MOCKS: registerZoneMocks,
    USER_MOCKS: registerUserMocks,
    SYSTEM_MOCKS: registerSystemMocks,
    EVENT_MOCKS: registerEventMocks,
    CALENDAR_MOCKS: registerCalendarMocks,
    BOOKING_MOCKS: registerBookingMocks,
    ASSET_MOCKS: registerAssetMocks,
    SURVEY_MOCKS: registerSurveyMocks,
};
