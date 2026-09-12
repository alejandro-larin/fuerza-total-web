const dateFormatterCache = new Map<string, Intl.DateTimeFormat>();

function getDateFormatter(timeZone: string) {
  let formatter = dateFormatterCache.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    dateFormatterCache.set(timeZone, formatter);
  }
  return formatter;
}

function localDateParts(date: Date, timeZone: string) {
  const parts = Object.fromEntries(
    getDateFormatter(timeZone)
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );
  return { year: parts.year, month: parts.month, day: parts.day };
}

function startOfLocalDate(input: { year: number; month: number; day: number }, timeZone: string) {
  const target = Date.UTC(input.year, input.month - 1, input.day);
  let low = target - 36 * 60 * 60 * 1000;
  let high = target + 36 * 60 * 60 * 1000;

  while (high - low > 60_000) {
    const midpoint = Math.floor((low + high) / 120_000) * 60_000;
    const parts = localDateParts(new Date(midpoint), timeZone);
    const representedDate = Date.UTC(parts.year, parts.month - 1, parts.day);
    if (representedDate < target) low = midpoint + 60_000;
    else high = midpoint;
  }

  return new Date(Math.floor(high / 60_000) * 60_000);
}

function utcCalendarDate(year: number, monthIndex: number, day: number) {
  const date = new Date(Date.UTC(year, monthIndex, day));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

export function getDashboardDateRanges(now: Date, timeZone: string) {
  const local = localDateParts(now, timeZone);
  return {
    dayStart: startOfLocalDate(local, timeZone),
    dayEnd: startOfLocalDate(utcCalendarDate(local.year, local.month - 1, local.day + 1), timeZone),
    monthStart: startOfLocalDate({ year: local.year, month: local.month, day: 1 }, timeZone),
    monthEnd: startOfLocalDate(utcCalendarDate(local.year, local.month, 1), timeZone),
    previousMonthStart: startOfLocalDate(utcCalendarDate(local.year, local.month - 2, 1), timeZone),
  };
}
