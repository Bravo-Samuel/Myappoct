/**
 * AstronomyService.ts
 * High-precision NOAA / Jean Meeus astronomical solar calculations.
 * Computes exact solar coordinates, declination, hour angles, and horizon crossing times.
 */

export interface SolarTimesUTC {
  solarNoon: Date;
  sunriseSeaLevel: Date;
  sunsetSeaLevel: Date;
  dawn16_1: Date;
  misheyakir10_2: Date;
  nightfall8_5: Date;
}

export class AstronomyService {
  /**
   * Convert degrees to radians
   */
  private static degToRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  /**
   * Convert radians to degrees
   */
  private static radToDeg(rad: number): number {
    return (rad * 180) / Math.PI;
  }

  /**
   * Calculate Julian Day from a Gregorian UTC Date at 00:00:00 UTC
   */
  private static getJulianDay(utcDate: Date): number {
    const year = utcDate.getUTCFullYear();
    const month = utcDate.getUTCMonth() + 1;
    const day = utcDate.getUTCDate();

    let y = year;
    let m = month;
    if (m <= 2) {
      y -= 1;
      m += 12;
    }

    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5;
  }

  /**
   * Calculate solar parameters for a specific Julian Day century
   */
  private static getSolarParameters(julianDay: number) {
    const T = (julianDay - 2451545.0) / 36525.0;

    // Geometric Mean Longitude of Sun (in degrees)
    let L0 = 280.46646 + T * (36000.76983 + T * 0.0003032);
    L0 = L0 % 360;
    if (L0 < 0) L0 += 360;

    // Geometric Mean Anomaly of Sun (in degrees)
    const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);

    // Eccentricity of Earth's Orbit
    const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);

    // Sun Equation of Center
    const mRad = this.degToRad(M);
    const C =
      Math.sin(mRad) * (1.914602 - T * (0.004817 + 0.000014 * T)) +
      Math.sin(2 * mRad) * (0.019993 - 0.000101 * T) +
      Math.sin(3 * mRad) * 0.000289;

    // Sun True Longitude
    const trueLong = L0 + C;

    // Sun Apparent Longitude
    const omega = 125.04 - 1934.136 * T;
    const lambda = trueLong - 0.00569 - 0.00478 * Math.sin(this.degToRad(omega));

    // Mean Obliquity of Ecliptic
    const seconds = 21.448 - T * (46.815 + T * (0.00059 - T * 0.001813));
    const e0 = 23.0 + (26.0 + seconds / 60.0) / 60.0;
    const obliq = e0 + 0.00256 * Math.cos(this.degToRad(omega));

    // Sun Declination
    const sinDecl = Math.sin(this.degToRad(obliq)) * Math.sin(this.degToRad(lambda));
    const declination = this.radToDeg(Math.asin(sinDecl));

    // Equation of Time (in minutes)
    const y = Math.pow(Math.tan(this.degToRad(obliq / 2)), 2);
    const l0Rad = this.degToRad(L0);
    const eTime =
      y * Math.sin(2 * l0Rad) -
      2 * e * Math.sin(mRad) +
      4 * e * y * Math.sin(mRad) * Math.cos(2 * l0Rad) -
      0.5 * Math.pow(y, 2) * Math.sin(4 * l0Rad) -
      1.25 * Math.pow(e, 2) * Math.sin(2 * mRad);
    const eqTimeMinutes = this.radToDeg(eTime) * 4;

    return { declination, eqTimeMinutes };
  }

  /**
   * Calculate UTC hour of event for a given solar depression altitude (e.g., -0.833 for sunrise/sunset)
   */
  private static calculateEventTimeUTC(
    utcMidnight: Date,
    solarNoonHourUTC: number,
    latitude: number,
    declination: number,
    depressionAngleDegrees: number,
    isMorning: boolean
  ): Date {
    const latRad = this.degToRad(latitude);
    const decRad = this.degToRad(declination);
    const altRad = this.degToRad(depressionAngleDegrees);

    const cosOmega =
      (Math.sin(altRad) - Math.sin(latRad) * Math.sin(decRad)) /
      (Math.cos(latRad) * Math.cos(decRad));

    if (cosOmega < -1 || cosOmega > 1) {
      // Polar day/night boundary fallback
      const copy = new Date(utcMidnight);
      copy.setUTCHours(Math.floor(solarNoonHourUTC), 0, 0, 0);
      return copy;
    }

    const omegaDegrees = this.radToDeg(Math.acos(cosOmega));
    const hourAngleHours = omegaDegrees / 15.0;

    const eventHourUTC = isMorning
      ? solarNoonHourUTC - hourAngleHours
      : solarNoonHourUTC + hourAngleHours;

    const msOffset = Math.round(eventHourUTC * 3600 * 1000);
    return new Date(utcMidnight.getTime() + msOffset);
  }

  /**
   * Compute full suite of sea-level geometric solar times for a given date and coordinate
   */
  static getSolarTimes(date: Date, latitude: number, longitude: number): SolarTimesUTC {
    // Standardize to UTC midnight of the target day
    const utcMidnight = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
    const julianDay = this.getJulianDay(utcMidnight);
    const { declination, eqTimeMinutes } = this.getSolarParameters(julianDay);

    // True Solar Noon in UTC hours
    const solarNoonHourUTC = (720 - 4 * longitude - eqTimeMinutes) / 60.0;
    const solarNoonMs = Math.round(solarNoonHourUTC * 3600 * 1000);
    const solarNoon = new Date(utcMidnight.getTime() + solarNoonMs);

    // -0.833° accounts for standard atmospheric refraction (34') and solar radius (16')
    const sunriseSeaLevel = this.calculateEventTimeUTC(utcMidnight, solarNoonHourUTC, latitude, declination, -0.833, true);
    const sunsetSeaLevel = this.calculateEventTimeUTC(utcMidnight, solarNoonHourUTC, latitude, declination, -0.833, false);

    // Halachic depression angles
    const dawn16_1 = this.calculateEventTimeUTC(utcMidnight, solarNoonHourUTC, latitude, declination, -16.1, true);
    const misheyakir10_2 = this.calculateEventTimeUTC(utcMidnight, solarNoonHourUTC, latitude, declination, -10.2, true);
    const nightfall8_5 = this.calculateEventTimeUTC(utcMidnight, solarNoonHourUTC, latitude, declination, -8.5, false);

    return {
      solarNoon,
      sunriseSeaLevel,
      sunsetSeaLevel,
      dawn16_1,
      misheyakir10_2,
      nightfall8_5
    };
  }
}
