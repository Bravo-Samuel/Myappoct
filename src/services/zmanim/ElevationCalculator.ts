/**
 * ElevationCalculator.ts
 * Adapts Halachic solar calculations for mountainous terrain.
 * Essential for Bnei Menashe hubs situated on ridges and plateaus:
 * - Shillong (1,525m)
 * - Aizawl (1,132m)
 * - Churachandpur (914m)
 * - Imphal (786m)
 * - Jerusalem (754m)
 * - Nof HaGalil (570m)
 * - Haifa (290m)
 */

export class ElevationCalculator {
  private static readonly EARTH_RADIUS_METERS = 6371000;

  /**
   * Calculate geometric horizon dip angle due to elevation above sea level.
   * Dip angle (in degrees) = arccos(R / (R + h))
   * Approximation formula: ~0.0347 * sqrt(height in meters) degrees
   */
  static calculateDipAngleDegrees(elevationMeters: number): number {
    if (!elevationMeters || elevationMeters <= 0) return 0;
    
    // Exact geometric calculation
    const ratio = this.EARTH_RADIUS_METERS / (this.EARTH_RADIUS_METERS + elevationMeters);
    const dipRadians = Math.acos(Math.max(-1, Math.min(1, ratio)));
    return dipRadians * (180 / Math.PI);
  }

  /**
   * Calculate time shift in seconds caused by elevation dip angle.
   * Higher elevation allows seeing sunrise earlier and sunset later.
   * Time shift depends on solar trajectory angle relative to horizon at given latitude.
   */
  static calculateElevationTimeAdjustmentSeconds(elevationMeters: number, latitude: number): number {
    if (!elevationMeters || elevationMeters <= 0) return 0;

    const dipDegrees = this.calculateDipAngleDegrees(elevationMeters);
    const latRad = latitude * (Math.PI / 180);

    // Earth rotates 15 degrees per hour = 0.25 degrees per minute = 1 degree per 4 minutes (240 seconds).
    // Effective velocity across horizon scales roughly with 1 / cos(latitude).
    const cosLat = Math.max(0.1, Math.cos(latRad));
    
    // Time adjustment in seconds
    return Math.round((dipDegrees * 240) / cosLat);
  }

  /**
   * Adjust sea-level geometric sunrise for elevation (Sunrise is earlier at higher elevation).
   */
  static adjustSunriseForElevation(seaLevelSunrise: Date, elevationMeters: number, latitude: number): Date {
    if (!elevationMeters || elevationMeters <= 0) return new Date(seaLevelSunrise);
    const adjustmentSeconds = this.calculateElevationTimeAdjustmentSeconds(elevationMeters, latitude);
    return new Date(seaLevelSunrise.getTime() - adjustmentSeconds * 1000);
  }

  /**
   * Adjust sea-level geometric sunset for elevation (Sunset is later at higher elevation).
   */
  static adjustSunsetForElevation(seaLevelSunset: Date, elevationMeters: number, latitude: number): Date {
    if (!elevationMeters || elevationMeters <= 0) return new Date(seaLevelSunset);
    const adjustmentSeconds = this.calculateElevationTimeAdjustmentSeconds(elevationMeters, latitude);
    return new Date(seaLevelSunset.getTime() + adjustmentSeconds * 1000);
  }

  /**
   * Format elevation display summary for UI
   */
  static getElevationSummary(elevationMeters: number, latitude: number): {
    dipAngleArcMinutes: string;
    timeShiftMinutesSeconds: string;
    description: string;
  } {
    if (!elevationMeters || elevationMeters <= 0) {
      return {
        dipAngleArcMinutes: '0.0\'',
        timeShiftMinutesSeconds: '0s',
        description: 'Sea level baseline (No terrain adjustment needed)'
      };
    }

    const dipDeg = this.calculateDipAngleDegrees(elevationMeters);
    const dipArcMin = (dipDeg * 60).toFixed(1);
    const totalSec = this.calculateElevationTimeAdjustmentSeconds(elevationMeters, latitude);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const timeStr = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;

    return {
      dipAngleArcMinutes: `${dipArcMin}'`,
      timeShiftMinutesSeconds: timeStr,
      description: `Ridge elevation (${elevationMeters}m) shifts visible horizon by ${dipArcMin} arcmin (${timeStr} earlier sunrise / later sunset).`
    };
  }
}
