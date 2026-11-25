const allowedSlots = ['Morning (fasting)', 'After breakfast', 'After lunch', 'After dinner'];

function validateReading(input) {
  const errors = {};
  if (input.glucose_value === '' || input.glucose_value === null || input.glucose_value === undefined) {
    errors.glucose_value = 'Please enter a glucose value.';
  } else if (!/^\d+$/.test(String(input.glucose_value))) {
    errors.glucose_value = 'Please enter a whole number.';
  } else if (Number(input.glucose_value) < 40 || Number(input.glucose_value) > 600) {
    errors.glucose_value = 'Value must be between 40 and 600 mg/dl.';
  }
  if (!input.reading_date) errors.reading_date = 'Please select a date.';
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(input.reading_date)) {
    errors.reading_date = 'Please use a valid date.';
  } else if (input.reading_date > new Date().toISOString().slice(0, 10)) {
    errors.reading_date = 'Date cannot be in the future.';
  }
  if (!allowedSlots.includes(input.time_slot)) errors.time_slot = 'Please select a time slot.';
  return errors;
}

module.exports = { allowedSlots, validateReading };
