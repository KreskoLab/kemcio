/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, beforeEach, it, expect } from '@jest/globals'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import AppRange from '@/components/App/AppRange.vue'

describe('AppRange', () => {
	let wrapper: VueWrapper<InstanceType<typeof AppRange>>

	beforeEach(() => {
		wrapper = shallowMount(AppRange)
	})

	describe('render', () => {
		it('renders properly', () => {
			expect(wrapper.isVisible()).toBeTruthy()
		})
	})

	describe('Props', () => {
		describe('modelValue', () => {
			describe('when modelValue is set', () => {
				beforeEach(async () => {
					await wrapper.setProps({ modelValue: 50 })
				})

				it('should set input value', async () => {
					const input = wrapper.find('input')
					expect(Number(input.element.value)).toBe(50)
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

	describe('when inputed', () => {
		beforeEach(async () => {
			await wrapper.find('input').setValue(10)
		})

		it('should trigger input event', () => {
			expect(wrapper.emitted('input')![0][0]).toBe(10)
		})
	})
})
