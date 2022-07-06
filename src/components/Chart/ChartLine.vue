<script setup lang="ts">
import {
	Chart as ChartJS,
	Title,
	Tooltip,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	CategoryScale,
	Plugin,
} from 'chart.js'
import type { TChartData, TChartOptions } from 'vue-chartjs/dist/types'
import { Line } from 'vue-chartjs'
import { ElementData, Period } from '@/models'
import { useMain } from '@/store/main'
import { computed } from '@vue/reactivity'

ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale)

const props = defineProps<{
	title: string
	chartId: string
	datasetIdKey?: string
	chartData: ElementData[]
	width: number
	height: number
	cssClasses?: string
	styles?: Partial<CSSStyleDeclaration>
	plugins?: Plugin<'line'>[]
	period: Period
}>()

const mainStore = useMain()

const theme = computed(() => mainStore.theme)
const themeSettings = computed(() => {
	return {
		title: theme.value === 'light' ? '#334155' : '#DEE2E6',
		axisText: theme.value === 'light' ? '#0F172A' : '#9CA3AF',
		yAxisGrid: theme.value === 'light' ? '#F3F4F6' : '#323232',
		borderColor: theme.value === 'light' ? '#a78bfa' : '#7c3aed',
	}
})

const options = computed(() => {
	return {
		plugins: {
			legend: { display: false },
			title: {
				align: 'start',
				text: props.title,
				color: themeSettings.value.title,
				display: true,
				padding: {
					top: 5,
					bottom: 30,
				},
				font: {
					size: 18,
					family: 'e-Ukraine',
					weight: '400',
				},
			},
			tooltip: {
				displayColors: false,
			},
		},
		scales: {
			yAxis: {
				grid: {
					color: themeSettings.value.yAxisGrid,
					borderWidth: 0,
				},
				ticks: {
					stepSize: 1,
					color: themeSettings.value.axisText,
					font: {
						size: 12,
						family: 'e-Ukraine',
						weight: '400',
					},
				},
			},
			xAxis: {
				grid: {
					display: false,
				},
				ticks: {
					padding: 10,
					color: themeSettings.value.axisText,
					font: {
						size: 12,
						family: 'e-Ukraine',
						weight: '400',
					},
				},
			},
		},
	}
})

const transformedData = computed<TChartData<'line'>>(() => {
	const datasets = [
		{ data: [] as number[], label: 'Температура', borderColor: themeSettings.value.borderColor, tension: 0.25 },
	]
	const labels: string[] = []

	props.chartData.forEach((item) => {
		switch (props.period) {
			case 'hour':
				labels.push(String(new Date(item.date).getMinutes()))
				break

			case 'day':
				labels.push(new Date(item.date).getHours() + ':00')
				break

			case 'week':
				labels.push(
					new Date(item.date).getDate() + ' ' + new Date(item.date).toLocaleString('default', { month: 'short' })
				)
				break

			case 'month':
				labels.push(String(new Date(item.date).getDate()))
				break
		}

		datasets[0].data.push(item.value)
	})

	return { datasets, labels }
})
</script>

<template>
	<Line
		:chart-options="(options as TChartOptions<'line'>)"
		:chart-data="transformedData"
		:chart-id="chartId"
		:dataset-id-key="datasetIdKey"
		:plugins="plugins"
		:css-classes="cssClasses"
		:styles="styles"
		:width="width"
		:height="height"
	/>
</template>
