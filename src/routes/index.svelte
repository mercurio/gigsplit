<script>
	import Select, {Option} from '@smui/select'
	import Textfield from '@smui/textfield'
	import {artist, album, date, genre, saveStore} from '../stores.js'
	import {genres} from '../genres.js'

</script>

<svelte:head>
	<title>Settings</title>
</svelte:head>

<div class="wrapper"> 
	<h1>Session Settings</h1>
	<Textfield bind:value={$artist} on:change="{saveStore}" label="Artist" />
	<br />
	<Textfield bind:value={$album} on:change="{saveStore}" label="Album" />
	<br />
	<Textfield bind:value={$date} on:change="{saveStore}" type="date" label="Date" />
	<br />
	<Select bind:value={$genre} on:change="{saveStore}" label="Genre">
		{#each genres as g}
			<Option value={g} selected={$genre === g}>{g}</Option>
		{/each}
	</Select>
</div>

<style>
	h1, .wrapper {
		text-align: center;
		margin: 0 auto;
	}

	h1 {
		margin: 0 0 0.5em 0;
	}
</style>
