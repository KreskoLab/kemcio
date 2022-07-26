/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, beforeEach, it, expect } from '@jest/globals'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import AppSelect from '@/components/App/AppSelect.vue'

describe('AppSelect', () => {
	let wrapper: VueWrapper<InstanceType<typeof AppSelect>>

	beforeEach(() => {
		wrapper = shallowMount(AppSelect as any, {
			props: {
				options: [
					{
						label: 'Option 1',
						value: 'option-1',
					},
					{
						label: 'Option 2',
						value: 'option-2',
					},
				],
			},
		})
	})

	describe('render', () => {
		it('renders properly', () => {
			expect(wrapper.isVisible()).toBeTruthy()
		})
	})

	describe('Props', () => {
		describe('label', () => {
			beforeEach(async () => {
				await wrapper.setProps({ label: 'Cool label' })
			})

			it('should render label', () => {
				expect(wrapper.html()).toContain('Cool label')
			})
		})

		describe('placeholder', () => {
			beforeEach(async () => {
				await wrapper.setProps({ placeholder: 'Select something' })
			})

			it('should render placeholder', () => {
				expect(wrapper.html()).toContain('Select something')
			})
		})

		describe('error', () => {
			describe('when an error occured', () => {
				beforeEach(async () => {
					await wrapper.setProps({ error: true, errorMessage: 'fatal error' })
				})

				it('should show error message', () => {
					expect(wrapper.html()).toContain('fatal error')
				})

				it('should apply error style', () => {
					expect(wrapper.html()).toContain('border-red-400')
				})
			})
		})

		describe('options', () => {
			beforeEach(async () => {
				await wrapper.find('button').trigger('click')
			})

			describe('when select activated', () => {
				it('should render options', () => {
					const options = wrapper.findAll('li')
					expect(options.length).toBe(2)
				})
			})
		})
	})

	describe('on click', () => {
		describe('when select hidden', () => {
			beforeEach(async () => {
				await wrapper.find('button').trigger('click')
			})

			it('should render options', () => {
				const options = wrapper.findAll('li')
				expect(options.length).toBe(2)
			})

			describe('when option selected', () => {
				beforeEach(async () => {
					await wrapper.find('li').trigger('click')
				})

				it('should emmit update:modelValue event', () => {
					expect(wrapper.emitted('update:modelValue')![0][0]).toBe('option-1')
				})
			})
		})

		describe('when select active', () => {
			beforeEach(async () => {
				;(wrapper.vm as any).active = true
				await (wrapper.vm as any).$nextTick()

				await wrapper.find('button').trigger('click')
			})

			it('should hide select menu', () => {
				const options = wrapper.findAll('li')
				expect(options.length).toBe(0)
			})
		})
	})
})
