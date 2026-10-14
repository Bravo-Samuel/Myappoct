/**
 * LocationService.ts
 * Manages active user location, saved home profile location, and travel mode state.
 */

import { LocationResolver, HalachicLocation } from '../zmanim/LocationResolver';

const STORAGE_KEY_ACTIVE_LOC = 'bnei_menashe_active_location_id';
const STORAGE_KEY_HOME_LOC = 'bnei_menashe_home_location_id';
const STORAGE_KEY_TRAVEL_MODE = 'bnei_menashe_travel_mode_enabled';
const STORAGE_KEY_CUSTOM_GPS = 'bnei_menashe_custom_gps_loc';

export interface UserLocationState {
  activeLocation: HalachicLocation;
  homeLocation: HalachicLocation;
  isTravelMode: boolean;
  isCustomGPS: boolean;
}

export class LocationService {
  /**
   * Get complete location state for current session
   */
  static getLocationState(): UserLocationState {
    const homeId = localStorage.getItem(STORAGE_KEY_HOME_LOC) || 'churachandpur';
    const homeLocation = LocationResolver.getLocationByNameOrId(homeId);

    const isTravelMode = localStorage.getItem(STORAGE_KEY_TRAVEL_MODE) === 'true';

    let activeLocation = homeLocation;
    let isCustomGPS = false;

    if (isTravelMode) {
      const customGpsStr = localStorage.getItem(STORAGE_KEY_CUSTOM_GPS);
      if (customGpsStr) {
        try {
          activeLocation = JSON.parse(customGpsStr);
          isCustomGPS = true;
        } catch {
          const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_LOC) || 'jerusalem';
          activeLocation = LocationResolver.getLocationByNameOrId(activeId);
        }
      } else {
        const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_LOC) || 'jerusalem';
        activeLocation = LocationResolver.getLocationByNameOrId(activeId);
      }
    } else {
      const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_LOC);
      if (activeId) {
        activeLocation = LocationResolver.getLocationByNameOrId(activeId);
      }
    }

    return {
      activeLocation,
      homeLocation,
      isTravelMode,
      isCustomGPS
    };
  }

  /**
   * Set active location by name or id
   */
  static setActiveLocation(locationQuery: string): HalachicLocation {
    const loc = LocationResolver.getLocationByNameOrId(locationQuery);
    localStorage.setItem(STORAGE_KEY_ACTIVE_LOC, loc.id);
    localStorage.removeItem(STORAGE_KEY_CUSTOM_GPS);
    return loc;
  }

  /**
   * Set custom GPS coordinates as active location
   */
  static setCustomGPSLocation(lat: number, lng: number, elevMeters: number, namePrefix: string = 'GPS Location'): HalachicLocation {
    const closest = LocationResolver.findClosestLocation(lat, lng);
    const customLoc: HalachicLocation = {
      id: 'custom_gps',
      name: `${namePrefix} (${lat.toFixed(2)}°, ${lng.toFixed(2)}°)`,
      hebrewName: `מיקום GPS (${closest.hebrewName})`,
      region: closest.region,
      country: closest.country,
      latitude: lat,
      longitude: lng,
      elevationMeters: elevMeters,
      timeZone: closest.timeZone,
      candleLightingCustomMinutes: closest.candleLightingCustomMinutes || 18
    };

    localStorage.setItem(STORAGE_KEY_CUSTOM_GPS, JSON.stringify(customLoc));
    localStorage.setItem(STORAGE_KEY_TRAVEL_MODE, 'true');
    return customLoc;
  }

  /**
   * Set Home Location
   */
  static setHomeLocation(locationQuery: string): HalachicLocation {
    const loc = LocationResolver.getLocationByNameOrId(locationQuery);
    localStorage.setItem(STORAGE_KEY_HOME_LOC, loc.id);
    if (!localStorage.getItem(STORAGE_KEY_TRAVEL_MODE) || localStorage.getItem(STORAGE_KEY_TRAVEL_MODE) === 'false') {
      localStorage.setItem(STORAGE_KEY_ACTIVE_LOC, loc.id);
    }
    return loc;
  }

  /**
   * Toggle travel mode on/off
   */
  static setTravelMode(enabled: boolean) {
    localStorage.setItem(STORAGE_KEY_TRAVEL_MODE, enabled ? 'true' : 'false');
    if (!enabled) {
      // Revert active location to home
      const homeId = localStorage.getItem(STORAGE_KEY_HOME_LOC) || 'churachandpur';
      localStorage.setItem(STORAGE_KEY_ACTIVE_LOC, homeId);
      localStorage.removeItem(STORAGE_KEY_CUSTOM_GPS);
    }
  }
}
