/**
 * LocationResolver.ts
 * Manages location profiles, GPS resolution, travel mode detection, and
 * high-precision geodetic coordinates + elevation models for Bnei Menashe hubs.
 */

export interface HalachicLocation {
  id: string;
  name: string;
  hebrewName: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  timeZone: string;
  isBneiMenasheHub?: boolean;
  candleLightingCustomMinutes?: number;
}

export class LocationResolver {
  public static readonly PRESET_LOCATIONS: HalachicLocation[] = [
    {
      id: 'churachandpur',
      name: 'Churachandpur',
      hebrewName: 'צ\'וראצ\'נדפור (למקה)',
      region: 'Manipur',
      country: 'India',
      latitude: 24.3333,
      longitude: 93.6833,
      elevationMeters: 914,
      timeZone: 'Asia/Kolkata',
      isBneiMenasheHub: true,
      candleLightingCustomMinutes: 18
    },
    {
      id: 'aizawl',
      name: 'Aizawl',
      hebrewName: 'אייזול',
      region: 'Mizoram',
      country: 'India',
      latitude: 23.7271,
      longitude: 92.7176,
      elevationMeters: 1132,
      timeZone: 'Asia/Kolkata',
      isBneiMenasheHub: true,
      candleLightingCustomMinutes: 18
    },
    {
      id: 'imphal',
      name: 'Imphal',
      hebrewName: 'אימפאל',
      region: 'Manipur',
      country: 'India',
      latitude: 24.8170,
      longitude: 93.9368,
      elevationMeters: 786,
      timeZone: 'Asia/Kolkata',
      isBneiMenasheHub: true,
      candleLightingCustomMinutes: 18
    },
    {
      id: 'shillong',
      name: 'Shillong',
      hebrewName: 'שילונג',
      region: 'Meghalaya',
      country: 'India',
      latitude: 25.5788,
      longitude: 91.8933,
      elevationMeters: 1525,
      timeZone: 'Asia/Kolkata',
      isBneiMenasheHub: true,
      candleLightingCustomMinutes: 18
    },
    {
      id: 'kangpokpi',
      name: 'Kangpokpi',
      hebrewName: 'קנגפוקפי',
      region: 'Manipur',
      country: 'India',
      latitude: 25.1480,
      longitude: 93.9740,
      elevationMeters: 1040,
      timeZone: 'Asia/Kolkata',
      isBneiMenasheHub: true,
      candleLightingCustomMinutes: 18
    },
    {
      id: 'jerusalem',
      name: 'Jerusalem',
      hebrewName: 'ירושלים עיר הקודש',
      region: 'Judea',
      country: 'Israel',
      latitude: 31.7683,
      longitude: 35.2137,
      elevationMeters: 754,
      timeZone: 'Asia/Jerusalem',
      isBneiMenasheHub: false,
      candleLightingCustomMinutes: 40
    },
    {
      id: 'nof_hagalil',
      name: 'Nof HaGalil',
      hebrewName: 'נוף הגליל',
      region: 'Galilee',
      country: 'Israel',
      latitude: 32.7056,
      longitude: 35.3314,
      elevationMeters: 570,
      timeZone: 'Asia/Jerusalem',
      isBneiMenasheHub: true,
      candleLightingCustomMinutes: 20
    },
    {
      id: 'haifa',
      name: 'Haifa',
      hebrewName: 'חיפה (הר הכרמל)',
      region: 'Mount Carmel',
      country: 'Israel',
      latitude: 32.8191,
      longitude: 34.9983,
      elevationMeters: 290,
      timeZone: 'Asia/Jerusalem',
      isBneiMenasheHub: false,
      candleLightingCustomMinutes: 30
    },
    {
      id: 'kiryat_arba',
      name: 'Kiryat Arba',
      hebrewName: 'קריית ארבע',
      region: 'Hebron Hills',
      country: 'Israel',
      latitude: 31.5284,
      longitude: 35.1098,
      elevationMeters: 950,
      timeZone: 'Asia/Jerusalem',
      isBneiMenasheHub: true,
      candleLightingCustomMinutes: 20
    },
    {
      id: 'sderot',
      name: 'Sderot',
      hebrewName: 'שדרות',
      region: 'Negev',
      country: 'Israel',
      latitude: 31.5250,
      longitude: 34.5956,
      elevationMeters: 95,
      timeZone: 'Asia/Jerusalem',
      isBneiMenasheHub: true,
      candleLightingCustomMinutes: 20
    },
    {
      id: 'new_york',
      name: 'New York City',
      hebrewName: 'ניו יורק',
      region: 'NY',
      country: 'USA',
      latitude: 40.7128,
      longitude: -74.0060,
      elevationMeters: 10,
      timeZone: 'America/New_York',
      isBneiMenasheHub: false,
      candleLightingCustomMinutes: 18
    }
  ];

  /**
   * Get location by ID or exact/approximate name
   */
  static getLocationByNameOrId(query: string): HalachicLocation {
    const clean = query.trim().toLowerCase();
    const found = this.PRESET_LOCATIONS.find(
      l => l.id.toLowerCase() === clean || l.name.toLowerCase() === clean
    );
    if (found) return found;

    // Partial match
    const partial = this.PRESET_LOCATIONS.find(
      l => l.name.toLowerCase().includes(clean) || l.hebrewName.includes(query)
    );
    return partial || this.PRESET_LOCATIONS[0]; // Default to Churachandpur
  }

  /**
   * Resolve closest preset location to given GPS coordinates
   */
  static findClosestLocation(lat: number, lng: number): HalachicLocation {
    let closest = this.PRESET_LOCATIONS[0];
    let minDistance = Number.MAX_VALUE;

    for (const loc of this.PRESET_LOCATIONS) {
      const dist = this.calculateDistanceKm(lat, lng, loc.latitude, loc.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        closest = loc;
      }
    }
    return closest;
  }

  /**
   * Haversine distance calculation
   */
  private static calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Request browser GPS position
   */
  static async requestGPSLocation(): Promise<{ latitude: number; longitude: number; elevationMeters: number; closestPreset: HalachicLocation }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude, altitude } = position.coords;
          const closestPreset = this.findClosestLocation(latitude, longitude);
          resolve({
            latitude,
            longitude,
            elevationMeters: altitude && altitude > 0 ? Math.round(altitude) : closestPreset.elevationMeters,
            closestPreset
          });
        },
        error => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }
}
