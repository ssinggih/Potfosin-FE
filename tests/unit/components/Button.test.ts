import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '@components/ui/Button.vue'

describe('Button.vue', () => {
  it('renders slot content', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click me' },
    })
    expect(wrapper.text()).toBe('Click me')
  })

  it('applies default variant classes', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Submit' },
    })
    expect(wrapper.classes()).toContain('bg-blue-600')
  })

  it('disables button when disabled prop is set', () => {
    const wrapper = mount(Button, {
      props: { disabled: true },
      slots: { default: 'Submit' },
      attrs: { disabled: true },
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })
})
