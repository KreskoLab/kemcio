import { describe, beforeEach, it, expect } from '@jest/globals'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import AppSteps from '@/components/App/AppSteps.vue'

describe('AppSteps', () => {
	let wrapper: VueWrapper<InstanceType<typeof AppSteps>>

	beforeEach(() => {
		wrapper = shallowMount(AppSteps as any, {
			props: {
				step: 1,
				steps: 3,
			},
		})
	})

	describe('render', () => {
		it('renders properly', () => {
			expect(wrapper.isVisible()).toBeTruthy()
		})
	})

	describe('Props', () => {
		describe('steps', () => {
			it('should render steps', () => {
				const steps = wrapper.findAll('li')
				expect(steps.length).toBe(3)
			})
		})

		describe('step', () => {
			it('should indicate current step', () => {
				const step = wrapper.find('li')
				expect(step.html()).toContain('bg-purple-500')
			})

			describe('when step grater then 1', () => {
				beforeEach(async () => {
					await wrapper.setProps({ step: 2 })
				})

				it('should indicate passed steps', () => {
					const steps = wrapper.findAll('li').filter((item) => item.classes().includes('bg-purple-500'))
					expect(steps.length).toBe(2)
				})
			})
		})
	})
})
