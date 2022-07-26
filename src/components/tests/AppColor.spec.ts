/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, beforeEach, it, expect } from '@jest/globals'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import AppColor from '@/components/App/AppColor.vue'

describe('AppColor', () => {
	let wrapper: VueWrapper<InstanceType<typeof AppColor>>

	beforeEach(() => {
		wrapper = shallowMount(AppColor as any, {
			props: {
				modelValue: '01FBFF0000',
			},
		})
	})

	describe('render', () => {
		it('renders properly', () => {
			expect(wrapper.isVisible()).toBeTruthy()
		})
	})

	describe('Props', () => {
		describe('modelValue', () => {
			describe('when modelValue is set', () => {
				it('should set input value', async () => {
					const input = wrapper.find('input')
					expect(input.element.value).toBe('#01fbff')
				})
			})
		})

		describe('disabled', () => {
			beforeEach(async () => {
				await wrapper.setProps({ disabled: true })
			})

			it('should add disabled attribute to input', () => {
				expect(wrapper.html()).toContain('cursor-not-allowed')
			})
		})
	})

	describe('when color selected', () => {
		beforeEach(async () => {
			await wrapper.find('input').setValue('#01fbff')
		})

		it('should trigger input event', () => {
			expect(wrapper.emitted('input')![0][0]).toBe('#01fbff0000')
		})
	})
})
