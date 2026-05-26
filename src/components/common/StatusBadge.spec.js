import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import StatusBadge from './StatusBadge.vue';

describe('StatusBadge', () => {
  it.each([
    ['Currently employed', 'status-positive'],
    ['Active', 'status-positive'],
    ['Employed soon', 'status-warning'],
    ['To be terminated', 'status-warning'],
    ['Terminated', 'status-negative'],
    ['Unknown', 'status-neutral'],
  ])('renders %s with class %s', (status, expectedClass) => {
    const wrapper = mount(StatusBadge, {
      props: { status, testId: 'status-badge' },
    });

    expect(wrapper.text()).toBe(status);
    expect(wrapper.classes()).toContain(expectedClass);
    expect(wrapper.attributes('data-testid')).toBe('status-badge');
  });

  it('omits data-testid when testId prop is not provided', () => {
    const wrapper = mount(StatusBadge, {
      props: { status: 'Active' },
    });

    expect(wrapper.attributes('data-testid')).toBeUndefined();
  });
});
