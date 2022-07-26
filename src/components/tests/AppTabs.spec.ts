/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, beforeEach, it, expect } from '@jest/globals'
import { VueWrapper, mount } from '@vue/test-utils'
import { h } from 'vue'
import AppTabs from '@/components/App/AppTabs.vue'
import AppTabItem from '../App/AppTabItem.vue'

describe('AppTabs', () => {
	let wrapper: VueWrapper<InstanceType<typeof AppTabs>>

	beforeEach(() => {
		wrapper = mount(AppTabs, {
			slots: {
				default: [
					h(AppTabItem as any, { label: 'label1' }, { default: () => h('span', 'Tab 1') }),
					h(AppTabItem as any, { label: 'label2' }, { default: () => h('span', 'Tab 2') }),
				],
			},
		})
	})

	describe('render', () => {
		it('renders properly', () => {
			expect(wrapper.isVisible()).toBeTruthy()
		})

		it('renders slots', () => {
			expect(wrapper.findAll('li').length).toBe(2)
		})
	})

	describe('Props', () => {
		describe('modelValue', () => {
			describe('when modelValue is set', () => {
				beforeEach(async () => {
					await wrapper.setProps({ modelValue: 1 })
				})

				it('should show tab with index 1', async () => {
					expect(wrapper.html()).toContain('Tab 2')
				})
			})
		})
	})

	describe('when second tab selected', () => {
		beforeEach(async () => {
			const tab = wrapper.findAll('li').find((item) => item.text() === 'label2')
			await tab?.trigger('click')
		})

		it('should apply active class', () => {
			const tab = wrapper.findAll('li').find((item) => item.text() === 'label2')
			expect(tab?.html()).toContain('!dark:text-light-200')
		})

		it('should emit update:modelValue event', () => {
			expect(wrapper.emitted('update:modelValue')![1][0]).toBe(1)
		})
	})
})
