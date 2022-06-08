<template>
	<article class="bg-gradient-to-br from-orange-500 to-yellow-500 outline-dark-200 outline rounded-md w-96">
		<div class="flex items-center space-x-2 bg-dark-800 w-max rounded-br-md px-3 py-1">
			<h1 class="dark:text-slate-200 font-medium">Relay</h1>
			<div class="rounded-full h-2 w-2 bg-green-400" />
		</div>

		<div class="flex justify-center items-center mx-auto w-28 h-28 bg-light-50 shadow-2xl shadow-dark-800 rounded-full">
			<i-lucide-settings-2 class="h-10 w-10 dark:text-dark-400" />
		</div>

		<div class="flex flex-col space-y-3 my-8">
			<div class="flex items-center justify-between px-8 py-3">
				<span class="text-light-100 text-lg font-medium">Стан</span>
				<AppToggle />
			</div>
		</div>

		<div class="flex justify-between items-center bg-light-50/10 py-4 px-8">
			<span class="text-light-300">Детально</span>
			<i-lucide-arrow-right class="text-dark-600" />
		</div>
	</article>
</template>
