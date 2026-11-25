export const today = () => new Date().toLocaleDateString('en-CA');

export function formatDate(value) {
  if (!value) return '';
  return new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

export function statusFor(value) {
  if (value < 70) return { label: 'Low', className: 'status-low' };
  if (value > 180) return { label: 'High', className: 'status-high' };
  return { label: 'Normal', className: 'status-normal' };
}
