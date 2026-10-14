/**
 * TimezoneResolver.ts
 * Handles IANA timezone calculations, UTC offsets, and local solar midnight alignment
 * for global hubs and Bnei Menashe communities in India & Israel.
 */

export class TimezoneResolver {
  /**
   * Get the UTC offset in minutes for a given timezone on a specific date.
   */
  static getTimezoneOffsetMinutes(date: Date, timeZone: string): number {
    try {
      // Create formatter that gives ISO string parts in the target timezone
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      const parts = formatter.formatToParts(date);
      const partMap: Record<string, string> = {};
      parts.forEach(p => { partMap[p.type] = p.value; });

      // Handle hour 24 -> 00 edge case in some JS environments
      const hourStr = partMap.hour === '24' ? '00' : partMap.hour;
      const targetDateStr = `${partMap.year}-${partMap.month}-${partMap.day}T${hourStr}:${partMap.minute}:${partMap.second}.000Z`;
      const targetAsUTC = new Date(targetDateStr).getTime();
      const actualUTC = date.getTime();

      // Difference in minutes
      return Math.round((targetAsUTC - actualUTC) / 60000);
    } catch {
      // Fallback to local browser offset if timezone string invalid
      return -date.getTimezoneOffset();
    }
  }

  /**
   * Format a Date into a display string in the requested IANA timezone.
   */
  static formatInTimezone(date: Date, timeZone: string, options?: Intl.DateTimeFormatOptions): string {
    try {
      const defaultOptions: Intl.DateTimeFormatOptions = options || {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone
      };
      return new Intl.DateTimeFormat('en-US', defaultOptions).format(date);
    } catch {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
  }

  /**
   * Get the start of day (00:00:00) in the target timezone represented as a UTC Date object.
   */
  static getStartOfDayInTimezone(date: Date, timeZone: string): Date {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).formatToParts(date);

      const partMap: Record<string, string> = {};
      parts.forEach(p => { partMap[p.type] = p.value; });

      // Construct noon UTC on that day to avoid DST boundary jumping, then adjust
      const noonUTC = new Date(Date.UTC(Number(partMap.year), Number(partMap.month) - 1, Number(partMap.day), 12, 0, 0));
      const offsetMinutes = this.getTimezoneOffsetMinutes(noonUTC, timeZone);

      return new Date(Date.UTC(Number(partMap.year), Number(partMap.month) - 1, Number(partMap.day), 0, 0, 0) - offsetMinutes * 60000);
    } catch {
      const copy = new Date(date);
      copy.setHours(0, 0, 0, 0);
      return copy;
    }
  }

  /**
   * Get timezone abbreviation (e.g. IST, IDT, EDT)
   */
  static getTimezoneAbbreviation(date: Date, timeZone: string): string {
    try {
      const formatted = new Intl.DateTimeFormat('en-US', {
        timeZone,
        timeZoneName: 'short'
      }).formatToParts(date);
      const tzPart = formatted.find(p => p.type === 'timeZoneName');
      return tzPart ? tzPart.value : timeZone;
    } catch {
      return timeZone;
    }
  }
}
