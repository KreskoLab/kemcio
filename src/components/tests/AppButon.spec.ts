import { describe, beforeEach, it, expect, test } from '@jest/globals'
import {} from '@jest/core'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import AppButton from '@/components/App/AppButton.vue'

describe('AppButton', () => {
	let wrapper: VueWrapper

	beforeEach(() => {
		wrapper = shallowMount(AppButton, {
			slots: {
				default: '<span>Add</span>',
			},
		})
	})

	it('renders properly', () => {
		expect(wrapper.isVisible()).toBeTruthy()
	})

	it('renders slot', () => {
		expect(wrapper.text()).toContain('Add')
	})

	describe('Props', () => {
		describe('size', () => {
			test('sm', async () => {
				await wrapper.setProps({ size: 'sm' })
				expect(wrapper.html()).toContain('px-2 py-1')
			})

			test('base', async () => {
				await wrapper.setProps({ size: 'base' })
				expect(wrapper.html()).toContain('px-3 py-2')
			})

			test('lg', async () => {
				await wrapper.setProps({ size: 'lg' })
				expect(wrapper.html()).toContain('px-6 py-4')
			})
		})

		describe('variant', () => {
			test('base', async () => {
				await wrapper.setProps({ variant: 'base' })
				expect(wrapper.html()).toContain('bg-purple-500 ring-purple-400')
			})

			test('danger', async () => {
				await wrapper.setProps({ variant: 'danger' })
				expect(wrapper.html()).toContain('bg-red-500 ring-red-400')
			})
		})

		describe('disabled', () => {
			it('should add disabled attribute', async () => {
				await wrapper.setProps({ disabled: true })
				expect(wrapper.html()).toContain('disabled')
			})
		})

		describe('transparent', () => {
			it('should set transparent background', async () => {
				await wrapper.setProps({ transparent: true })
				expect(wrapper.html()).toContain('text-slate-700 dark:text-light-100')
			})
		})
	})
})
