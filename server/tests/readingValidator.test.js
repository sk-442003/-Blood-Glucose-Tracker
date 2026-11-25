const { validateReading } = require('../validators/readingValidator');

describe('reading validation', () => {
  const valid = { reading_date: '2020-01-01', time_slot: 'Morning (fasting)', glucose_value: '105' };
  test('accepts a valid reading', () => expect(validateReading(valid)).toEqual({}));
  test('rejects empty glucose', () => expect(validateReading({...valid, glucose_value:''}).glucose_value).toBe('Please enter a glucose value.'));
  test('rejects decimals', () => expect(validateReading({...valid, glucose_value:'105.5'}).glucose_value).toBe('Please enter a whole number.'));
  test('rejects values below 40', () => expect(validateReading({...valid, glucose_value:'39'}).glucose_value).toBe('Value must be between 40 and 600 mg/dl.'));
  test('rejects values above 600', () => expect(validateReading({...valid, glucose_value:'601'}).glucose_value).toBe('Value must be between 40 and 600 mg/dl.'));
  test('rejects future dates', () => expect(validateReading({...valid, reading_date:'2099-01-01'}).reading_date).toBe('Date cannot be in the future.'));
  test('requires a time slot', () => expect(validateReading({...valid,time_slot:''}).time_slot).toBe('Please select a time slot.'));
});
