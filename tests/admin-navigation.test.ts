import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ADMIN_NAVIGATION_ITEMS,
  DEFAULT_ADMIN_NAVIGATION,
  normalizeAdminNavigation,
  parseAdminNavigation,
  withAdminNavigation
} from '../src/lib/admin-navigation.ts';

test('default navigation assigns every admin page exactly once', () => {
  const assigned = DEFAULT_ADMIN_NAVIGATION.categories.flatMap(category => category.itemIds);
  assert.equal(assigned.length, ADMIN_NAVIGATION_ITEMS.length);
  assert.equal(new Set(assigned).size, ADMIN_NAVIGATION_ITEMS.length);
});

test('normalization keeps new or omitted admin pages available', () => {
  const normalized = normalizeAdminNavigation({
    categories: [{ id: 'custom', name: '常用功能', itemIds: ['customers'] }]
  });
  const assigned = normalized.categories.flatMap(category => category.itemIds);

  assert.equal(normalized.categories[0].name, '常用功能');
  assert.equal(new Set(assigned).size, ADMIN_NAVIGATION_ITEMS.length);
});

test('navigation config preserves unrelated hidden settings', () => {
  const usageGuide = '使用說明\n\n<!--MICROESIM_FAVORITES:abc-->';
  const stored = withAdminNavigation(usageGuide, DEFAULT_ADMIN_NAVIGATION);
  const parsed = parseAdminNavigation(stored);

  assert.match(stored, /MICROESIM_FAVORITES:abc/);
  assert.deepEqual(parsed, DEFAULT_ADMIN_NAVIGATION);
});
