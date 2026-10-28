'use strict';
function calculateCommission(eligibleSale, policy) {
  const sale = Number(eligibleSale), value = Number(policy?.commission_value), minimum = Number(policy?.min_sale || 0);
  if (!Number.isFinite(sale) || sale < 0 || !Number.isFinite(value) || value < 0 || !Number.isFinite(minimum) || minimum < 0) throw new TypeError('Invalid sale or commission policy.');
  if (policy.commission_type === 'percentage' && value > 100) throw new RangeError('Percentage commission cannot exceed 100.');
  if (sale < minimum) return 0;
  if (policy.commission_type === 'fixed') return Math.round(value * 100) / 100;
  if (policy.commission_type !== 'percentage') throw new TypeError('Unsupported commission type.');
  return Math.round((sale * value / 100) * 100) / 100;
}
module.exports = { calculateCommission };
