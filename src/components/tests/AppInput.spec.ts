/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, beforeEach, it, expect, test, jest } from '@jest/globals'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import AppInput from '@/components/App/AppInput.vue'
import ILucideEye from '~icons/lucide/eye'
import ILucideEyeOff from '~icons/lucide/eye-off'

jest.mock(
	'~icons/lucide/eye',
	() => {
		return {}
	},
	{ virtual: true }
)

jest.mock(
	'~icons/lucide/eye-off',
	() => {
		return {}
	},
	{ virtual: true }
)

describe('AppInput', () => {
	let wrapper: VueWrapper<InstanceType<typeof AppInput>>

	beforeEach(() => {
		wrapper = shallowMount(AppInput, {
			global: {
				components: {
					'i-lucide-eye': ILucideEye,
					'i-lucide-eye-off': ILucideEyeOff,
				},
			},
		})
	})

	describe('render', () => {
		it('renders properly', () => {
			expect(wrapper.isVisible()).toBeTruthy()
		})
	})

	describe('Props', () => {
		test('label', async () => {
			await wrapper.setProps({ label: 'Input' })
			expect(wrapper.html()).toContain('Input')
		})

		test('placeholder', async () => {
			await wrapper.setProps({ placeholder: 'type something' })
			expect(wrapper.html()).toContain('type something')
		})

		describe('password', () => {
			beforeEach(async () => {
				await wrapper.setProps({ password: true })
			})

			it('should set input type to password', async () => {
				expect(wrapper.html()).toContain('type="password"')
			})

			it('should add eye icon', () => {
				expect(wrapper.html()).toContain('i-lucide-eye')
			})

			describe('when click on eye icon', () => {
				beforeEach(async () => {
					await wrapper.find('button').trigger('click')
				})

				it('should set input type to text', () => {
					expect(wrapper.html()).toContain('type="text"')
				})

				it('should replace eye icon with eye-off', () => {
					expect(wrapper.html()).toContain('i-lucide-eye-off')
				})
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

		describe('modelValue', () => {
			beforeEach(async () => {
				await wrapper.setProps({ modelValue: 'qwerty' })
			})

			it('should set input value from modelValue', () => {
				const input = wrapper.find('input')
				expect(input.element.value).toBe('qwerty')
			})
		})
	})

	describe('when typing', () => {
		beforeEach(async () => {
			const input = wrapper.find('input')
			await input.setValue('cool text')
		})

		it('should emit update:modelValue event', () => {
			expect(wrapper.emitted('update:modelValue')![0][0]).toBe('cool text')
		})
	})
})
