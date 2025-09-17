export * from './mocks';

// Legacy exports for backward compatibility
export * as MOCKS from './mocks';

// Re-export individual mock registration functions
export { registerAssetMocks } from './lib/api/assets.mock';
export { registerBookingMocks } from './lib/api/bookings.mock';
export { registerCalendarMocks } from './lib/api/calendars.mock';
export { registerEventMocks } from './lib/api/events.mock';
export { registerSurveyMocks } from './lib/api/surveys.mock';
export { registerSystemMocks } from './lib/api/systems.mock';
export { registerUserMocks } from './lib/api/users.mock';
export { registerZoneMocks } from './lib/api/zones.mock';
