// Central index for all modularized endpoints
export * from './bookingEndpoints';
export * from './customerEndpoints';
export * from './paymentEndpoints';
export * from './menuEndpoints';
export * from './employeeEndpoints';
export * from './roomEndpoints';
export * from './authEndpoints';
export * from './miscEndpoints';
export * from './utilityEndpoints';
export * from './sportsAndFitness';
export * from './membershipPlans';
export * from './gymMemberships';
export * from './sportMemberships';
export * from './checkIn';
export * from './gymAndSportSessions';
export * from '../../brand/brandConfig'; // <-- Add brandConfig to central exports

// Maintain a strapiService for backward compatibility and convenience
import * as bookingEndpoints from './bookingEndpoints';
import * as customerEndpoints from './customerEndpoints';
import * as paymentEndpoints from './paymentEndpoints';
import * as menuEndpoints from './menuEndpoints';
import * as employeeEndpoints from './employeeEndpoints';
import * as roomEndpoints from './roomEndpoints';
import * as authEndpoints from './authEndpoints';
import * as miscEndpoints from './miscEndpoints';
import * as utilityEndpoints from './utilityEndpoints';
import * as sportsAndFitnessEndpoints from './sportsAndFitness';
import * as gymAndSportSessionsEndpoints from './gymAndSportSessions'; 
import * as membershipPlansEndpoints from './membershipPlans';
import * as gymMembershipsEndpoints from './gymMemberships'; 
import * as sportMembershipsEndpoints from './sportMemberships'; 
import * as checkinEndpoints from './checkIn';


export const strapiService = {
  ...bookingEndpoints,
  ...customerEndpoints,
  ...paymentEndpoints,
  ...menuEndpoints,
  ...employeeEndpoints,
  ...roomEndpoints,
  ...authEndpoints,
  ...miscEndpoints,
  ...utilityEndpoints,
  ...sportsAndFitnessEndpoints,
  ...gymAndSportSessionsEndpoints,
  ...membershipPlansEndpoints,
  ...gymMembershipsEndpoints,
  ...sportMembershipsEndpoints,
  ...checkinEndpoints

};
