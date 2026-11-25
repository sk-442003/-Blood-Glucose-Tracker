const { ranges } = require('../services/reportService');

describe('report date ranges', () => {
  test('daily report uses the selected date', () => {
    expect(ranges('daily', '2026-10-15')).toEqual({ start: '2026-10-15', end: '2026-10-15' });
  });
  test('month-to-date starts on the first day', () => {
    expect(ranges('month-to-date', '2026-10-15')).toEqual({ start: '2026-10-01', end: '2026-10-15' });
  });
  test('previous month covers a full calendar month', () => {
    expect(ranges('previous-month', '2026-10-15')).toEqual({ start: '2026-09-01', end: '2026-09-30' });
  });
  test('previous month handles January', () => {
    expect(ranges('previous-month', '2026-01-15')).toEqual({ start: '2025-12-01', end: '2025-12-31' });
  });
  test('rejects invalid dates', () => {
    expect(() => ranges('daily', '2026-02-30')).toThrow('A valid date is required.');
  });
});
