/**
 * Generates an array of date ranges for the past week, including today.
 * Each range contains a label and a value (ISO date string, yyyy-mm-dd).
 * Handles month/year transitions and timezone issues correctly.
 */
export function generatePastWeekDateRanges() {
   const now = new Date();
  const ranges = [];
  for (let i = 0; i <= 7; i++) {
    const pastDate = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    ranges.push({
      label:
        i === 0
          ? `Today (${pastDate.toLocaleDateString()})`
          : i === 1
          ? `Yesterday (${pastDate.toLocaleDateString()})`
          : `${i} days ago (${pastDate.toLocaleDateString()})`,
      value: pastDate.toISOString().split("T")[0],
    });
  }
  return ranges;
}
