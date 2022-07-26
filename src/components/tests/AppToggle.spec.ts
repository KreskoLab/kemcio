/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { describe, beforeEach, it, expect, test } from '@jest/globals'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import AppToggle from '@/components/App/AppToggle.vue'

describe('AppToggle', () => {
	let wrapper: VueWrapper<InstanceType<typeof AppToggle>>

	beforeEach(() => {
		wrapper = shallowMount(AppToggle)
	})

	describe('render', () => {
		it('renders properly', () => {
			expect(wrapper.isVisible()).toBeTruthy()
		})
	})

	describe('Props', () => {
		test('disabled', async () => {
			await wrapper.setProps({ disabled: true })
			expect(wrapper.html()).toContain('!cursor-not-allowed')
		})

		test('placeholder', async () => {
			await wrapper.setProps({ placeholder: 'type something' })
			expect(wrapper.html()).toContain('type something')
		})

		describe('modelValue', () => {
			describe('when modelValue is true', () => {
				beforeEach(async () => {
					await wrapper.setProps({ modelValue: true })
				})

				it('should set state value to true', () => {
					expect(wrapper.html()).toContain('dark:bg-purple-800 bg-purple-600')
				})
			})

			describe('when modelValue is false', () => {
				beforeEach(async () => {
					await wrapper.setProps({ modelValue: false })
				})

				it('should set state value to false', () => {
					expect(wrapper.html()).toContain('bg-dark-400')
				})
			})
		})

		describe('trueValue & falseValue', () => {
			beforeEach(async () => {
				await wrapper.setProps({ trueValue: 'ON' })
				await wrapper.setProps({ falseValue: 'OFF' })
			})

			describe('trueValue', () => {
				describe('when modelValue is true', () => {
					beforeEach(async () => {
						await wrapper.setProps({ modelValue: 'ON' })
					})

					it('should set state value to true', () => {
						expect(wrapper.html()).toContain('dark:bg-purple-800 bg-purple-600')
					})

					describe('when toggle', () => {
						beforeEach(async () => {
							const div = wrapper.find('div')
							await div.trigger('click')
						})

						it('should emit input event', () => {
							expect(wrapper.emitted('input')![0][0]).toBe('OFF')
						})
					})
				})
			})

			describe('falseValue', () => {
				describe('when modelValue is false', () => {
					beforeEach(async () => {
						await wrapper.setProps({ modelValue: 'OFF' })
					})

					it('should set state value to true', () => {
						expect(wrapper.html()).toContain('bg-dark-400')
					})

					describe('when toggle', () => {
						beforeEach(async () => {
							const div = wrapper.find('div')
							await div.trigger('click')
						})

						it('should emit input event', () => {
							expect(wrapper.emitted('input')![0][0]).toBe('ON')
						})
					})
				})
			})
		})
	})

	describe('when toggle', () => {
		describe('when modelValue is true', () => {
			beforeEach(async () => {
				await wrapper.setProps({ modelValue: true })

				const div = wrapper.find('div')
				await div.trigger('click')
			})

			it('should emit input event', () => {
				expect(wrapper.emitted('input')![0][0]).toBe(false)
			})
		})

		describe('when modelValue is false', () => {
			beforeEach(async () => {
				await wrapper.setProps({ modelValue: false })

				const div = wrapper.find('div')
				await div.trigger('click')
			})

			it('should emit input event', () => {
				expect(wrapper.emitted('input')![0][0]).toBe(true)
			})
		})
	})
})
